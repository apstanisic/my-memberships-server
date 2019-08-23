import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './company.controller';
import { UserCompanyResolver } from './company.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompanyService, UserCompanyResolver],
  exports: [CompanyService]
})
export class CompanyModule {}
