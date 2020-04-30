import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StorageImagesService } from 'nestjs-extra';
import { CompanyImage } from './company-image.entity';
import { companyImagesQueue, CompanyImagesQueueTasks } from './company-images.consts';
import { CompanyImagesService } from './company-images.service';

@Processor(companyImagesQueue)
export class CompanyImagesProcessor {
  constructor(
    // private readonly storageImagesService: StorageImagesService,
    private readonly companyImagesService: CompanyImagesService,
  ) {}

  @Process(CompanyImagesQueueTasks.generateImages)
  async generateImagesFromOriginal(job: Job<{ image: CompanyImage }>): Promise<void> {
    this.companyImagesService.generateImageSizes(job.data.image);
  }

  // @Process(CompanyImagesQueueTasks.deleteImage)
  // async deleteImageFromStorage(job: Job<CompanyImage>): Promise<void> {
  //   const image = job.data;
  //   await this.storageImagesService.removeImage(image);
  //   // return image;
  // }
}
