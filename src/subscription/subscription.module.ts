import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import { UserSubscriptionController } from './user-subscription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController, UserSubscriptionController],
  exports: [SubscriptionService],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
