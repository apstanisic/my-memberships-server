import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'nestjs-extra';
import { LocationsModule } from '../locations/locations.module';
import { CompaniesRolesController } from './companies-roles.controller';
import { CompanyImagesController } from './company-images/company-images.controller';
import { CompanyImagesService } from './company-images/company-images.service';
import { CompanyLogsController } from './company-logs.controller';
import { CompanyLogsGuard } from './company-logs.guard';
import { CompanyRolesService } from './company-roles.service';
import { CompaniesController } from './company.controller';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), LocationsModule, RoleModule],
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
    CompanyLogsGuard,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
