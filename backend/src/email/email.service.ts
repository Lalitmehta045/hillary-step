import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { Enquiry } from '@prisma/client';

export type EnquiryNotificationPayload = Pick<
  Enquiry,
  | 'name'
  | 'email'
  | 'phone'
  | 'countryCode'
  | 'organization'
  | 'companyName'
  | 'message'
  | 'createdAt'
  | 'enquiryNumber'
>;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly adminEmail: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('email.resendApiKey');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.adminEmail =
      this.configService.get<string>('email.adminNotificationEmail') ||
      'info@hillarystepsolutions.com';
    this.fromEmail =
      this.configService.get<string>('email.from') ||
      'Hillary Step <onboarding@resend.dev>';
  }

  /** Build phone display as country code + number when available. */
  formatPhone(enquiry: EnquiryNotificationPayload): string {
    const phone = (enquiry.phone || '').trim();
    const code = (enquiry.countryCode || '').trim();
    if (code && phone && !phone.includes(code)) {
      return `${code} ${phone}`.trim();
    }
    return phone || code || '—';
  }

  buildEnquiryNotificationContent(enquiry: EnquiryNotificationPayload): {
    subject: string;
    text: string;
    html: string;
  } {
    const visitorName = (enquiry.name || 'Visitor').trim();
    const organization =
      (enquiry.organization || enquiry.companyName || '—').trim() || '—';
    const message = (enquiry.message || '—').trim() || '—';
    const phone = this.formatPhone(enquiry);
    const submittedAt = (
      enquiry.createdAt instanceof Date
        ? enquiry.createdAt
        : new Date(enquiry.createdAt)
    ).toISOString();

    const subject = `New Website Enquiry — ${visitorName}`;
    const text = [
      'New enquiry received from the Hillary Step website.',
      '',
      `Name: ${visitorName}`,
      `Email: ${enquiry.email}`,
      `Phone: ${phone}`,
      `Organization: ${organization}`,
      'Message:',
      message,
      '',
      `Submission date/time: ${submittedAt}`,
      'Source: Hillary Step Website',
      enquiry.enquiryNumber ? `Enquiry #: ${enquiry.enquiryNumber}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <p>New enquiry received from the Hillary Step website.</p>
      <p>
        <strong>Name:</strong> ${escapeHtml(visitorName)}<br />
        <strong>Email:</strong> ${escapeHtml(enquiry.email)}<br />
        <strong>Phone:</strong> ${escapeHtml(phone)}<br />
        <strong>Organization:</strong> ${escapeHtml(organization)}
      </p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      <p>
        <strong>Submission date/time:</strong> ${escapeHtml(submittedAt)}<br />
        <strong>Source:</strong> Hillary Step Website
        ${
          enquiry.enquiryNumber
            ? `<br /><strong>Enquiry #:</strong> ${escapeHtml(enquiry.enquiryNumber)}`
            : ''
        }
      </p>
    `.trim();

    return { subject, text, html };
  }

  /**
   * Send admin notification for a new enquiry.
   * Throws on provider failure so callers can log; callers must not fail the HTTP request.
   */
  async sendEnquiryNotification(
    enquiry: EnquiryNotificationPayload,
  ): Promise<{ id?: string }> {
    if (!this.resend) {
      throw new Error(
        'RESEND_API_KEY is not configured; skipping enquiry notification email',
      );
    }

    const { subject, text, html } =
      this.buildEnquiryNotificationContent(enquiry);

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [this.adminEmail],
      subject,
      text,
      html,
      replyTo: enquiry.email,
    });

    if (error) {
      throw new Error(
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message: string }).message)
          : JSON.stringify(error),
      );
    }

    this.logger.log(
      `Enquiry notification email sent to ${this.adminEmail}` +
        (data?.id ? ` (id=${data.id})` : ''),
    );
    return { id: data?.id };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
