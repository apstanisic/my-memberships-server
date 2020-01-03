import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import {
  CoreModule,
  ConfigService,
  REDIS_HOST,
  REDIS_PORT,
} from 'nestjs-extra';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyConfigsModule } from '../company-config/company-config.module';
import { CompanyImagesModule } from '../company-images/company-images.module';
import { CompanyLogsModule } from '../company-logs/company-logs.module';
import { CompanyRolesModule } from '../company-roles/company-roles.module';
import {
  allRoles,
  casbinModel,
  policies,
} from '../config/access-control-config';
import { appEntities } from '../config/db-config';
import { LocationsModule } from '../locations/locations.module';
import { PaymentsModule } from '../payments/payments.module';
import { PricingPlansModule } from '../pricing-plans/pricing-plans.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UserModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * @todo Improve configModule params
 */
@Module({
  imports: [
    CoreModule.forRoot({
      storage: {},
      db: { entities: appEntities },
      config: { isGlobal: true, envFilePath: `${__dirname}/../../../.env` },
      accessControl: { policies, model: casbinModel, availableRoles: allRoles },
      dbLog: true,
      notifications: true,
      mail: true,
    }),
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          name: 'app',
          redis: { host: config.get(REDIS_HOST), port: config.get(REDIS_PORT) },
        };
      },
    }),

    UserModule,
    LocationsModule,
    CompaniesModule,
    CompanyLogsModule,
    CompanyImagesModule,
    CompanyRolesModule,
    SubscriptionsModule,
    ArrivalsModule,
    PaymentsModule,
    PricingPlansModule,
    CompanyConfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
