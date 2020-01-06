import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalsService } from './arrivals.service';
import { Arrival } from './arrival.entity';
import { LocationsModule } from '../locations/locations.module';
import { UserArrivalsController } from './user-arrivals.controller';
import { CompanyArrivalsController } from './company-arrivals.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Arrival]), LocationsModule, SubscriptionsModule],
  providers: [ArrivalsService],
  controllers: [UserArrivalsController, CompanyArrivalsController],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
