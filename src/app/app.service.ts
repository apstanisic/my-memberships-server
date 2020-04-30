import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('app') private queue: Queue) {
    queue.add('test', { some: 'value' });
  }
  homePage(): string {
    return 'My Subscriptions Api Home Page';
  }
}
