import { Module } from '@nestjs/common';
import { GymService as CompanyService } from './company.service';

@Module({
  providers: [CompanyService]
})
export class CompanyModule {}
