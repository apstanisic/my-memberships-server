import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { BaseService, getEndTime, UUID } from 'nestjs-extra';
import { MoreThan, Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { User } from '../users/user.entity';
import { tierPrices } from './payment-prices';
import { ExtendActivePlanDto, NewPricingPlanDto } from './pricing-plan.dto';
import { PricingPlan } from './pricing-plan.entity';
import { pricingPlanQueue, PricingPlanQueueTasks } from './pricing-plan.consts';

interface ContinueAfterOldPlanParams {
  companyId: UUID;
  changes: ExtendActivePlanDto;
  logUser: User;
}

/** Only one plan can be active at the same time */
@Injectable()
export class PricingPlanService extends BaseService<PricingPlan> {
  constructor(
    @InjectRepository(PricingPlan) repository: Repository<PricingPlan>,
    @InjectQueue(pricingPlanQueue) queue: Queue,
    private readonly companyService: CompaniesService,
  ) {
    super(repository);
    const Tasks = PricingPlanQueueTasks;
    queue.add(Tasks.renew, null, { repeat: { cron: '30 0 * * *' } });
    queue.add(Tasks.sendReminders, null, { repeat: { cron: '0 4 * * *' } });
    queue.add(Tasks.cancelExpired, null, { repeat: { cron: '0 3 * * *' } });
  }

  /**
   * Extend current pricing plan. This plan starts after old expires.
   * If you want for plan to start now, use this.newPlan.
   * There must be currently active plan for this to work.
   * It will use plan that last expires if there are to plan that
   * are still valid.
   */
  async continueAfterOldPlan({
    changes,
    companyId,
    logUser,
  }: ContinueAfterOldPlanParams): Promise<PricingPlan> {
    const oldPlan = await this.findOne(
      { companyId, expiresAt: MoreThan(new Date()) },
      { order: { expiresAt: 'DESC' }, relations: ['company'] },
    );
    const autoRenew = changes.autoRenew !== undefined ? changes.autoRenew : oldPlan.autoRenew;
    const { company } = oldPlan;
    const tier = changes.tier || oldPlan.tier;

    if (!company || !tier) throw new InternalServerErrorException();

    // Credit cost is how many months * tier price
    const cost = changes.duration * tierPrices[tier];
    // Throw if company is banned
    if (company.tier === 'banned') {
      throw new ForbiddenException('You are banned.');
    }
    // Throw error if there are not enough credit
    if (company.credit - cost < 0) {
      throw new BadRequestException('Insufficient funds.');
    }

    const newPlan = new PricingPlan();
    newPlan.company = company;
    newPlan.creditCost = cost;
    newPlan.tier = tier;
    newPlan.startsAt = oldPlan.expiresAt;
    // New plan starts when old expires
    newPlan.expiresAt = getEndTime(changes.duration, newPlan.startsAt);
    newPlan.autoRenew = autoRenew;
    const savedPlan = await this.create(newPlan);
    await this.companyService.update(
      company,
      { tier, credit: company.credit - cost },
      { user: logUser, reason: 'Extend pricing plan.' },
    );
    return savedPlan;
  }

  /** Create new pricing plan for company */
  async newPlan(
    companyId: UUID,
    { duration, tier, autoRenew }: NewPricingPlanDto,
    logUser: User,
  ): Promise<PricingPlan> {
    // Price of this plan
    const company = await this.companyService.findOne(companyId);
    const plan = new PricingPlan();
    const cost = duration * tierPrices[tier];
    // Throw if company is banned
    if (company.tier === 'banned') {
      throw new ForbiddenException('You are banned.');
    }
    if (company.credit - cost < 0) {
      throw new BadRequestException('Insufficient funds.');
    }
    plan.company = company;
    plan.autoRenew = autoRenew;
    plan.creditCost = cost;
    plan.tier = tier;
    plan.expiresAt = getEndTime(duration);
    const savedPlan = await this.create(plan);
    await this.companyService.update(
      company,
      { tier, credit: company.credit - cost },
      { user: logUser, reason: 'New pricing plan' },
    );
    return savedPlan;
  }

  /** Remove currently active plan. Credit will not be returned to user */
  async cancelActivePlan(companyId: UUID, logUser: User): Promise<PricingPlan> {
    const logData = {
      user: logUser,
      reason: 'Remove active plan.',
    };
    const latestPlan = await this.findOne(
      { companyId, expiresAt: MoreThan(new Date()) },
      { order: { startsAt: 'DESC' } },
    );
    await this.companyService.update(companyId, { tier: 'free' }, logData);
    return this.delete(latestPlan, logData);
  }
}
