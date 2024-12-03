import { Injectable } from '@nestjs/common';
import { Company } from './companies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../page-options.dto';
import { PageMetaDto } from '../page-meta.dto';
import { PageDto } from 'src/page.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  async findAll(pageOptionsDto: PageOptionsDto) {
    // const companies = await this.repo.find();
    const queryBuilder = this.repo.createQueryBuilder('company');
    queryBuilder
      .orderBy('company.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async insert(companies: Company[]) {
    await this.repo.insert(companies);
  }
}
