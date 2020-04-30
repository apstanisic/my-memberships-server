import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './location.entity';
import { LocationImagesController } from '../location-images/location-images.controller';
import { LocationImagesService } from '../location-images/location-images.service';
import { LocationImage } from '../location-images/location-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, LocationImage]),
    BullModule.registerQueue({ name: 'app' }),
  ],
  providers: [LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
