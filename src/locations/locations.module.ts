import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './location.entity';
import { LocationImagesController } from '../location-images/location-images.controller';
import { LocationImagesService } from '../location-images/location-images.service';
import { LocationImage } from '../location-images/location-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, LocationImage])],
  providers: [LocationsService, LocationImagesService],
  controllers: [LocationsController, LocationImagesController],
  exports: [LocationsService],
})
export class LocationsModule {}
