import { Module } from '@nestjs/common';
import { CompaniesRolesController } from './company-roles.controller';
import { CompanyRolesService } from './company-roles.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [CompaniesRolesController],
  providers: [CompanyRolesService],
})
export class CompanyRolesModule {}
