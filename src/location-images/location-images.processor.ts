import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LocationImage } from './location-image.entity';
import { LocationImagesService } from './location-images.service';
import { locationImagesQueue, LocationImagesQueueTasks } from './location-images.consts';

const Tasks = LocationImagesQueueTasks;

@Processor(locationImagesQueue)
export class LocationImagesProcessor {
  constructor(private readonly locationImagesService: LocationImagesService) {}

  @Process(Tasks.generateImages)
  async generateImageSizes(job: Job<{ image: LocationImage }>): Promise<void> {
    this.locationImagesService.generateImageSizes(job.data.image);
  }
}
