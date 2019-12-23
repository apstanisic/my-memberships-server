import { BaseService, StorageImagesService, UUID, Image } from 'nestjs-extra';
import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import {
  Transaction,
  TransactionManager,
  EntityManager,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../locations/location.entity';
import { LocationsService } from '../locations/locations.service';
import { User } from '../users/user.entity';
import { LocationImage } from './location-image.entity';

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
    private readonly storageImagesService: StorageImagesService,
    private readonly locationService: LocationsService,
  ) {
    super(repository);
  }

  /** Add image to location */
  async addImage({
    locationId,
    companyId,
    fileBuffer,
    loggedUser,
  }: AddImageParams): Promise<LocationImage> {
    const location = await this.locationService.findOne(
      { companyId, id: locationId },
      { relations: ['company'] },
    );

    if (!this.canAddImageToLocation(location)) {
      throw new ForbiddenException('Quota reached');
    }

    const image = await this.storageImagesService.storeImage(fileBuffer);
    const locationImage = this.repository.create(image);
    locationImage.locationId = locationId;
    return this.create(image);
  }

  /** Remove image from location */
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

  /** Can user add new image to this location */
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
