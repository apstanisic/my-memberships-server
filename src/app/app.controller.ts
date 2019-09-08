import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  homePage() {
    return 'My Subscriptions Home Page';
  }
}
