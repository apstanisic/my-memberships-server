import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';
import { CompanyConfigsModule } from '../company-config/company-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    BullModule.registerQueue({ name: 'company-images' }),
    CompanyConfigsModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
