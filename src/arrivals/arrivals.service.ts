import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../core/base.service';
import { Arrival } from './arrivals.entity';
import { Location } from '../locations/location.entity';
import { Subscription } from '../subscription/subscription.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ArrivalsService extends BaseService<Arrival> {
  constructor(@InjectRepository(Arrival) repository: Repository<Arrival>) {
    super(repository);
  }

  /**
   * Creates new arrival. This method is specific for arrivals.
   * It's mostly wrapper around BaseService create method.
   */
  newArrival(
    location: Location,
    subscription: Subscription | string,
    user: User,
  ): Promise<Arrival> {
    const arrival = new Arrival();
    arrival.address = location.address;
    arrival.lat = location.lat;
    arrival.long = location.long;
    arrival.approvedBy = user;
    arrival.subscriptionId =
      typeof subscription === 'string' ? subscription : subscription.id;
    return this.create(arrival);
  }
}
