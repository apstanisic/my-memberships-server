import { Resolver, Query, Args, ResolveProperty } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './user.service';
import BaseException from '../core/BaseException';
import { Company } from '../company/company.entity';
import { Subscription } from '../subscription/subscription.entity';
import { CompanyService } from '../company/company.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Resolver((of: any) => User)
export class UserResolver {
  constructor(
    private readonly usersService: UsersService
  ) // private readonly companyService: CompanyService,
  // private readonly subscriptionService: SubscriptionService,
  {}

  @Query(returns => User, { name: 'user' })
  async getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  // @ResolveProperty('subscriptions', type => [Subscription])
  // async getUserSubscriptions() {}

  // @ResolveProperty('ownerCompanies', type => [Company])
  // async getUserCompanies() {}
}
