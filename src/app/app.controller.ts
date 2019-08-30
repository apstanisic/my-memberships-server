import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequiredRoles } from '../access-control/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  // @SetRoles(['admin', 'user'], 'hello')
  getHome(): string {
    return this.appService.homePage();
  }
}
