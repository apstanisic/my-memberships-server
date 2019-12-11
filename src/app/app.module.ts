import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { CoreModule } from 'nestjs-extra';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompanyModule } from '../company/company.module';
import {
  allRoles,
  casbinModel,
  policies,
} from '../config/access-control-config';
import { appEntities } from '../config/db-config';
import { LocationsModule } from '../locations/locations.module';
import { PaymentModule } from '../payment/payment.module';
import { PricingPlanModule } from '../pricing-plan/pricing-plan.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CoreModule.forRoot({
      storage: {},
      db: { entities: appEntities },
      config: { data: readFileSync('.env') },
      accessControl: { policies, model: casbinModel, availableRoles: allRoles },
      dbLog: true,
      notifications: true,
      mail: true,
    }),
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
