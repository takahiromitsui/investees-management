import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal, UpdateDeal } from './deals.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../page-options.dto';
import { PageMetaDto } from '../page-meta.dto';
import { PageDto } from '../page.dto';

@Injectable()
export class DealsService {
  constructor(@InjectRepository(Deal) private repo: Repository<Deal>) {}

  async insert(deals: Deal[]) {
    await this.repo.insert(deals);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.repo.createQueryBuilder('deal');
    queryBuilder
      .orderBy('deal.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
  async update(id: number, updateDeal: UpdateDeal) {
    const deal = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!deal) {
      throw new NotFoundException(`Deal with id ${id} not found`);
    }
    await this.repo
      .createQueryBuilder()
      .update(Deal)
      .set({
        ...updateDeal,
      })
      .where('id = :id', { id: id })
      .execute();

    return await this.repo.findOne({
      where: {
        id: id,
      },
    });
  }
}
