import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PageOptionsDto } from '../page-options.dto';
import { PageDto } from '../page.dto';
import { PageMetaDto } from '../page-meta.dto';

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
    findAll: jest.fn().mockResolvedValue(
      new PageDto(
        mockCompanies,
        new PageMetaDto({
          itemCount: mockCompanies.length,
          pageOptionsDto: new PageOptionsDto(),
        }),
      ),
    ),
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
    const pageOptionsDto = new PageOptionsDto();
    const res = await controller.findAll(pageOptionsDto);
    expect(res.data).toHaveLength(2);
    expect(res.meta.itemCount).toBe(2);
  });
});
