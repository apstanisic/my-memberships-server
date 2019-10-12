import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { startCron } from './check-plans.cron';
import { PricingPlanController } from './pricing-plan.controller';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingPlan]), CompanyModule],
  providers: [PricingPlanService],
  controllers: [PricingPlanController],
})
export class PricingPlanModule {
  constructor() {
    // startCron();
  }
}
