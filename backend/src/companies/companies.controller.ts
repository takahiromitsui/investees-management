import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { Company } from './companies.entity';
import { PageOptionsDto } from '../page-options.dto';
import { SearchDto } from '../search.dto';
import { CreateDeal, Deal } from '../deals/deals.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './companies.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  @ApiOperation({ summary: '(protected) Fetch a list of companies' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({
    description: 'List of companies',
    type: Company,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Companies not found',
  })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchDto: SearchDto,
  ) {
    const res = await this.service.findAll(pageOptionsDto, searchDto);
    if (!res.data || res.data.length === 0) {
      throw new HttpException('Companies not found', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  @ApiOperation({ summary: '(protected) Fetch a company' })
  @ApiOkResponse({
    description: 'Company',
    type: Company,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Company not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.service.findOne(id);
    if (!res) {
      throw new HttpException('Companies not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: HttpStatus.OK,
      body: res,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  @ApiOperation({ summary: '(protected) Create a company' })
  @ApiOkResponse({ description: 'Company created successfully', type: Company })
  @ApiNotFoundResponse({ description: 'Failed to create a company' })
  async create(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.service.create(createCompanyDto);
      return {
        status: HttpStatus.OK,
        body: company,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  @ApiOperation({ summary: '(protected) Update a company' })
  @ApiOkResponse({ description: 'Company updated successfully' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const res = await this.service.update(id, updateCompanyDto);
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

  @UseGuards(AuthenticatedGuard)
  @Post(':id/deals')
  @ApiOperation({ summary: '(protected) Create a deal for a company' })
  @ApiCreatedResponse({ description: 'Deal created successfully', type: Deal })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async createDeal(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDeal: CreateDeal,
  ) {
    try {
      const res = await this.service.createDeal(id, createDeal);
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

  @Post('/insert')
  @ApiOperation({ summary: 'Insert predefined json to company table' })
  @ApiCreatedResponse({ description: 'Company data inserted' })
  @ApiBadRequestResponse({ description: 'Companies already exist' })
  async createAll() {
    const pageOptionsDto = new PageOptionsDto();
    const searchDto = new SearchDto();
    const res = await this.service.findAll(pageOptionsDto, searchDto);
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
