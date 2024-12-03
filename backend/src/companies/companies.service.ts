import { Injectable } from '@nestjs/common';
import { Company } from './companies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  async findAll() {
    const companies = await this.repo.find();
    return companies;
  }
}
