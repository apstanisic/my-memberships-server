import * as moment from 'moment';
import * as Faker from 'faker';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { Image, UUID, Struct } from '../../core/types';
import { generateAllImageSizes } from './sharp';
import { StorageService } from '../../core/storage/storage.service';

@Injectable()
export class CompanyImagesService {
  constructor(private readonly storage: StorageService) {}

  private genName(size: string, extension = 'jpeg'): string {
    const uuid = Faker.random.uuid();
    const formatedDate = moment().format('YYYY/MM/DD');
    return `${formatedDate}/${uuid}/_${size}.${extension}`;
  }

  async addImage(file: any, initialImages: Image[]): Promise<Image[]> {
    const images = [...initialImages];
    const storedImages: Promise<string>[] = [];
    // Generate all sizes for given image
    const allSizes = await generateAllImageSizes(file);
    // Store image on server or service
    storedImages.push(this.storage.put(allSizes.xs, this.genName('xs')));
    storedImages.push(this.storage.put(allSizes.sm, this.genName('sm')));
    storedImages.push(this.storage.put(allSizes.md, this.genName('md')));
    storedImages.push(this.storage.put(allSizes.lg, this.genName('lg')));

    const url = await Promise.all(storedImages);

    images.push({
      id: Faker.random.uuid(),
      position: initialImages.length - 1,
      xs: url[0],
      sm: url[1],
      md: url[2],
      lg: url[3],
    });

    // Sort images by it's position
    return images.sort((img1, img2) =>
      img1.position <= img2.position ? -1 : 1,
    );
  }

  /** Remove all sizes for provided image. */
  async removeImage(imageId: UUID, images: Image[]): Promise<Image[]> {
    const image = images.find(img => img.id === imageId);

    if (image) {
      const deletingImages: Promise<void>[] = [];
      const { xs, sm, md, lg } = image;

      if (xs) deletingImages.push(this.storage.delete(xs));
      if (sm) deletingImages.push(this.storage.delete(sm));
      if (md) deletingImages.push(this.storage.delete(md));
      if (lg) deletingImages.push(this.storage.delete(lg));

      Promise.all(deletingImages);
    }

    // Remove deleted image from array, and then fix array positions.
    return images
      .filter(img => img.id !== imageId)
      .map((img, i) => {
        img.position = i;
        return img;
      });
  }

  /** @todo */
  private storeImagesToStorage(): any {}

  /** @todo */
  private removeImageFromStorage(): any {}
}
