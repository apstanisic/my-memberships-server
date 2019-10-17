import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { LessThan, Repository } from 'typeorm';
import { BaseService } from '../core/base.service';
import { CronService } from '../core/cron/cron.service';
import { Notification } from './notification.entity';
import { UUID } from '../core/types';
import { NotificationService } from './notification.service';

interface AddNotificationParams {
  title: string;
  body?: string;
  userId: UUID;
}

@Injectable()
export class NotificationCronService {
  /** Cron job */
  private cronJob: CronJob;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly cronService: CronService,
  ) {
    this.startWaitToDelete();
  }

  /** Deletes old notifications after six months. This should be done in cron */
  private async deleteOldNotifications(): Promise<void> {
    const sixMonthsBefore = moment()
      .subtract(6, 'months')
      .toDate();

    await this.notificationService.deleteMany({
      createdAt: LessThan(sixMonthsBefore),
    });
  }

  /** Initialize cron job that deletes old notifications */
  private startWaitToDelete(): void {
    // Every night at 3
    this.cronJob = this.cronService.startJob(
      '0 3 * * *',
      this.deleteOldNotifications,
    );
  }
}
