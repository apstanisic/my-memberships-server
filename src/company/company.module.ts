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
  ],
  providers: [CompanyService, CompanyImagesService, CompanyRolesService],
  exports: [CompanyService],
})
export class CompanyModule {}
