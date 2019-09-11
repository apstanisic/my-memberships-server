import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../core/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AccessControlModule } from '../core/access-control/access-control.module';
import { LocationsModule } from '../locations/locations.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompaniesRolesModule } from '../companies-roles/companies-roles.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    LocationsModule,
    CompanyModule,
    SubscriptionModule,
    ArrivalsModule,
    CompaniesRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
