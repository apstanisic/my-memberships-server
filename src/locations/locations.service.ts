import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../core/base.service';
import { Location } from './location.entity';

@Injectable()
export class LocationsService extends BaseService<Location> {
  constructor(@InjectRepository(Location) repository: Repository<Location>) {
    super(repository);
  }
}
