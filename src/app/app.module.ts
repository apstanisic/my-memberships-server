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
import { ConfigService } from '../core/config/config.service';
import { Log } from '../core/logger/log.entity';

@Module({
  imports: [
    CoreModule.forRoot(),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: 'log_db',
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        host: config.get('LOG_DB_HOST'),
        database: config.get('LOG_DB_DATABASE'),
        port: Number(config.get('LOG_DB_PORT')),
        entities: [Log],
        // username: config.get('LOG_DB_USER'),
        // password: config.get('LOG_DB_PASSWORD'),
      }),
    }),
    UserModule,
    LocationsModule,
    CompanyModule,
    SubscriptionModule,
    ArrivalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
