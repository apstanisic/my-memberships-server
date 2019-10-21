import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { PricingPlanController } from './pricing-plan.controller';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plan.service';
import { SendPlanRemindersCronService } from './send-plan-reminders.cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingPlan]), CompanyModule],
  providers: [PricingPlanService, SendPlanRemindersCronService],
  controllers: [PricingPlanController],
})
export class PricingPlanModule {}
