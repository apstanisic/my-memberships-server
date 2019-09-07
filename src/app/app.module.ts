import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from '../mail/mail.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { LocationsModule } from '../locations/locations.module';
import { ArrivalsModule } from '../arrivals/arrivals.module';
import { CompaniesRolesModule } from '../companies-roles/companies-roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    // First make good REST then add graphql
    // GraphQLModule.forRoot({
    //   autoSchemaFile: 'schema.graphql',
    //   context: ({ req }) => ({ req }),
    // }),
    ConfigModule,
    AuthModule,
    AccessControlModule,
    MailModule,
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
