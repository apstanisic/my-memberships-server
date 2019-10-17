import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  logger = new Logger();
  /**
   * Simple helper for cron job
   * @example
   *  this.startJob('* 1 * * *', () => console.log('It works'));
   */
  startJob(time: string, fn: () => void): CronJob {
    try {
      const job = new CronJob(time, fn);
      job.start();
      return job;
    } catch (error) {
      this.logger.error('Cron error', error);
      throw new InternalServerErrorException();
    }
  }
}
