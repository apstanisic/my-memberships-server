import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
