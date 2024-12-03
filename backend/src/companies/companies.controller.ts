import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { Company } from './companies.entity';
import { PageOptionsDto } from '../page-options.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch a list of companies' })
  @ApiOkResponse({
    description: 'List of companies',
    type: Company,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Companies not found',
  })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const res = await this.service.findAll(pageOptionsDto);
    if (res.data.length === 0) {
      throw new HttpException('Companies not found', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  @Post()
  @ApiOperation({ summary: 'Insert predefined json to company table' })
  @ApiCreatedResponse({ description: 'Company data inserted' })
  @ApiBadRequestResponse({ description: 'Companies already exist' })
  async createAll() {
    const pageOptionsDto = new PageOptionsDto();
    const res = await this.service.findAll(pageOptionsDto);
    if (res.data.length !== 0) {
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
      return { status: 201, body: 'Company data inserted' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
