import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), CompaniesModule],
  controllers: [SubscriptionsController, UserSubscriptionsController],
  exports: [SubscriptionsService],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
