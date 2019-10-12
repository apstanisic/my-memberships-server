import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { LocationsModule } from '../locations/locations.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CoreModule } from '../core/core.module';
import { PaymentModule } from '../payment/payment.module';
import { PricingPlanModule } from '../pricing-plan/pricing-plan.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    TypeOrmModule.forRoot(),
    UserModule,
    LocationsModule,
    CompanyModule,
    SubscriptionModule,
    ArrivalsModule,
    PaymentModule,
    PricingPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
