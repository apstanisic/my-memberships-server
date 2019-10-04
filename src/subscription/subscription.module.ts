import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';
import { UserSubscriptionController } from './user-subscription.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), CompanyModule],
  controllers: [SubscriptionController, UserSubscriptionController],
  exports: [SubscriptionService],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
