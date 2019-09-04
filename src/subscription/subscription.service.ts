import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import {
  PaginationResponse,
  PaginationOptions,
} from '../core/pagination/pagination.types';
import { paginate } from '../core/pagination/paginate.helper';
import { BaseService } from '../core/base.service';

@Injectable()
export class SubscriptionService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription) repository: Repository<Subscription>,
  ) {
    super(repository);
  }

  /* Get paginated subscriptions for provided user */
  async getUsersSubscriptions(
    user: User,
    options: PaginationOptions = {},
  ): PaginationResponse<Subscription> {
    return paginate({
      options,
      filter: { user },
      repository: this.repository,
    });
  }

  /** Get paginated subscriptions for provided company */
  async getCompaniesSubscriptions(
    company: Company,
    options: PaginationOptions = {},
  ): PaginationResponse<Subscription> {
    return paginate({
      options,
      filter: { company },
      repository: this.repository,
    });
  }
}
