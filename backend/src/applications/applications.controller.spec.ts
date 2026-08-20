import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TurnstileGuard } from '../security/turnstile.guard';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  const mockApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    addNote: jest.fn(),
    getNotes: jest.fn(),
    getActivity: jest.fn(),
    getDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(TurnstileGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create application', async () => {
      const dto = { fullName: 'John Doe' } as any;
      mockApplicationsService.create.mockResolvedValue('result');
      const result = await controller.create(dto, '127.0.0.1');
      expect(result).toBe('result');
      expect(mockApplicationsService.create).toHaveBeenCalledWith(
        dto,
        '127.0.0.1',
      );
    });
  });

  describe('findAll', () => {
    it('should return all applications', async () => {
      const filters = {};
      mockApplicationsService.findAll.mockResolvedValue('result');
      const result = await controller.findAll(filters);
      expect(result).toBe('result');
      expect(mockApplicationsService.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return application by id', async () => {
      mockApplicationsService.findOne.mockResolvedValue('result');
      const result = await controller.findOne('1');
      expect(result).toBe('result');
      expect(mockApplicationsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const dto = { status: 'REVIEWED' } as any;
      const admin = { id: 'admin-id' } as any;
      mockApplicationsService.updateStatus.mockResolvedValue('result');
      const result = await controller.updateStatus('1', dto, admin);
      expect(result).toBe('result');
      expect(mockApplicationsService.updateStatus).toHaveBeenCalledWith(
        '1',
        'REVIEWED',
        'admin-id',
      );
    });
  });

  describe('addNote', () => {
    it('should add a note', async () => {
      const dto = { content: 'test note' } as any;
      const admin = { id: 'admin-id' } as any;
      mockApplicationsService.addNote.mockResolvedValue('result');
      const result = await controller.addNote('1', dto, admin);
      expect(result).toBe('result');
      expect(mockApplicationsService.addNote).toHaveBeenCalledWith(
        '1',
        'admin-id',
        'test note',
      );
    });
  });

  describe('getNotes', () => {
    it('should return notes', async () => {
      mockApplicationsService.getNotes.mockResolvedValue('result');
      const result = await controller.getNotes('1');
      expect(result).toBe('result');
      expect(mockApplicationsService.getNotes).toHaveBeenCalledWith('1');
    });
  });

  describe('getActivity', () => {
    it('should return activity logs', async () => {
      mockApplicationsService.getActivity.mockResolvedValue('result');
      const result = await controller.getActivity('1');
      expect(result).toBe('result');
      expect(mockApplicationsService.getActivity).toHaveBeenCalledWith('1');
    });
  });

  describe('getDocuments', () => {
    it('should return documents', async () => {
      mockApplicationsService.getDocuments.mockResolvedValue('result');
      const result = await controller.getDocuments('1');
      expect(result).toBe('result');
      expect(mockApplicationsService.getDocuments).toHaveBeenCalledWith('1');
    });
  });
});
