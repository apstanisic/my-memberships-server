import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalsService } from './arrivals.service';
import { Arrival } from './arrivals.entity';
import { LocationsModule } from '../locations/locations.module';
import { UserArrivalsController } from './user-arrivals.controller';
import { CompanyArrivalsController } from './company-arrivals.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arrival]),
    LocationsModule,
    SubscriptionModule,
  ],
  providers: [ArrivalsService],
  controllers: [UserArrivalsController, CompanyArrivalsController],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
