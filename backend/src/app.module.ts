import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';
import { Company } from './companies/companies.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
      entities: [Company],
    }),
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
