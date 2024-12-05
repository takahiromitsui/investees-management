import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { DealsModule } from '../deals/deals.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), forwardRef(() => DealsModule)],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
