import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, UUID } from 'nestjs-extra';
import {
  EntityManager,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Location } from '../locations/location.entity';
import { LocationsService } from '../locations/locations.service';
import { Subscription } from '../subscriptions/subscription.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { User } from '../users/user.entity';
import { Arrival } from './arrival.entity';

interface NewArrivalProps {
  location: Location | UUID;
  subscription: Subscription | UUID;
  company: Company | UUID;
  user: User | UUID;
  admin?: User;
}

interface CreateArrivalParams {
  subscription: Subscription;
  arrival: Arrival;
}

interface DeleteArrivalParams {
  // subscription: Subscription;
  // arrival: Arrival;
  companyId: UUID;
  arrivalId: UUID;
  loggedUser: User;
  reason?: string;
}

@Injectable()
export class ArrivalsService extends BaseService<Arrival> {
  constructor(
    @InjectRepository(Arrival) repository: Repository<Arrival>,
    private readonly locationService: LocationsService,
    private readonly subService: SubscriptionsService,
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

    if (typeof subscription === 'string') {
      subscription = await this.subService.findOne(
        {
          companyId,
          ownerId: typeof user === 'string' ? user : user.id,
          active: true,
        },
        { order: { createdAt: 'DESC' } },
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
    arrival.subscriptionId = subscription.id;

    return this.createArrivalTransaction({ arrival, subscription });
  }

  @Transaction()
  private async createArrivalTransaction(
    { arrival, subscription }: CreateArrivalParams,
    @TransactionManager() em?: EntityManager,
  ): Promise<Arrival> {
    if (!em) throw new InternalServerErrorException();

    const subService = new BaseService(em.getRepository(Subscription));
    const arrivalService = new BaseService(em.getRepository(Arrival));

    arrival = await arrivalService.create(arrival);

    const usedAmount = subscription.usedAmount + 1;
    await subService.update(subscription, { usedAmount });

    return arrival;
  }

  @Transaction()
  async deleteArrival(
    { companyId, arrivalId, loggedUser, reason }: DeleteArrivalParams,
    @TransactionManager() em?: EntityManager,
  ): Promise<Arrival> {
    if (!em) throw new InternalServerErrorException();

    const arrivalsService = new BaseService(em.getRepository(Arrival));
    const subService = new BaseService(em.getRepository(Subscription));

    const arrival = await arrivalsService.deleteWhere(
      { companyId, id: arrivalId },
      { reason, user: loggedUser },
    );

    const sub = await subService.findOne({ id: arrival.subscriptionId });
    await subService.update(sub, { usedAmount: sub.usedAmount - 1 });

    return arrival;
  }
}
