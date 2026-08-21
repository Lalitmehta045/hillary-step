import { Injectable, Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

export interface ParsedResumeData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  practice: string | null;
  preferredLocation: string | null;
  skills: string[] | null;
  experience: unknown;
  education: unknown;
}

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  private readonly MAX_TEXT_LENGTH = 100000; // 100k chars max to prevent regex DoS

  async extractText(buffer: Buffer, mimetype: string): Promise<string> {
    try {
      if (mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText({ pageJoiner: '' });
        return data.text || '';
      } else if (
        mimetype === 'application/msword' ||
        mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        try {
          const result = await mammoth.extractRawText({ buffer });
          return result.value || '';
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.warn(`Failed to extract DOCX text: ${message}`);
          return ''; // Safe fallback
        }
      }
      return '';
    } catch (err) {
      this.logger.error('Text extraction failed', err);
      return '';
    }
  }

  parseStructuredData(text: string): ParsedResumeData {
    if (!text || text.trim().length === 0) {
      return this.emptyResult();
    }

    // Truncate to avoid Regex DoS on very large documents
    const safeText = text.substring(0, this.MAX_TEXT_LENGTH);

    return {
      fullName: this.extractFullName(safeText),
      email: this.extractEmail(safeText),
      phone: this.extractPhone(safeText),
      linkedinUrl: this.extractLinkedIn(safeText),
      portfolioUrl: this.extractPortfolio(safeText),
      practice: this.extractPractice(safeText),
      preferredLocation: this.extractLocation(safeText),
      skills: null,
      experience: null,
      education: null,
    };
  }

  private emptyResult(): ParsedResumeData {
    return {
      fullName: null,
      email: null,
      phone: null,
      linkedinUrl: null,
      portfolioUrl: null,
      practice: null,
      preferredLocation: null,
      skills: null,
      experience: null,
      education: null,
    };
  }

  private extractEmail(text: string): string | null {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    if (match) {
      return match[0].toLowerCase().trim();
    }
    return null;
  }

  private extractPhone(text: string): string | null {
    // Check for labeled phone first: Phone: ... or Tel: ... or Mobile: ...
    const labeledMatch = text.match(
      /(?:phone|mobile|tel|cell|contact(?:\s*no\.?)?)[:\s]+(\+?[\d\s().-]{7,25})/i,
    );
    if (labeledMatch) {
      const normalized = this.normalizePhone(labeledMatch[1]);
      if (normalized) return normalized;
    }

    const phoneRegex =
      /(?:\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;
    const match = text.match(phoneRegex);
    if (match) {
      return this.normalizePhone(match[0]);
    }
    return null;
  }

  /** Normalize to a form PhoneField can detect (+91 / +1 / +61). */
  private normalizePhone(raw: string): string | null {
    const cleaned = raw.trim().replace(/[,\s]+$/, '');
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length < 7) return null;

    // Indian mobile: 10 digits starting 6–9, or 91 + 10 digits
    if (/^[6-9]\d{9}$/.test(digits)) {
      return `+91 ${digits}`;
    }
    if (/^91[6-9]\d{9}$/.test(digits)) {
      return `+91 ${digits.slice(2)}`;
    }

    // Already has +country style
    if (cleaned.startsWith('+')) {
      return cleaned.replace(/\s+/g, ' ').trim();
    }

    return cleaned;
  }

  private extractLinkedIn(text: string): string | null {
    const linkedInRegex =
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+/i;
    const match = text.match(linkedInRegex);
    if (match) {
      let url = match[0].trim().replace(/\/+$/, '');
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return url;
    }
    return null;
  }

  private extractPortfolio(text: string): string | null {
    const githubRegex =
      /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i;
    const match = text.match(githubRegex);
    if (match) {
      let url = match[0].trim().replace(/\/+$/, '');
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return url;
    }
    return null;
  }

  private extractPractice(text: string): string | null {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('engineering') ||
      lowerText.includes('software engineer') ||
      lowerText.includes('developer') ||
      lowerText.includes('programmer') ||
      lowerText.includes('full stack') ||
      lowerText.includes('frontend') ||
      lowerText.includes('backend')
    )
      return 'Engineering';
    if (
      lowerText.includes('data') ||
      lowerText.includes('ai') ||
      lowerText.includes('machine learning') ||
      lowerText.includes('analytics') ||
      lowerText.includes('deep learning')
    )
      return 'Data & AI';
    if (
      lowerText.includes('civil') ||
      lowerText.includes('infrastructure') ||
      lowerText.includes('construction') ||
      lowerText.includes('structural')
    )
      return 'Civil & Infrastructure';
    if (
      lowerText.includes('corporate') ||
      lowerText.includes('finance') ||
      lowerText.includes('hr') ||
      lowerText.includes('marketing') ||
      lowerText.includes('operations') ||
      lowerText.includes('business analyst')
    )
      return 'Corporate';
    return null;
  }

  private extractLocation(text: string): string | null {
    const lowerText = text.toLowerCase();
    // Prefer specific countries/cities over ambiguous tokens like bare "us"
    if (
      /\b(india|mumbai|delhi|bangalore|bengaluru|hyderabad|pune|chennai|noida|gurgaon|gurugram|indore|bhopal|kolkata|jaipur|ahmedabad|madhya\s*pradesh|maharashtra|karnataka)\b/i.test(
        lowerText,
      )
    )
      return 'India';
    if (
      /\b(australia|sydney|melbourne|brisbane|perth|adelaide)\b/i.test(
        lowerText,
      )
    )
      return 'Australia';
    if (
      /\b(united states|usa|u\.s\.a\.|new york|california|texas|san francisco|austin|chicago|seattle)\b/i.test(
        lowerText,
      )
    )
      return 'USA';
    return null;
  }

  private extractFullName(text: string): string | null {
    // PDF extractors often glue header fields onto one line — split on common labels.
    const normalized = text
      .replace(
        /\b(location|address|email|e-mail|phone|mobile|tel|linkedin|github|portfolio)\s*[:|\-]/gi,
        '\n$1: ',
      )
      .replace(/\s{2,}/g, ' ');

    const lines = normalized
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const ignoreHeadings = [
      'resume',
      'cv',
      'curriculum vitae',
      'profile',
      'summary',
      'contact',
      'experience',
      'education',
      'skills',
    ];

    for (let i = 0; i < Math.min(15, lines.length); i++) {
      let line = lines[i];
      if (ignoreHeadings.includes(line.toLowerCase())) continue;

      // Cut trailing contact/location fragments glued to the name
      line = line
        .split(
          /\b(?:location|address|email|e-mail|phone|mobile|tel|linkedin|github)\b/i,
        )[0]
        .trim();

      // Remove label prefixes like "Name:", "Full Name:", "Candidate:"
      line = line
        .replace(
          /^(?:full\s*name|name|candidate(?:\s*name)?|applicant(?:\s*name)?)\s*[:\-]\s*/i,
          '',
        )
        .trim();

      if (line.length < 3 || line.length > 60) continue;
      if (this.extractEmail(line)) continue;
      if (/https?:\/\/|www\./i.test(line)) continue;
      if (/@/.test(line)) continue;
      if (/^\+?\d[\d\s().-]{6,}$/.test(line)) continue;

      // Ignore lines that look like job titles, headings, or locations
      if (
        /^(?:software|engineer|developer|senior|junior|lead|manager|director|consultant|architect|location|address)\b/i.test(
          line,
        )
      ) {
        continue;
      }

      // Prefer 2–4 token person names (letters / . ' - only)
      const words = line.split(/\s+/).filter(Boolean);
      if (words.length < 1 || words.length > 4) continue;
      if (!words.every((w) => /^[A-Za-z][A-Za-z.'’-]*$/.test(w))) continue;

      let name = words.join(' ');
      if (name === name.toUpperCase()) {
        name = name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
      }
      return name;
    }

    return null;
  }
}
