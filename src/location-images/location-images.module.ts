import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from 'src/locations/locations.module';
import { LocationImage } from './location-image.entity';
import { LocationImagesController } from './location-images.controller';
import { LocationImagesService } from './location-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationImage]),
    BullModule.registerQueue({ name: 'app' }),
    LocationsModule,
  ],
  providers: [LocationImagesService],
  controllers: [LocationImagesController],
})
export class LocationImagesModule {}
