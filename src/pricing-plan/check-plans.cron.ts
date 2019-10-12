import { CronJob } from 'cron';

export function startCron(): void {
  // Twice a day check for plan and extend.
  // For more info: https://crontab.guru/
  // At minute 0 past hour 4 and 12.
  // 0 4,12 * * *
  const job = new CronJob('0 4,12 * * *', () => {
    console.log('Implement pricing cron');
  });
  job.start();
}
