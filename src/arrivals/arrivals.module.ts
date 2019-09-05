import { Module } from '@nestjs/common';
import { ArrivalsService } from './arrivals.service';
import { ArrivalsController } from './arrivals.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  providers: [ArrivalsService],
  controllers: [ArrivalsController],
  imports: [SubscriptionModule],
})
export class ArrivalsModule {}
