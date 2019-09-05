import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalsService } from './arrivals.service';
import { ArrivalsController } from './arrivals.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { Arrival } from './arrivals.entity';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arrival]),
    LocationsModule,
    SubscriptionModule,
  ],
  providers: [ArrivalsService],
  controllers: [ArrivalsController],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
