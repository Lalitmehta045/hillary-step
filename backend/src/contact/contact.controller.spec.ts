import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  CreateEnquiryDto,
  UpdateEnquiryStatusDto,
  UpdateEnquiryPriorityDto,
  EnquiryFilterDto,
} from './dto/contact.dto';

describe('ContactController', () => {
  let controller: ContactController;
  let contactService: jest.Mocked<ContactService>;

  beforeEach(async () => {
    const mockContactService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      updatePriority: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: mockContactService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<ContactController>(ContactController);
    contactService = module.get(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createContact', () => {
    it('should submit a valid contact enquiry and call service', async () => {
      const dto: CreateEnquiryDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (USA) 5551234567',
        companyName: 'Acme',
        message: 'Test message',
      };
      const ip = '127.0.0.1';
      contactService.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await controller.createContact(dto, ip);

      expect(contactService.create).toHaveBeenCalledWith(dto, ip);
      expect(result).toEqual({ id: '1', ...dto });
    });

    it('should handle rate limit scenario by expecting service to reject (mocked)', async () => {
      const dto: CreateEnquiryDto = {
        name: 'Spammer',
        email: 'spam@example.com',
        phone: '+1 (USA) 5550000000',
        companyName: 'SpamCo',
        message: 'Spam message body',
      };
      const ip = '192.168.0.10';
      contactService.create.mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(controller.createContact(dto, ip)).rejects.toThrow(
        'Rate limit exceeded',
      );
    });

    it('should handle duplicate submission scenario by expecting service to reject (mocked)', async () => {
      const dto: CreateEnquiryDto = {
        name: 'Duplicator',
        email: 'dup@example.com',
        phone: '+1 (USA) 5551111111',
        companyName: 'DupCo',
        message: 'Duplicate message body',
      };
      const ip = '10.0.0.1';
      contactService.create.mockRejectedValue(
        new Error('Duplicate submission'),
      );

      await expect(controller.createContact(dto, ip)).rejects.toThrow(
        'Duplicate submission',
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of enquiries based on filters', async () => {
      const filters: EnquiryFilterDto = { page: 1, pageSize: 10 };
      const mockResult = { data: [], meta: { total: 0 } };
      contactService.findAll.mockResolvedValue(mockResult as any);

      const result = await controller.findAll(filters);

      expect(contactService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single enquiry', async () => {
      const mockEnquiry = { id: '123' };
      contactService.findOne.mockResolvedValue(mockEnquiry as any);

      const result = await controller.findOne('123');

      expect(contactService.findOne).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEnquiry);
    });
  });

  describe('updateStatus', () => {
    it('should update enquiry status', async () => {
      const dto: UpdateEnquiryStatusDto = { status: 'RESOLVED' } as any;
      const mockResult = { id: '1', status: 'RESOLVED' };
      contactService.updateStatus.mockResolvedValue(mockResult as any);

      const result = await controller.updateStatus('1', dto);

      expect(contactService.updateStatus).toHaveBeenCalledWith('1', 'RESOLVED');
      expect(result).toEqual(mockResult);
    });
  });

  describe('updatePriority', () => {
    it('should update enquiry priority', async () => {
      const dto: UpdateEnquiryPriorityDto = { priority: 'HIGH' } as any;
      const mockResult = { id: '1', priority: 'HIGH' };
      contactService.updatePriority.mockResolvedValue(mockResult as any);

      const result = await controller.updatePriority('1', dto);

      expect(contactService.updatePriority).toHaveBeenCalledWith('1', 'HIGH');
      expect(result).toEqual(mockResult);
    });
  });
});
