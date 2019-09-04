import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompaniesController } from './company.controller';
import { UserCompanyResolver, CompanyResolver } from './company.resolver';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AccessControlModule],
  controllers: [CompaniesController],
  providers: [CompanyService, CompanyResolver, UserCompanyResolver],
  exports: [CompanyService],
})
export class CompanyModule {}
