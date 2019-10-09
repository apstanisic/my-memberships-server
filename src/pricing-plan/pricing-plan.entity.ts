import { Entity, Column, ManyToOne } from 'typeorm';
import { IsInt, IsPositive, IsDate } from 'class-validator';
import { classToClass } from 'class-transformer';
import * as moment from 'moment';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';
import { PlanChanges } from './pricing-plan.dto';
import { Tier } from '../payment/payment-tiers.list';

@Entity()
export class PricingPlan extends BaseEntity {
  private constructor() {
    super();
  }

  static async fromOld(
    pp: PricingPlan,
    changes: PlanChanges,
  ): Promise<PricingPlan> {
    const newPlan = classToClass(pp);
    newPlan.from = pp.to;
    newPlan.to = moment(newPlan.from)
      .add(changes.duration)
      .toDate();

    newPlan.creditPrice = changes.creditPrice;
    if (changes.name) newPlan.tier = changes.name;
    if (changes.autoRenew) newPlan.autoRenew = changes.autoRenew;

    await newPlan.validate();
    return newPlan;
  }

  /** How much credit it removes. */
  @Column()
  @IsPositive()
  @IsInt()
  creditPrice: number;

  /** Company on which this plan applies */
  @ManyToOne(type => Company, company => company.plans)
  company: Company;

  /** Company Id on which this plan applies */
  @Column()
  companyId: string;

  /** From when is this plan active */
  @Column({ precision: 3 })
  @IsDate()
  from: Date;

  /** To when is this plan active */
  @Column({ precision: 3 })
  @IsDate()
  to: Date;

  @Column()
  tier: Tier;

  /** Should plan auto-renew */
  @Column({ default: false })
  autoRenew: boolean;
}
