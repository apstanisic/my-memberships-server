import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { BaseService } from '../core/base.service';
import { UUID } from '../core/types';
import { User } from '../user/user.entity';
import { PlanChangesDto, PlanWithCompanyDto } from './pricing-plan.dto';
import { PricingPlan } from './pricing-plan.entity';

@Injectable()
export class PricingPlanService extends BaseService<PricingPlan> {
  constructor(
    @InjectRepository(PricingPlan) repository: Repository<PricingPlan>,
    private readonly companyService: CompanyService,
  ) {
    super(repository);
  }

  /** Extend current pricing plan */
  async extendPlan(
    companyId: string,
    changes: PlanChangesDto,
  ): Promise<PricingPlan> {
    /** It will find one, latest, still active */
    const pp = await this.findOne({ companyId });
    const newPlan = await PricingPlan.extendFrom(pp, changes);
    return this.create(newPlan);
  }

  /** Create new pricing plan for company */
  async newPlan(
    { companyId, duration, tier, autoRenew, creditPrice }: PlanWithCompanyDto,
    logUser: User,
  ): Promise<PricingPlan> {
    const plan = new PricingPlan();
    const company = await this.companyService.findOne(companyId);
    if (company.credit - creditPrice < 0) {
      throw new BadRequestException('Not enough credit');
    }
    plan.companyId = companyId;
    plan.autoRenew = autoRenew !== undefined ? autoRenew : false;
    plan.creditCost = creditPrice;
    plan.tier = tier || 'basic';
    plan.expiresAt = moment()
      .add(duration)
      .toDate();
    company.credit -= creditPrice;
    company.tier = tier || 'basic';
    const savedPlan = await this.create(plan);
    await this.companyService.mutate(company, {
      user: logUser,
      reason: 'New pricing plan',
    });
    return savedPlan;
  }

  /** Revert company to free tier */
  async revertToFreeTier(companyId: UUID, logUser: User): Promise<any> {
    return this.companyService.updateWhere(
      { id: companyId },
      { tier: 'free' },
      { user: logUser, reason: 'Revert to free tier' },
    );
  }
}
