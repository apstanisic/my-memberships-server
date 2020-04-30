import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initQueue } from 'nestjs-extra';
import { LocationsModule } from 'src/locations/locations.module';
import { LocationImage } from './location-image.entity';
import { locationImagesQueue } from './location-images.consts';
import { LocationImagesController } from './location-images.controller';
import { LocationImagesService } from './location-images.service';
import { LocationImagesProcessor } from './location-images.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationImage]),
    HttpModule,
    BullModule.registerQueueAsync(initQueue(locationImagesQueue)),
    LocationsModule,
  ],
  providers: [LocationImagesService, LocationImagesProcessor],
  controllers: [LocationImagesController],
})
export class LocationImagesModule {}
