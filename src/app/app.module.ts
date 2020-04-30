import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService, CoreModule, REDIS_HOST, REDIS_PORT, initQueue } from 'nestjs-extra';
import { LocationImagesModule } from 'src/location-images/location-images.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyConfigsModule } from '../company-config/company-config.module';
import { CompanyImagesModule } from '../company-images/company-images.module';
import { CompanyLogsModule } from '../company-logs/company-logs.module';
import { CompanyRolesModule } from '../company-roles/company-roles.module';
import { allRoles, casbinModel, policies } from '../config/access-control-config';
import { appEntities } from '../config/db-config';
import { LocationsModule } from '../locations/locations.module';
import { PaymentsModule } from '../payments/payments.module';
import { PricingPlansModule } from '../pricing-plans/pricing-plans.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UserModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/** First module */
@Module({
  imports: [
    BullModule.registerQueueAsync(initQueue('app')),
    CoreModule.forRoot({
      storage: {},
      db: { entities: appEntities },
      config: { envFilePath: `${__dirname}/../../../.env` },
      accessControl: { policies, model: casbinModel, availableRoles: allRoles },
      dbLog: true,
      notifications: true,
      mail: true,
      useMq: true,
    }),
    UserModule,
    CompaniesModule,
    CompanyLogsModule,
    CompanyImagesModule,
    CompanyRolesModule,
    LocationsModule,
    LocationImagesModule,
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
