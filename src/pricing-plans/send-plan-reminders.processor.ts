import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Notification, NotificationService } from 'nestjs-extra';
import { Between } from 'typeorm';
import { pricingPlanQueue, PricingPlanQueueTasks } from './pricing-plan.consts';
import { PricingPlanService } from './pricing-plans.service';

/** Remind owner that their plan soon expires */
@Processor(pricingPlanQueue)
export class SendPlanRemindersProcessor {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly pricingPlanService: PricingPlanService,
  ) {
    this.startCronService();
  }

  @Process(PricingPlanQueueTasks.sendReminders)
  async startCronService(): Promise<void> {
    new Logger().log('Start checking plans', 'Pricing Plan');
    await this.expireInADay();
    await this.expireInAWeek();
  }

  /**
   * Implementation of creating notification.
   * Check for plans that expire between privided dates,
   * not auto renewable, and send them notification.
   */
  private async sendNotifications(start: Date, end: Date): Promise<Notification[]> {
    const plans = await this.pricingPlanService.find(
      { expiresAt: Between(start, end), autoRenew: false },
      { relations: ['company'] },
    );

    const planPromises = plans.map(plan =>
      this.notificationService.addNotification({
        title: `Your plan in company ${plan.company.name} expires soon.`,
        userId: plan.company.ownerId,
      }),
    );
    return Promise.all(planPromises);
  }

  /** Notify owner which company expires in a week */
  private async expireInAWeek(): Promise<Notification[]> {
    const nextWeek = moment()
      .add(1, 'week')
      .toDate();

    const inSixDays = moment()
      .add(6, 'days')
      .toDate();

    return this.sendNotifications(inSixDays, nextWeek);
  }

  /** Notify owner which company expires in a day */
  private async expireInADay(): Promise<Notification[]> {
    const tomorrow = moment()
      .add(1, 'day')
      .toDate();

    return this.sendNotifications(new Date(), tomorrow);
  }
}
