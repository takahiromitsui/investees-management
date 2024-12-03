import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
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
  const mockCompaniesService = {
    findAll: jest.fn(() => Promise.resolve(mockCompanies)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    })
      .overrideProvider(CompaniesService)
      .useValue(mockCompaniesService)
      .compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return an array of companies', async () => {
    const res = await controller.findAll();
    expect(res).toEqual({ status: 200, body: mockCompanies });
  });
});
