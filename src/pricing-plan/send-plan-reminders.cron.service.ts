import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Between } from 'typeorm';
import { CronService } from '../core/cron/cron.service';
import { Notification } from '../core/notification/notification.entity';
import { NotificationService } from '../core/notification/notification.service';
import { PricingPlanService } from './pricing-plan.service';

/** Remind owner that their plan soon expires */
@Injectable()
export class SendPlanRemindersCronService {
  constructor(
    private readonly cronService: CronService,
    private readonly notificationService: NotificationService,
    private readonly pricingPlanService: PricingPlanService,
  ) {
    this.startCronService();
  }

  /** Check every night at 4 for plans that need notification. */
  private startCronService(): void {
    new Logger().log('Start checking plans', 'Pricing Plan');
    this.cronService.startJob('0 4 * * *', async () => {
      await this.expireInADay();
      await this.expireInAWeek();
    });
  }

  /**
   * Implementation of creating notification.
   * Check for plans that expire between privided dates,
   * not auto renewable, and send them notification.
   */
  private async sendNotifications(
    start: Date,
    end: Date,
  ): Promise<Notification[]> {
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
