import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'nestjs-extra';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';
// import { BaseService } from '../core/base.service';
import { User } from '../user/user.entity';
import { CreateSubscriptionDto } from './subscription.dto';
import { Subscription } from './subscription.entity';

interface CreateSubParams {
  user: User;
  company: Company;
  subscription: CreateSubscriptionDto;
}

@Injectable()
export class SubscriptionService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription) repository: Repository<Subscription>,
  ) {
    super(repository);
  }

  async createSubscription({
    subscription,
    user,
    company,
  }: CreateSubParams): Promise<Subscription> {
    const companyId = company.id;
    const currentSubs = await this.count({ companyId, active: true });

    if (company.tier === 'free' && currentSubs >= 75) {
      throw new ForbiddenException('Max subs reached');
    }

    if (company.tier === 'basic' && currentSubs >= 150) {
      throw new ForbiddenException('Max subs reached');
    }

    if (company.tier === 'pro' && currentSubs >= 400) {
      throw new ForbiddenException('Max subs reached');
    }
    if (currentSubs >= 600) {
      throw new ForbiddenException('Max subs reached');
    }

    return this.create(
      { ...subscription, companyId },
      { user, domain: companyId },
    );
  }
}
