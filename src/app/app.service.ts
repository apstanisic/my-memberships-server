import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  homePage(): string {
    return 'My subscriptions Api Home page';
  }
}
