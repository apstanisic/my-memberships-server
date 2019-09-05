import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Subscription } from './subscription.entity';
import { User } from '../user/user.entity';
import { SubscriptionService } from './subscription.service';
import { Company } from '../company/company.entity';
import { PgResult } from '../core/pagination/pagination.types';

/**
 * Resolves subscriptions
 */
@Resolver((of: any) => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* Get users subscriptions */
  // @ResolveProperty('subscriptions', type => [Subscription])
  // getUsersSubscriptions(@Parent() user: User): Promise<Subscription[]> {
  //   // return this.subscriptionService.getUsersSubscriptions(user);
  // }
}

/**
 * Resolves subscriptions when parent is user
 */
@Resolver((of: any) => User)
export class UserSubscriptionResolver {
  constructor(private readonly userService: SubscriptionService) {}

  @ResolveProperty('subscriptions', type => [Subscription])
  getUsersSubscriptions(@Parent() user: User): PgResult<Subscription> {
    return this.userService.getUsersSubscriptions(user);
  }
}

/**
 * Resolves subscriptions when parent is company
 */
@Resolver((of: any) => Company)
export class CompanySubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @ResolveProperty('subscriptions', type => [Subscription])
  // async getUserCompanies(@Parent() company: Company): Promise<Subscription[]> {
  //   return this.subscriptionService.getCompaniesSubscriptions(company);
  // }
}
