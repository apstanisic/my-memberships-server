import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';
import { PricingPlansController } from './pricing-plans.controller';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plans.service';
import { SendPlanRemindersCronService } from './send-plan-reminders.cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingPlan]), CompaniesModule],
  providers: [PricingPlanService, SendPlanRemindersCronService],
  controllers: [PricingPlansController],
})
export class PricingPlansModule {}
