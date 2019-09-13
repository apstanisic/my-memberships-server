import { Module } from '@nestjs/common';
import { CompanyImagesController } from './company-images.controller';
import { CompanyImagesService } from './company-images.service';
import { CompanyModule } from '../company/company.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [CompanyModule, LocationsModule],
  controllers: [CompanyImagesController],
  providers: [CompanyImagesService],
})
export class CompanyImagesModule {}
