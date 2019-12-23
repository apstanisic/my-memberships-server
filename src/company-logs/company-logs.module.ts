import { Module } from '@nestjs/common';
import { CompanyLogsController } from './company-logs.controller';
import { CompanyLogsGuard } from './company-logs.guard';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [CompanyLogsController],
  providers: [CompanyLogsGuard],
})
export class CompanyLogsModule {}
