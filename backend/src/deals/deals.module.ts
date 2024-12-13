import { forwardRef, Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deals.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deal]),
    forwardRef(() => CompaniesModule),
    AuthModule,
  ],
  providers: [DealsService],
  controllers: [DealsController],
  exports: [DealsService],
})
export class DealsModule {}
