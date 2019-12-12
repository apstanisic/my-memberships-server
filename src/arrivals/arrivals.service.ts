import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, UUID } from 'nestjs-extra';
import { Repository } from 'typeorm';
import { Location } from '../locations/location.entity';
import { Subscription } from '../subscription/subscription.entity';
import { User } from '../user/user.entity';
import { Arrival } from './arrivals.entity';
import { LocationsService } from '../locations/locations.service';
import { Company } from '../company/company.entity';

interface NewArrivalProps {
  location: Location | UUID;
  subscription: Subscription | UUID;
  company: Company | UUID;
  user: User | UUID;
  admin?: User;
}

@Injectable()
export class ArrivalsService extends BaseService<Arrival> {
  constructor(
    @InjectRepository(Arrival) repository: Repository<Arrival>,
    private readonly locationService: LocationsService,
  ) {
    super(repository);
  }

  /**
   * Creates new arrival. This method is specific for arrivals.
   * It's mostly wrapper around BaseService create method.
   */
  async newArrival({
    location,
    subscription,
    company,
    user,
    admin,
  }: NewArrivalProps): Promise<Arrival> {
    const companyId = typeof company === 'string' ? company : company.id;
    if (typeof location === 'string') {
      location = await this.locationService.getLocationInCompany(
        companyId,
        location,
      );
    }
    const arrival = new Arrival();
    arrival.address = location.address;
    arrival.lat = location.lat;
    arrival.long = location.long;
    arrival.companyId = companyId;
    arrival.locationId = location.id;
    arrival.userId = typeof user === 'string' ? user : user.id;
    arrival.approvedBy = admin;
    arrival.subscriptionId =
      typeof subscription === 'string' ? subscription : subscription.id;
    return this.create(arrival);
  }
}
