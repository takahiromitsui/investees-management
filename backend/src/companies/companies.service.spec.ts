import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './companies.entity';

describe('CompaniesService', () => {
  let service: CompaniesService;
  const mockCompaniesRepo = {
    find: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          name: 'Mayer and Sons',
          country: 'Sweden',
          foundingDate: new Date('2021-06-11T02:09:34Z'),
          description: 'Secured scalable standardization',
        },
        {
          id: 2,
          name: 'Bartoletti and Sons',
          country: null,
          foundingDate: null,
          description: 'Sharable contextually-based instruction set',
        },
      ]),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompaniesRepo,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of companies with length 2', async () => {
    const companies = await service.findAll();
    expect(companies).toHaveLength(2);
  });
});
