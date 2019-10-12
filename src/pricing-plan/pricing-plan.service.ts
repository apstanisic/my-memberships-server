import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';
import { getEndTime } from '../core/add-duration';
import { BaseService } from '../core/base.service';
import { UUID } from '../core/types';
import { User } from '../user/user.entity';
import { tierPrices } from './payment-prices';
import { ExtendActivePlanDto, NewPricingPlanDto } from './pricing-plan.dto';
import { PricingPlan } from './pricing-plan.entity';

/** Only one plan can be active at the same time */
@Injectable()
export class PricingPlanService extends BaseService<PricingPlan> {
  constructor(
    @InjectRepository(PricingPlan) repository: Repository<PricingPlan>,
    private readonly companyService: CompanyService,
  ) {
    super(repository);
  }

  /**
   * Extend current pricing plan. This plan starts after old expires.
   * If you want for plan to start now, use this.newPlan.
   * There must be currently active plan for this to work.
   */
  async extendPlan(
    companyId: UUID,
    changes: ExtendActivePlanDto,
    logUser: User,
  ): Promise<PricingPlan> {
    const oldPlan = await this.findOne(
      { companyId, expiresAt: MoreThan(new Date()) },
      { order: { expiresAt: 'DESC' }, relations: ['company'] },
    );
    const autoRenew =
      changes.autoRenew !== undefined ? changes.autoRenew : oldPlan.autoRenew;
    const { company } = oldPlan;
    const tier = changes.tier || oldPlan.tier;
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

  /** Revert company to free tier */
  async revertToFreeTier(companyId: UUID, logUser: User): Promise<Company> {
    return this.companyService.updateWhere(
      { id: companyId },
      { tier: 'free' },
      { user: logUser, reason: 'Revert to free tier' },
    );
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
