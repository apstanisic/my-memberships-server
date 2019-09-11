import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompaniesController } from './company.controller';
import { AccessControlModule } from '../core/access-control/access-control.module';
import { CompaniesRolesModule } from '../companies-roles/companies-roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CompaniesRolesModule,
    AccessControlModule,
  ],
  controllers: [CompaniesController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
