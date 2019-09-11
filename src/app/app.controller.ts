import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  homePage(): string {
    return 'My Subscriptions Home Page';
  }
}
