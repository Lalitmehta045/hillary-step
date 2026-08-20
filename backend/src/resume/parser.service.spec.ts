import { Test, TestingModule } from '@nestjs/testing';
import { ParserService } from './parser.service';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

jest.mock('pdf-parse');
jest.mock('mammoth');

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParserService],
    }).compile();

    service = module.get<ParserService>(ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractText', () => {
    it('should extract text from PDF', async () => {
      (PDFParse as jest.Mock).mockImplementation(() => ({
        getText: jest.fn().mockResolvedValue({ text: 'Mock PDF Content' }),
      }));

      const result = await service.extractText(
        Buffer.from('test'),
        'application/pdf',
      );
      expect(result).toBe('Mock PDF Content');
    });

    it('should extract text from DOCX', async () => {
      const mockMammoth = mammoth.extractRawText as jest.MockedFunction<
        typeof mammoth.extractRawText
      >;
      mockMammoth.mockResolvedValue({
        value: 'Mock DOCX Content',
        messages: [],
      });

      const result = await service.extractText(
        Buffer.from('test'),
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      expect(result).toBe('Mock DOCX Content');
    });

    it('should handle extraction errors gracefully', async () => {
      (PDFParse as jest.Mock).mockImplementation(() => ({
        getText: jest.fn().mockRejectedValue(new Error('Corrupt PDF')),
      }));

      const result = await service.extractText(
        Buffer.from('test'),
        'application/pdf',
      );
      expect(result).toBe('');
    });
  });

  describe('parseStructuredData', () => {
    it('should return null for missing fields', () => {
      const result = service.parseStructuredData(
        'Just some random text without details',
      );
      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
      expect(result.linkedinUrl).toBeNull();
    });

    it('should extract email', () => {
      const result = service.parseStructuredData(
        'Contact me at candidate@example.com please.',
      );
      expect(result.email).toBe('candidate@example.com');
    });

    it('should extract phone', () => {
      const result = service.parseStructuredData('Phone: +1 555-123-4567');
      expect(result.phone).toBe('+1 555-123-4567');
    });

    it('should extract LinkedIn', () => {
      const result = service.parseStructuredData(
        'Profile: https://www.linkedin.com/in/johndoe123/',
      );
      expect(result.linkedinUrl).toBe('https://www.linkedin.com/in/johndoe123');
    });

    it('should extract Portfolio (GitHub)', () => {
      const result = service.parseStructuredData('Code: github.com/johndoe');
      expect(result.portfolioUrl).toBe('https://github.com/johndoe');
    });

    it('should extract full name from first lines', () => {
      const result = service.parseStructuredData(
        'John Doe\nSoftware Engineer\ncandidate@example.com',
      );
      expect(result.fullName).toBe('John Doe');
    });

    it('should ignore common headings for full name', () => {
      const result = service.parseStructuredData(
        'RESUME\nJohn Doe\nSoftware Engineer',
      );
      expect(result.fullName).toBe('John Doe');
    });

    it('should handle empty documents securely', () => {
      const result = service.parseStructuredData('');
      expect(result.fullName).toBeNull();
      expect(result.email).toBeNull();
    });
  });
});
