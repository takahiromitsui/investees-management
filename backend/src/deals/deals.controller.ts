import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DealsService } from './deals.service';
import * as path from 'path';
import * as fs from 'fs';
import { Deal } from './deals.entity';
import { CompaniesService } from '../companies/companies.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(
    public service: DealsService,
    public companyService: CompaniesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Insert predefined json to deal table' })
  @ApiCreatedResponse({ description: 'Company data inserted' })
  @ApiBadRequestResponse({ description: 'Companies already exist' })
  async createAll() {
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
