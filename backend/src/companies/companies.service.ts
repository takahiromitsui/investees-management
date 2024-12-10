import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from './companies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../page-options.dto';
import { PageMetaDto } from '../page-meta.dto';
import { PageDto } from '../page.dto';
import { SearchDto } from '../search.dto';
import { CreateDeal } from '../deals/deals.entity';
import { DealsService } from '../deals/deals.service';
import { CreateCompanyDto, UpdateCompanyDto } from './companies.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
    public dealService: DealsService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto, searchDto: SearchDto) {
    let skip: number | undefined;
    if (pageOptionsDto.page && pageOptionsDto.take) {
      skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    } else {
      skip = undefined;
    }
    const queryBuilder = this.repo.createQueryBuilder('company');
    if (searchDto.search) {
      queryBuilder.where('company.name LIKE :search', {
        search: `%${searchDto.search}%`,
      });
    }
    queryBuilder
      .orderBy('company.id', pageOptionsDto.order)
      .leftJoinAndSelect('company.deals', 'deals')
      .skip(skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async insert(companies: Company[]) {
    await this.repo.insert(companies);
  }

  async findOne(id: number) {
    const company = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['deals'],
    });
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    await this.repo
      .createQueryBuilder()
      .update(Company)
      .set({
        ...updateCompanyDto,
      })
      .where('id = :id', { id: id })
      .execute();

    return await this.repo.findOne({
      where: {
        id: id,
      },
    });
  }

  async createDeal(id: number, createDeal: CreateDeal) {
    const company = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return await this.dealService.create(company, createDeal);
  }

  async getLastCompanyId() {
    const lastCompany = await this.repo
      .createQueryBuilder('company')
      .orderBy('company.id', 'DESC')
      .getOne();

    return lastCompany ? lastCompany.id : 0;
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const lastCompanyId = await this.getLastCompanyId();
    const company = this.repo.create({
      id: lastCompanyId + 1,
      ...createCompanyDto,
    });
    return await this.repo.save(company);
  }
}
