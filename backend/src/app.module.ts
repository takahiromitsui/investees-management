import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';
import { Company } from './companies/companies.entity';
import { DealsModule } from './deals/deals.module';
import { Deal } from './deals/deals.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
      entities: [Company, Deal],
    }),
    CompaniesModule,
    DealsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
