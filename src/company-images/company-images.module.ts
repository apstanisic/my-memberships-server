import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyImage } from './company-image.entity';
import { CompanyImagesController } from './company-images.controller';
import { CompanyImagesService } from './company-images.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyImage]), CompaniesModule],
  controllers: [CompanyImagesController],
  providers: [CompanyImagesService],
})
export class CompanyImagesModule {}
