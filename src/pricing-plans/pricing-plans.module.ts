import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initQueue } from 'nestjs-extra';
import { CompaniesModule } from '../companies/companies.module';
import { AutoRenewPlansProcessor } from './auto-renew-plan.processor';
import { CancelExpiredPlansProcessor } from './cancel-expired-plans.processor';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlansController } from './pricing-plans.controller';
import { PricingPlanService } from './pricing-plans.service';
import { SendPlanRemindersProcessor } from './send-plan-reminders.processor';
import { pricingPlanQueue } from './pricing-plan.consts';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingPlan]),
    CompaniesModule,
    BullModule.registerQueueAsync(initQueue(pricingPlanQueue)),
  ],
  providers: [
    PricingPlanService,
    AutoRenewPlansProcessor,
    SendPlanRemindersProcessor,
    CancelExpiredPlansProcessor,
  ],
  controllers: [PricingPlansController],
})
export class PricingPlansModule {}
