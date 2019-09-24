import * as moment from 'moment';
import * as Faker from 'faker';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { ImageMetadata, UUID, Struct } from '../../core/types';
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

  async addImage(file: any, images: ImageMetadata[]): Promise<ImageMetadata[]> {
    if (1) throw new NotImplementedException(0);
    // const toResolve: Promise<{ [key: string]: string }>[] = [];
    const toResolve: Promise<string>[] = [];
    const allSizes = await generateAllImageSizes(file);
    const sizes = Object.keys(allSizes);
    Object.keys(allSizes).forEach(size => {});
    // for (let i = 0; i < sizes.length; i += 1) {
    //   await this.storage.put(allSizes[sizes[i]], this.genName(sizes[i]));
    // }

    // store image
    const url = Promise.all(toResolve);
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
  private storeImagesToStorage(): any {}

  /** @todo */
  private removeImageFromStorage(): any {}
}
