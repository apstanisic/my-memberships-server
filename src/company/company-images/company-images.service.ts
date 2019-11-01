import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';
import * as moment from 'moment';
import { Image, StorageImagesService, UUID } from 'nestjs-extra';
import { Location } from '../../locations/location.entity';
// import { StorageImagesService } from '../../core/storage/storage-images.service';
// import { Image, UUID } from '../../core/types';
import { Company } from '../company.entity';

@Injectable()
export class CompanyImagesService {
  constructor(private readonly storageImagesService: StorageImagesService) {}

  async addImage(file: any, initialImages: Image[]): Promise<Image[]> {
    const images = [...initialImages];
    const uuid = Faker.random.uuid();
    const name = `${moment().format('YYYY/MM/DD')}/${uuid}`;
    const [sizes, prefix] = await this.storageImagesService.addImage(file);

    const image: Image = {
      sizes,
      prefix,
      id: uuid,
      position: initialImages.length,
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

    await this.storageImagesService.removeImageByPrefix(image);

    // Remove deleted image from array, and then fix array positions.
    return images
      .filter(img => img.id !== imageId)
      .map((img, i) => {
        img.position = i;
        return img;
      });
  }

  /** Can user add new image to this company. Checks tier and images count */
  canAddImageToCompany(company: Company): boolean {
    const amountOfImages = company.images.length;
    if (company.tier === 'free' && amountOfImages >= 4) return false;
    if (company.tier === 'basic' && amountOfImages >= 6) return false;
    if (company.tier === 'pro' && amountOfImages >= 10) return false;
    if (company.tier === 'enterprise' && amountOfImages >= 20) return false;
    return true;
  }

  /** Can user add new image to this location */
  canAddImageToLocation(location: Location): any {
    const amountOfImages = location.images.length;
    const { company } = location;

    if (company.tier === 'free' && amountOfImages >= 2) return false;
    if (company.tier === 'basic' && amountOfImages >= 5) return false;
    if (company.tier === 'pro' && amountOfImages >= 10) return false;
    if (company.tier === 'enterprise' && amountOfImages >= 30) return false;
    return true;
  }
}
