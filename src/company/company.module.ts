import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from '../core/access-control/access-control.module';
import { LocationsModule } from '../locations/locations.module';
import { CompaniesRolesController } from './companies-roles.controller';
import { CompanyImagesController } from './company-images/company-images.controller';
import { CompanyImagesService } from './company-images/company-images.service';
import { CompanyLogsController } from './company-logs.controller';
import { CompanyRolesService } from './company-roles.service';
import { CompaniesController } from './company.controller';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { ValidCompanyGuard } from './valid-company.guard';

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
    ValidCompanyGuard,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
