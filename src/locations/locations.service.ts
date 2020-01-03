import { InjectQueue } from '@nestjs/bull';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { BaseService, StorageImagesService, UUID } from 'nestjs-extra';
import { Repository } from 'typeorm';
// import { BaseService } from '../core/base.service';
// import { UUID } from '../core/types';
import { User } from '../users/user.entity';
import { CreateLocationDto } from './location.dto';
import { Location } from './location.entity';

interface CreateLocationParams {
  user: User;
  companyId: UUID;
  location: CreateLocationDto;
}

interface DeleteLocationParams {
  id: UUID;
  companyId: UUID;
  user: User;
}

@Injectable()
export class LocationsService extends BaseService<Location> {
  constructor(
    @InjectRepository(Location) repository: Repository<Location>,
    @InjectQueue('app') private readonly queue: Queue,
  ) {
    super(repository);
  }

  async createLocation({
    companyId,
    location,
    user,
  }: CreateLocationParams): Promise<Location> {
    const locations = await this.find(
      { companyId },
      { relations: ['company'] },
    );
    const amountOfLocations = locations.length;
    // const tier = locations.length > 0 ? locations[0]?.company?.tier : undefined;
    const tier = locations[0]?.company?.tier;

    if (!tier) throw new InternalServerErrorException('Tier problem.');

    if (amountOfLocations >= 1 && tier === 'free') {
      throw new ForbiddenException('Quota reached.');
    }
    if (amountOfLocations >= 3 && tier === 'basic') {
      throw new ForbiddenException('Quota reached.');
    }
    if (amountOfLocations >= 8 && tier === 'pro') {
      throw new ForbiddenException('Quota reached.');
    }
    if (amountOfLocations >= 20) {
      throw new ForbiddenException('Quota reached.');
    }

    return this.create({ ...location, companyId }, { user, domain: companyId });
  }

  async deleteLocation({
    id,
    companyId,
    user,
  }: DeleteLocationParams): Promise<any> {
    const location = await this.findOne(
      { id, companyId },
      { relations: ['images'] },
    );

    location.images.forEach(img => {
      this.queue.add('delete-image', img, { attempts: 3 });
    });

    return this.delete(location, { user, domain: id });
  }

  async getLocationInCompany(
    companyId: string,
    locationId: string,
  ): Promise<Location> {
    return this.findOne({ companyId, id: locationId });
  }
}
