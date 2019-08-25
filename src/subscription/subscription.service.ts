import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly repository: Repository<Subscription>
  ) {}

  /* Get subscription for provider ownerId */
  getUsersSubscriptions(owner: User) {
    return this.repository.find({ where: { owner } });
  }

  /* Get subscription for provider ownerId */
  getCompaniesSubscriptions(company: Company) {
    return this.repository.find({ where: { company } });
  }
}
