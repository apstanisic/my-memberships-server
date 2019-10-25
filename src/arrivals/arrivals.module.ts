import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalsService } from './arrivals.service';
import { LocationArrivalsController } from './location-arrivals.controller';
import { Arrival } from './arrivals.entity';
import { LocationsModule } from '../locations/locations.module';
import { UserArrivalsController } from './user-arrivals.controller';
import { CompanyArrivalsController } from './company-arrivals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Arrival]), LocationsModule],
  providers: [ArrivalsService],
  controllers: [
    LocationArrivalsController,
    UserArrivalsController,
    CompanyArrivalsController,
  ],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
