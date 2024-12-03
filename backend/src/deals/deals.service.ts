import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from './deals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DealsService {
  constructor(@InjectRepository(Deal) private repo: Repository<Deal>) {}

  async insert(deals: Deal[]) {
    await this.repo.insert(deals);
  }
}
