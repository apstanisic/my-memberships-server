import { InjectQueue } from '@nestjs/bull';
import {
  ForbiddenException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  BaseService,
  ConfigService,
  StorageImagesService,
  StorageService,
  STORAGE_URL,
  UUID,
} from 'nestjs-extra';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Location } from '../locations/location.entity';
import { LocationsService } from '../locations/locations.service';
import { User } from '../users/user.entity';
import { LocationImage } from './location-image.entity';
import { locationImagesQueue, LocationImagesQueueTasks } from './location-images.consts';

interface RemoveImageParams {
  companyId?: UUID;
  locationId: UUID;
  id: UUID;
  user: User;
}

interface AddImageParams {
  locationId: UUID;
  companyId?: UUID;
  fileBuffer: any;
  loggedUser: User;
}

@Injectable()
export class LocationImagesService extends BaseService<LocationImage> {
  constructor(
    @InjectRepository(LocationImage) repository: Repository<LocationImage>,
    @InjectQueue(locationImagesQueue) private readonly queue: Queue,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly storageImagesService: StorageImagesService,
    private readonly storageService: StorageService,
    private readonly locationService: LocationsService,
  ) {
    super(repository);
  }

  /**
   * When controller accepts image, call this method
   * This method stores original image in s3 and db, then
   * generates the job that will create all image sizes,
   * update db with new sizes and then delete original image
   */
  async addImageToProcessing({
    file,
    locationId,
    companyId,
  }: {
    file: Buffer;
    locationId: UUID;
    companyId: UUID;
  }): Promise<LocationImage> {
    // Check if location belongs to company
    const location = await this.locationService.findOne(
      { companyId, id: locationId },
      { relations: ['company'] },
    );

    if (!this.canAddImageToLocation(location)) throw new ForbiddenException('Quota reached');

    // Store original version
    const filename = await this.storageService.put(file, `tmp/${Date.now()}-${uuid()}.jpg`);

    // Store orignal version in db. All sizes are currently original version
    const image = await this.create({
      location,
      original: filename,
      prefix: filename,
      lg: filename,
      md: filename,
      xs: filename,
      sm: filename,
    });

    // Add job that will create all sizes
    this.queue.add(LocationImagesQueueTasks.generateImages, { image }, { attempts: 3 });
    return image;
  }

  /**
   * Generate all sizes for given image, and replace placeholder sizes
   * with newly generated images.
   * @param image Image that has all sizes original image
   */
  async generateImageSizes(image: LocationImage): Promise<LocationImage> {
    // Original image s3 path
    const { original } = image;
    const s3url = this.configService.get(STORAGE_URL);
    const file = await this.httpService
      .get(`${s3url}/${original}`)
      .toPromise()
      .then(r => r.data);

    console.log(file);

    // Generate all image sizes
    const storedImage = await this.storageImagesService.storeImage(file);
    // Set original as undefined
    storedImage.original = undefined;
    // Update image in db
    const updated = await this.update(image, storedImage);
    // Delete original image
    if (original) {
      await this.storageService.delete(original);
    }
    return updated;
  }

  /** Add image to location */
  // async addImage({
  //   locationId,
  //   companyId,
  //   fileBuffer,
  //   loggedUser,
  // }: AddImageParams): Promise<LocationImage> {
  //   const location = await this.locationService.findOne(
  //     { companyId, id: locationId },
  //     { relations: ['company'] },
  //   );

  //   if (!this.canAddImageToLocation(location)) {
  //     throw new ForbiddenException('Quota reached');
  //   }

  //   const image = await this.storageImagesService.storeImage(fileBuffer);
  //   const locationImage = this.repository.create(image);
  //   locationImage.locationId = locationId;
  //   return this.create(image);
  // }

  /**
   * Remove image from location
   * @param user User that removes image. Used for logging
   */
  async removeImage({
    companyId,
    locationId,
    id,
    user,
  }: RemoveImageParams): Promise<LocationImage> {
    const location = await this.locationService.findOne({
      companyId,
      id: locationId,
    });

    const image = await this.findOne({ id, locationId });
    await this.storageImagesService.removeImage(image);
    return this.delete(image);
  }

  /**
   * Can user add new image to this location
   */
  canAddImageToLocation(location: Location): any {
    const amountOfImages = location.images.length;
    const { company } = location;

    if (!company) {
      throw new InternalServerErrorException('Location does not have company.');
    }

    if (company.tier === 'free' && amountOfImages >= 2) return false;
    if (company.tier === 'basic' && amountOfImages >= 5) return false;
    if (company.tier === 'pro' && amountOfImages >= 10) return false;
    if (company.tier === 'enterprise' && amountOfImages >= 30) return false;
    return true;
  }
}
