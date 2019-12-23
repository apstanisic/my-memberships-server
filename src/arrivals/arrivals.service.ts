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
  locationId: UUID;
  // subscriptionId: UUID;
  companyId: UUID;
  userId: UUID;
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
    locationId,
    companyId,
    userId,
    admin,
  }: NewArrivalProps): Promise<Arrival> {
    const location = await this.locationService.getLocationInCompany(
      companyId,
      locationId,
    );

    const subscription = await this.subService.findOne(
      { companyId, ownerId: userId, active: true },
      { order: { createdAt: 'DESC' } },
    );

    const arrival = new Arrival();
    arrival.address = location.address;
    arrival.lat = location.lat;
    arrival.long = location.long;
    arrival.companyId = companyId;
    arrival.locationId = location.id;
    arrival.userId = userId;
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

    await subService.update(subscription, {
      usedAmount: subscription.usedAmount + 1,
    });

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
