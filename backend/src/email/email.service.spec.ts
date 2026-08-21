import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

describe('EmailService', () => {
  let service: EmailService;

  const enquiry = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+91 (IND) 9876543210',
    countryCode: null,
    organization: 'Acme Corp',
    companyName: null,
    message: 'Need staffing help for Q3.',
    createdAt: new Date('2026-08-21T10:00:00.000Z'),
    enquiryNumber: 'ENQ-0042',
  };

  beforeEach(async () => {
    mockSend.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, string> = {
                'email.resendApiKey': 're_test_key',
                'email.adminNotificationEmail':
                  'info@hillarystepsolutions.com',
                'email.from': 'Hillary Step <noreply@hillarystepsolutions.com>',
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build email content with name, email, phone, organization, message', () => {
    const { subject, text } = service.buildEnquiryNotificationContent(enquiry);

    expect(subject).toBe('New Website Enquiry — Jane Doe');
    expect(text).toContain('Name: Jane Doe');
    expect(text).toContain('Email: jane@example.com');
    expect(text).toContain('Phone: +91 (IND) 9876543210');
    expect(text).toContain('Organization: Acme Corp');
    expect(text).toContain('Need staffing help for Q3.');
    expect(text).toContain('Source: Hillary Step Website');
    expect(text).toContain('Submission date/time: 2026-08-21T10:00:00.000Z');
  });

  it('should send enquiry notification via Resend', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email_123' }, error: null });

    const result = await service.sendEnquiryNotification(enquiry);

    expect(result).toEqual({ id: 'email_123' });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['info@hillarystepsolutions.com'],
        subject: 'New Website Enquiry — Jane Doe',
        replyTo: 'jane@example.com',
      }),
    );
    const payload = mockSend.mock.calls[0][0];
    expect(payload.text).toContain('Name: Jane Doe');
    expect(payload.text).toContain('Email: jane@example.com');
    expect(payload.text).toContain('Phone: +91 (IND) 9876543210');
    expect(payload.text).toContain('Organization: Acme Corp');
    expect(payload.text).toContain('Need staffing help for Q3.');
  });

  it('should throw when Resend returns an error', async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: 'provider down' },
    });

    await expect(service.sendEnquiryNotification(enquiry)).rejects.toThrow(
      'provider down',
    );
  });
});
