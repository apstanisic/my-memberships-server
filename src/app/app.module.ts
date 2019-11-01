import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { CONFIG_OPTIONS, CoreModule } from 'nestjs-extra';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompanyModule } from '../company/company.module';
import {
  allRoles,
  casbinModel,
  casbinPolicies,
} from '../config/access-control-config';
import { appEntities } from '../config/db-config';
import { LocationsModule } from '../locations/locations.module';
// import { CoreModule } from '../core/core.module';
import { PaymentModule } from '../payment/payment.module';
import { PricingPlanModule } from '../pricing-plan/pricing-plan.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const env = readFileSync('.env');

@Module({
  imports: [
    CoreModule.forRoot({
      ignore: [],
      storage: {},
      db: { entities: appEntities, usingAccessControl: true },
      config: { configs: env },
      accessControl: {
        model: casbinModel,
        policies: casbinPolicies,
        availableRoles: allRoles,
      },
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
export class AppModule {
  // forRoot(): DynamicModule {
  // }
}
