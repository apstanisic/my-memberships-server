import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CompanySubscriptionResolver,
  SubscriptionResolver,
  UserSubscriptionResolver
} from './subscription.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
  providers: [
    SubscriptionService,
    SubscriptionResolver,
    UserSubscriptionResolver,
    CompanySubscriptionResolver
  ]
})
export class SubscriptionModule {}
