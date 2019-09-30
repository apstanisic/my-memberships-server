import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompaniesController } from './company.controller';
import { CompaniesRolesModule } from '../companies-roles/companies-roles.module';
import { CompanyImagesModule } from './company-images/company-images.module';
import { CompanyImagesController } from './company-images/company-images.controller';
import { CompanyImagesService } from './company-images/company-images.service';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CompaniesRolesModule,
    // CompanyImagesModule,
    LocationsModule,
  ],
  controllers: [CompaniesController, CompanyImagesController],
  providers: [CompanyService, CompanyImagesService],
  exports: [CompanyService],
})
export class CompanyModule {}
