import * as fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { NotificationService, UUID } from 'nestjs-extra';
import { Between, MoreThan } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
// import { CronService } from '../core/cron/cron.service';
import { tierPrices } from './payment-prices';
import { PricingPlan } from './pricing-plan.entity';
import { PricingPlanService } from './pricing-plans.service';
// import { NotificationService } from '../core/notification/notification.service';
// import { UUID } from '../core/types';

@Injectable()
export class AutoRenewPlansCronService {
  constructor(
    private readonly pricingPlanService: PricingPlanService,
    private readonly companyService: CompaniesService,
    private readonly notificationService: NotificationService,
  ) {
    // In 00:30 check if plan has expired and revert company to free tier
    // this.cronService.startJob('30 0 * * *', this.extendPlans);
  }

  /**
   * All companies that plan has expired are reverted to free plan
   * If this expired plan has renewed plan it will not
   */
  @Cron('30 0 * * *')
  async extendPlans(): Promise<void> {
    const prev24h = moment()
      .subtract(1, 'day')
      .toDate();

    // All plans that expired in last 24h,
    // are still in use and are set to autorenew
    const plansToExtend = await this.pricingPlanService.find(
      {
        expiresAt: Between(prev24h, new Date()),
        inUse: true,
        autoRenew: true,
      },
      { relations: ['company'] },
    );

    // If there is newer plan, use him, else renew plan
    Promise.all(
      plansToExtend.map(async plan => {
        const newer = await this.checkForNewerPlan(plan.companyId);
        if (newer) {
          // Switch to newer plan
          await this.pricingPlanService.update(newer, { inUse: true });
          await this.pricingPlanService.update(plan, { inUse: false });
        } else {
          await this.renew(plan);
        }
      }),
    );
  }

  /** Auto renew renews for 1 month */
  private async renew(oldPlan: PricingPlan): Promise<any> {
    //  If provided plan does not have company throw error
    if (!oldPlan.company) {
      throw new InternalServerErrorException('Plan must have company');
    }
    const newPlan = new PricingPlan();
    newPlan.autoRenew = true;
    newPlan.tier = oldPlan.tier;
    newPlan.creditCost = tierPrices[newPlan.tier];
    // Throw if not enough credit
    if (oldPlan.company.credit < newPlan.creditCost) {
      const companyName = oldPlan.company.name;
      await this.notificationService.addNotification({
        title: `You do not have enough credit to autorenew ${companyName}`,
        userId: oldPlan.company.ownerId,
      });
      return;
    }
    newPlan.company = oldPlan.company;
    // Starts at beggining of today
    newPlan.startsAt = moment()
      .startOf('day')
      .toDate();
    // Expires in a month since old plan ends
    newPlan.expiresAt = moment(oldPlan.expiresAt)
      .add(1, 'month')
      .toDate();
    // Save plan, update company credit and disable old plan
    await this.pricingPlanService.create(newPlan);
    await this.pricingPlanService.update(oldPlan, { inUse: false });
    await this.companyService.update(oldPlan.company, {
      credit: oldPlan.company.credit - newPlan.creditCost,
    });
  }

  /** Check if there is newer plan already manually created */
  private async checkForNewerPlan(companyId: UUID): Promise<PricingPlan | undefined> {
    try {
      const nextPlan = await this.pricingPlanService.findOne(
        { companyId, expiresAt: MoreThan(new Date()) },
        { order: { expiresAt: 'ASC' } },
      );
      return nextPlan;
    } catch (error) {
      return undefined;
    }
  }
}
