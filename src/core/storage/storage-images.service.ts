import { Injectable } from '@nestjs/common';
import { join as pathJoin } from 'path';
import { StorageService } from './storage.service';
import { ImageSizes } from '../types';
import { generateAllImageSizes } from './sharp';

/**
 * Storage service in charge of storing images.
 * It will generate multiple sizes of image.
 */
@Injectable()
export class StorageImagesService {
  constructor(private readonly storageService: StorageService) {}

  /** Add new image. Name is quasi random number by default. */
  async addImage(image: Buffer, name?: string): Promise<ImageSizes> {
    const basePath = this.formatPath(
      `/image_${Date.now() * (Math.random() * 10000)}`,
    );
    const buffers = await generateAllImageSizes(image);
    const toStore = [];

    toStore.push(this.storageService.put(buffers.xs, `${basePath}_xs.jpeg`));
    toStore.push(this.storageService.put(buffers.sm, `${basePath}_sm.jpeg`));
    toStore.push(this.storageService.put(buffers.md, `${basePath}_md.jpeg`));
    toStore.push(this.storageService.put(buffers.lg, `${basePath}_lg.jpeg`));

    const allSizesArray = await Promise.all(toStore);

    const allSizes: ImageSizes = {
      xs: allSizesArray[0],
      sm: allSizesArray[1],
      md: allSizesArray[2],
      lg: allSizesArray[3],
    };

    return allSizes;
  }

  async removeImage(image: ImageSizes): Promise<void> {
    const { xs, sm, md, lg } = image;
    const deleted = [];
    if (xs) deleted.push(this.storageService.delete(xs));
    if (sm) deleted.push(this.storageService.delete(sm));
    if (md) deleted.push(this.storageService.delete(md));
    if (lg) deleted.push(this.storageService.delete(lg));
    await Promise.all([xs, sm, md, lg]);
  }

  /** Generate folder structure for given file name */
  private formatPath(name: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const dayInMonth = now.getDate();

    return pathJoin(`${year}/${month}/${dayInMonth}`, name);
  }
}
