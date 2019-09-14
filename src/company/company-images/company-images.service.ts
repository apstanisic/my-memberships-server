import * as Faker from 'faker';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { ImageMetadata, UUID } from '../../core/types';

@Injectable()
export class CompanyImagesService {
  async addImage(file: any, images: ImageMetadata[]): Promise<ImageMetadata[]> {
    if (1) throw new NotImplementedException(0);
    // store image
    const url = {};
    const clonedImages = [...images];
    clonedImages.push({
      ...url,
      id: Faker.random.uuid(),
      position: images.length - 1,
    });
    return clonedImages;
  }

  async removeImage(
    imageId: UUID,
    images: ImageMetadata[],
  ): Promise<ImageMetadata[]> {
    const notDeletedImages = [];
    for (let index = 0; index < images.length; index += 1) {
      const img = images[index];
      if (img.id === imageId) {
        throw new NotImplementedException();
      } else {
        notDeletedImages.push(img);
      }
    }
    return notDeletedImages;
  }

  /** @todo */
  private storeImagesToStorege(): any {}

  /** @todo */
  private removeImageFromStorage(): any {}
}
