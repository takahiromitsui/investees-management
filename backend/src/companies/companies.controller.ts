import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { Company } from './companies.entity';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  @Get()
  async findAll() {
    const res = await this.service.findAll();
    if (res.length === 0) {
      throw new HttpException('Companies not exist', HttpStatus.NOT_FOUND);
    }
    return { status: 200, body: res };
  }

  @Post()
  async createAll() {
    const res = await this.service.findAll();
    if (res.length !== 0) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    try {
      const filePath = path.join('src', 'data', 'companies.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const companyData = JSON.parse(fileContent);
      const companies: Company[] = Object.keys(companyData).map((companyId) => {
        const company = companyData[companyId];
        return {
          id: parseInt(companyId) + 1,
          name: company.name,
          country: company.country,
          foundingDate: new Date(company.founding_date),
          description: company.description,
        } as Company;
      });
      await this.service.insert(companies);
      return { status: 200, body: 'Company data inserted' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
