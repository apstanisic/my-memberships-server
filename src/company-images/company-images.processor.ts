import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Image, StorageImagesService } from 'nestjs-extra';

@Processor('company-images')
export class CompanyImagesProcessor {
  constructor(private readonly storageImagesService: StorageImagesService) {}

  @Process('delete-image')
  async deleteImageFromStorage<T extends Image = Image>(
    job: Job<T>,
  ): Promise<T> {
    const image = job.data;
    await this.storageImagesService.removeImage(image);
    return image;
  }
}
