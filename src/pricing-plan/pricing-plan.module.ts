import { Module } from '@nestjs/common';
import { PricingPlanService } from './pricing-plan.service';

@Module({
  providers: [PricingPlanService]
})
export class PricingPlanModule {}
