import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyImage } from './company-image.entity';
import { CompanyImagesController } from './company-images.controller';
import { CompanyImagesProcessor } from './company-images.processor';
import { CompanyImagesService } from './company-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyImage]),
    BullModule.registerQueue({ name: 'company-images' }),
    CompaniesModule,
  ],
  controllers: [CompanyImagesController],
  providers: [CompanyImagesService, CompanyImagesProcessor],
})
export class CompanyImagesModule {}
