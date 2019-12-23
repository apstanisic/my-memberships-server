import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'nestjs-extra';
import { Repository, Like } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '../companies/company.entity';
// import { BaseService } from '../core/base.service';
import { User } from '../users/user.entity';
import { CreateSubscriptionDto } from './subscription.dto';
import { Subscription } from './subscription.entity';
import { UsersService } from '../users/users.service';

interface CreateSubParams {
  user: User;
  company: Company;
  subscription: CreateSubscriptionDto;
}

@Injectable()
export class SubscriptionsService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription) repository: Repository<Subscription>,
    private readonly userService: UsersService,
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

    // const sub =
    if (!subscription.ownerId) {
      try {
        const owner = await this.userService.findOne({
          email: subscription.ownerEmail,
        });
        subscription.ownerId = owner.id;
      } catch (error) {
        throw new BadRequestException('User does not exist');
      }
    }

    return this.create(
      { ...subscription, companyId },
      { user, domain: companyId },
    );
  }

  /**
   * Get users that have active subscription in provided company
   * Limit to 12. Used for reference input
   */
  async getUsersWithSubscription(
    companyId: string,
    email: string,
    active?: boolean,
  ): Promise<User[]> {
    const subQuery = this.repository
      .createQueryBuilder('subscriptions')
      .innerJoinAndSelect('subscriptions.owner', 'users')
      .where('users.email LIKE :email', { email: `%${email}%` })
      .andWhere('subscriptions.companyId = :companyId', { companyId })
      // Only works in psql. Returns only one row for one email
      .distinctOn(['users.email'])
      .limit(12);

    if (active !== undefined) {
      subQuery.andWhere(`subscriptions.active = ${active ? 'true' : 'false'}`);
    }

    const subs = await subQuery.getMany();

    return subs.map(sub => plainToClass(User, sub.owner));
  }
}
