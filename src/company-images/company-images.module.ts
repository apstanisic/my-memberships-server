import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initQueue } from 'nestjs-extra';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyImage } from './company-image.entity';
import { companyImagesQueue } from './company-images.consts';
import { CompanyImagesController } from './company-images.controller';
import { CompanyImagesProcessor } from './company-images.processor';
import { CompanyImagesService } from './company-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyImage]),
    HttpModule,
    BullModule.registerQueueAsync(initQueue(companyImagesQueue)),
    CompaniesModule,
  ],
  controllers: [CompanyImagesController],
  providers: [CompanyImagesService, CompanyImagesProcessor],
})
export class CompanyImagesModule {}
