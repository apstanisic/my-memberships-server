import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { LessThan, MoreThan } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/company.entity';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plans.service';
import { pricingPlanQueue, PricingPlanQueueTasks } from './pricing-plan.consts';

@Injectable()
@Processor(pricingPlanQueue)
export class CancelExpiredPlansProcessor {
  constructor(
    private readonly pricingPlanService: PricingPlanService,
    private readonly companyService: CompaniesService,
  ) {}

  /**
   * All companies that plan has expired are reverted to free plan
   * If this expired plan has renewed plan it will not
   * Find all plans that are expired but still in use
   */
  @Process(PricingPlanQueueTasks.cancelExpired)
  async cancelExpiredPlans(): Promise<void> {
    const updating: Promise<Company | PricingPlan>[] = [];
    // Find just expired plans
    const expiredPlans = await this.pricingPlanService.find(
      { expiresAt: LessThan(new Date()), inUse: true },
      { relations: ['company'] },
    );
    expiredPlans.forEach(async plan => {
      // Cancel this plan
      await this.pricingPlanService.update(plan, { inUse: false });

      // Find plan that comes after this. Throws if not found
      // If found set it to active.
      try {
        const nextPlan = await this.pricingPlanService.findOne(
          {
            companyId: plan.companyId,
            expiresAt: MoreThan(new Date()),
          },
          { order: { expiresAt: 'ASC' } },
        );
        await this.pricingPlanService.update(nextPlan, { inUse: true });
        // If new plan have different tier, change companies tier
        if (nextPlan.tier !== plan.tier) {
          await this.companyService.update(plan.company, {
            tier: nextPlan.tier,
          });
        }
      } catch (error) {
        // If there is not never plan revert company to free tier
        this.companyService.update(plan.company, { tier: 'free' });
      }
    });
    await Promise.all(updating);
  }
}
