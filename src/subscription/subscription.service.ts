import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { PaginationResponse } from '../core/pagination/pagination.types';
import { paginate } from '../core/pagination/paginate.helper';
import { BaseService } from '../core/base.service';

@Injectable()
export class SubscriptionService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    protected readonly repository: Repository<Subscription>,
  ) {
    super();
  }

  /* Get paginated subscriptions for provided user */
  async getUsersSubscriptions(
    user: User,
    page: number = 1,
  ): PaginationResponse<Subscription> {
    return paginate({
      criteria: { user },
      options: { page },
      repository: this.repository,
    });
  }

  /** Get paginated subscriptions for provided company */
  async getCompaniesSubscriptions(
    company: Company,
    page: number = 1,
  ): PaginationResponse<Subscription> {
    return paginate({
      criteria: { company },
      options: { page },
      repository: this.repository,
    });
  }
}
