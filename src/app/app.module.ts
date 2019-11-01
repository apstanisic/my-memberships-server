import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTIONS, CoreModule } from 'nestjs-extra';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompanyModule } from '../company/company.module';
import { storageOptions } from '../config/image-config';
import { LocationsModule } from '../locations/locations.module';
// import { CoreModule } from '../core/core.module';
import { PaymentModule } from '../payment/payment.module';
import { PricingPlanModule } from '../pricing-plan/pricing-plan.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { allEntities } from '../config/db-config';
import {
  casbinModel,
  casbinPolicies,
  allRoles,
} from '../config/access-control-config';

@Module({
  imports: [
    // CoreModule.forRoot({ UserModule, ignore: [] }),
    CoreModule.forRoot({
      ignore: [],
      storage: storageOptions,
      db: { entities: allEntities },
      accessControl: {
        model: casbinModel,
        policies: casbinPolicies,
        availableRoles: allRoles,
      },
    }),
    // TypeOrmModule.forRoot(),
    UserModule,
    LocationsModule,
    CompanyModule,
    SubscriptionModule,
    ArrivalsModule,
    PaymentModule,
    PricingPlanModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: CONFIG_OPTIONS,
      useFactory: async (): Promise<string> => '',
    },
  ],
})
export class AppModule {
  // forRoot(): DynamicModule {
  // }
}
