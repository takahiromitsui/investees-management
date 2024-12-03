import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  @Get()
  async findAll() {
    const res = await this.service.findAll();
    if (!res) {
      return { status: 404, body: null };
    }
    return { status: 200, body: res };
  }
}
