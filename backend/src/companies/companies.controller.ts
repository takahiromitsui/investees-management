import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
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
import { Company, UpdateCompany } from './companies.entity';
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
    if (!res.data || res.data.length === 0) {
      throw new HttpException('Companies not found', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a company' })
  @ApiOkResponse({
    description: 'Company',
    type: Company,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Company not found',
  })
  async findOne(@Param('id') id: string) {
    const res = await this.service.findOne(+id);
    if (!res) {
      throw new HttpException('Companies not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: HttpStatus.OK,
      body: res,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiOkResponse({ description: 'Company updated successfully' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(@Param('id') id: string, @Body() updateCompany: UpdateCompany) {
    try {
      const res = await this.service.update(+id, updateCompany);
      return {
        status: HttpStatus.OK,
        body: res,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
