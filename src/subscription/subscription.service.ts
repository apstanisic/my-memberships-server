import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Company } from '../company/company.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly repository: Repository<Subscription>
  ) {}

  /* Get subscription for provider ownerId */
  getSubscriptionsByUserId(ownerId: string) {
    return this.repository.find({ where: { ownerId } });
  }

  /* Get subscription for provider ownerId */
  getCompaniesSubscriptions(company: Company) {
    return this.repository.find({ where: { company } });
  }
}
