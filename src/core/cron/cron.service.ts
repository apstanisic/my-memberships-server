import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  startJob(time: string, fn: () => void): CronJob {
    const job = new CronJob(time, fn);
    return job;
  }
}
