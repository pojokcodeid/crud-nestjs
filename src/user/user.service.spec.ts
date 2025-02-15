import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockImplementation((where: { id: number }) => ({
        id: where.id,
        name: 'Test',
        email: 'test@example.com',
      })),
      create: jest.fn().mockImplementation((data: { [key: string]: any }) => ({
        id: Date.now(),
        ...data,
      })),
      update: jest.fn().mockImplementation((where: { id: number }, data) => ({
        id: where.id,
        ...(data as { name?: string; email?: string }),
      })),
      delete: jest.fn().mockResolvedValue({}),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should find one user by id', async () => {
    expect(await service.findOne(1)).toEqual({
      id: 1,
      name: 'Test',
      email: 'test@example.com',
    });
  });

  // Tambahkan pengujian lainnya
});
