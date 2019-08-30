import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  homePage(): string {
    return 'My subscriptions Api Home page';
  }
}
