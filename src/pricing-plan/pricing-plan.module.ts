import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { PricingPlanController } from './pricing-plan.controller';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plan.service';
import { CheckPlansCronService } from './check-plans.cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingPlan]), CompanyModule],
  providers: [PricingPlanService, CheckPlansCronService],
  controllers: [PricingPlanController],
})
export class PricingPlanModule {}
