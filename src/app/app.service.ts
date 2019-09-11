import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  homePage(): string {
    return 'My Subscriptions Api Home Page';
  }
}
