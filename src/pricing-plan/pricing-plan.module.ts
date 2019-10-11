import { Module } from '@nestjs/common';
import { PricingPlanService } from './pricing-plan.service';
import { PricingPlanController } from './pricing-plan.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule],
  providers: [PricingPlanService],
  controllers: [PricingPlanController],
})
export class PricingPlanModule {}
