import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { BaseService } from '../core/base.service';
import { PricingPlan } from './pricing-plan.entity';
import { Company } from '../company/company.entity';
import { PlanChanges } from './pricing-plan.dto';

@Injectable()
export class PricingPlanService extends BaseService<PricingPlan> {
  constructor(
    @InjectRepository(PricingPlan) repository: Repository<PricingPlan>,
  ) {
    super(repository);
  }

  async extendPlan(
    companyId: string,
    changes: PlanChanges,
  ): Promise<PricingPlan> {
    /** It will find one, latest, still active */
    const pp = await this.findOne({ companyId });
    const newPlan = await PricingPlan.fromOld(pp, changes);
    return this.create(newPlan);
  }
}
