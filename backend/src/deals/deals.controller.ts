import {
  Body,
  Controller,
  // Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  // Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  // ApiNotFoundResponse,
  // ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DealsService } from './deals.service';
import * as path from 'path';
import * as fs from 'fs';
import { Deal, UpdateDeal } from './deals.entity';
import { CompaniesService } from '../companies/companies.service';
import { PageOptionsDto } from '../page-options.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(
    public service: DealsService,
    public companyService: CompaniesService,
  ) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a deal' })
  @ApiOkResponse({ description: 'Deal updated successfully' })
  @ApiNotFoundResponse({ description: 'Deal not found' })
  async update(@Param('id') id: string, @Body() updateDeal: UpdateDeal) {
    try {
      const res = await this.service.update(+id, updateDeal);
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

  // @Get()
  // @ApiOperation({ summary: 'Fetch a list of deals' })
  // @ApiNotFoundResponse({
  //   description: 'Deals not found',
  // })
  // async findAll(@Query() pageOptionsDto: PageOptionsDto) {
  //   const res = await this.service.findAll(pageOptionsDto);
  //   if (!res.data || res.data.length === 0) {
  //     throw new HttpException('Deals not found', HttpStatus.NOT_FOUND);
  //   }
  //   return res;
  // }

  @Post()
  @ApiOperation({ summary: 'Insert predefined json to deal table' })
  @ApiCreatedResponse({ description: 'Deals data inserted' })
  @ApiBadRequestResponse({ description: 'Deals already exist' })
  async createAll() {
    const pageOptionsDto = new PageOptionsDto();
    const res = await this.service.findAll(pageOptionsDto);
    if (res.data.length !== 0) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
    try {
      const filePath = path.join('src', 'data', 'deals.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const dealData = JSON.parse(fileContent);
      const deals: Deal[] = await Promise.all(
        Object.keys(dealData).map(async (dealId) => {
          const deal = dealData[dealId];
          const company = await this.companyService.findOne(deal.company_id);
          return {
            id: parseInt(dealId) + 1,
            date: new Date(deal.date / 1000),
            fundingAmount: deal.funding_amount,
            fundingRound: deal.funding_round,
            company: company,
          };
        }),
      );
      await this.service.insert(deals);
      return { status: 201, body: 'Deals data inserted' };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
