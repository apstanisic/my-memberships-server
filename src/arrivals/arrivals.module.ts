import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalsService } from './arrivals.service';
import { CompanyArrivalsController } from './company-arrivals.controller';
import { Arrival } from './arrivals.entity';
import { LocationsModule } from '../locations/locations.module';
import { UserArrivalsController } from './user-arrivals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Arrival]), LocationsModule],
  providers: [ArrivalsService],
  controllers: [CompanyArrivalsController, UserArrivalsController],
  exports: [ArrivalsService],
})
export class ArrivalsModule {}
