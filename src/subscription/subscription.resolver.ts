import { Resolver, Root, ResolveProperty, Parent } from '@nestjs/graphql';
import { FieldResolver } from 'type-graphql';
import { Subscription } from './subscription.entity';
import { User } from '../user/user.entity';
import { SubscriptionService } from './subscription.service';
import { Company } from '../company/company.entity';
import { generateSubscription } from './subscription.factory';
import { generateUser } from '../user/user.factory';
import { generateCompany } from '../company/company.factory';

@Resolver((of: any) => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /* Get users subscriptions */
  @ResolveProperty('subscriptions', type => [Subscription])
  getUsersSubscriptions(@Parent() user: User) {
    return this.subscriptionService.getSubscriptionsByUserId(user.id);
  }
}

/* Resolves subscriptions when parent is user */
@Resolver((of: any) => User)
export class UserSubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ResolveProperty('subscriptions', type => [Subscription])
  getUsersSubscriptions() {
    // return this.subscriptionService.getSubscriptionsByUserId(user.id);
    return [
      generateSubscription(
        [generateUser()],
        [generateCompany([generateUser()])]
      )
    ];
  }
}

/* Resolves subscriptions when parent is user */
@Resolver((of: any) => Company)
export class CompanySubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ResolveProperty('subscriptions', type => [Subscription])
  async getUserCompanies(@Parent() company: Company) {
    const res = await this.subscriptionService.getCompaniesSubscriptions(
      company
    );
    console.log(res);
    res.forEach(console.log);
    return res;
  }
}
