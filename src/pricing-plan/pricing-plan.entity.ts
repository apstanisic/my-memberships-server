import { Entity, Column, ManyToOne } from 'typeorm';
import { IsInt, IsPositive, IsDate } from 'class-validator';
import { classToClass } from 'class-transformer';
import * as moment from 'moment';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';
import { PlanChangesDto } from './pricing-plan.dto';
import { Tier } from '../company/payment-tiers.list';

@Entity()
export class PricingPlan extends BaseEntity {
  /** Create new pricing plan from old. */
  static async extendFrom(
    pp: PricingPlan,
    changes: PlanChangesDto,
  ): Promise<PricingPlan> {
    const newPlan = classToClass(pp);
    newPlan.startsAt = pp.expiresAt;
    newPlan.expiresAt = moment(newPlan.startsAt)
      .add(changes.duration)
      .toDate();

    newPlan.creditCost = changes.creditPrice;
    if (changes.tier) newPlan.tier = changes.tier;
    if (changes.autoRenew) newPlan.autoRenew = changes.autoRenew;

    await newPlan.validate();
    return newPlan;
  }

  /** How much credit it removes. */
  @Column()
  @IsPositive()
  @IsInt()
  creditCost: number;

  /** Company on which this plan applies */
  @ManyToOne(type => Company, company => company.plans)
  company: Company;

  /** Company Id on which this plan applies */
  @Column()
  companyId: string;

  /** From when is this plan active */
  @Column({ precision: 3, default: new Date() })
  @IsDate()
  startsAt: Date;

  /** To when is this plan active */
  @Column({ precision: 3 })
  @IsDate()
  expiresAt: Date;

  /** Tier this user has access to when this plan active */
  @Column()
  tier: Tier;

  /** Should plan auto-renew */
  @Column({ default: false })
  autoRenew: boolean;
}
