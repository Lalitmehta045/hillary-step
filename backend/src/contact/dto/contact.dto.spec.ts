import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEnquiryDto } from './contact.dto';

describe('CreateEnquiryDto validation (TEST 3)', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 (USA) 5551234567',
    companyName: 'Acme',
    message: 'Looking for staffing help.',
  };

  async function run(payload: Record<string, unknown>) {
    const dto = plainToInstance(CreateEnquiryDto, payload);
    return validate(dto);
  }

  it('accepts a valid enquiry payload', async () => {
    const errors = await run(valid);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid enquiry and would block email (missing/invalid fields)', async () => {
    const errors = await run({ email: 'not-an-email' });
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props).toEqual(
      expect.arrayContaining(['name', 'email', 'phone', 'message']),
    );
  });

  it('requires organization or companyName', async () => {
    const errors = await run({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1 (USA) 5551234567',
      message: 'Looking for staffing help.',
    });
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props.some((p) => p === 'organization' || p === 'companyName')).toBe(
      true,
    );
  });
});
