import { Injectable } from '@nestjs/common';
import { LessThan, MoreThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Company } from '../companies/company.entity';
import { CompaniesService } from '../companies/companies.service';
// import { CronService } from '../core/cron/cron.service';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plans.service';

@Injectable()
export class CancelExpiredPlansCronService {
  constructor(
    private readonly pricingPlanService: PricingPlanService,
    private readonly companyService: CompaniesService,
  ) {
    // this.startCronService();
  }

  /** In 03:00 check if plan has expired and revert company to free tier */
  // startCronService(): void {
  //   this.cronService.startJob('0 3 * * *', this.cancelExpiredPlans);
  // }

  /**
   * All companies that plan has expired are reverted to free plan
   * If this expired plan has renewed plan it will not
   * Find all plans that are expired but still in use
   */
  @Cron('0 3 * * * *')
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
