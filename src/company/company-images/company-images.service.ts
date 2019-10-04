import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';
import * as moment from 'moment';
import { StorageImagesService } from '../../core/storage/storage-images.service';
import { StorageService } from '../../core/storage/storage.service';
import { Image, UUID } from '../../core/types';

@Injectable()
export class CompanyImagesService {
  constructor(
    private readonly storage: StorageService,
    private readonly storageImagesService: StorageImagesService,
  ) {}

  async addImage(file: any, initialImages: Image[]): Promise<Image[]> {
    const images = [...initialImages];
    const uuid = Faker.random.uuid();
    const name = `${moment().format('YYYY/MM/DD')}/${uuid}`;
    const imagePaths = await this.storageImagesService.addImage(file, name);

    const image: Image = {
      ...imagePaths,
      ...{ id: uuid, position: initialImages.length },
    };

    images.push(image);

    // Sort images by it's position
    return images.sort((img1, img2) =>
      img1.position <= img2.position ? -1 : 1,
    );
  }

  /** Remove all sizes for provided image. */
  async removeImage(imageId: UUID, images: Image[]): Promise<Image[]> {
    const image = images.find(img => img.id === imageId);
    if (!image) return images;

    await this.storageImagesService.removeImage(image);

    // Remove deleted image from array, and then fix array positions.
    return images
      .filter(img => img.id !== imageId)
      .map((img, i) => {
        img.position = i;
        return img;
      });
  }
}
