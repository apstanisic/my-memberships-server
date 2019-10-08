import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompaniesController } from './company.controller';
import { CompanyImagesController } from './company-images/company-images.controller';
import { CompanyImagesService } from './company-images/company-images.service';
import { LocationsModule } from '../locations/locations.module';
import { CompaniesRolesController } from './companies-roles.controller';
import { AccessControlModule } from '../core/access-control/access-control.module';
import { CompanyRolesService } from './company-roles.service';
import { CompanyLogsController } from './company-logs.controller';
import { GetCompany } from './get-company.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    LocationsModule,
    AccessControlModule,
  ],
  controllers: [
    CompaniesController,
    CompaniesRolesController,
    CompanyImagesController,
    CompanyLogsController,
  ],
  providers: [
    CompanyService,
    CompanyImagesService,
    CompanyRolesService,
    GetCompany,
  ],
  exports: [CompanyService, GetCompany],
})
export class CompanyModule {}
