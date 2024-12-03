import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { PageOptionsDto } from '../page-options.dto';

describe('CompaniesService', () => {
  const mockCompanies = [
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
  ];
  let service: CompaniesService;
  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(mockCompanies.length),
    getRawAndEntities: jest.fn().mockResolvedValue({ entities: mockCompanies }),
  };

  const mockCompaniesRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
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
    const pageOptionsDto = new PageOptionsDto();
    const result = await service.findAll(pageOptionsDto);
    expect(result.data).toHaveLength(2);
  });
});
