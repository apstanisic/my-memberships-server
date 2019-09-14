import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompaniesController } from './company.controller';
import { CompaniesRolesModule } from '../companies-roles/companies-roles.module';
import { CompanyImagesModule } from './company-images/company-images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CompaniesRolesModule,
    CompanyImagesModule,
  ],
  controllers: [CompaniesController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
