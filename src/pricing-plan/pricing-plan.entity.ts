import { Entity, Column, ManyToOne } from 'typeorm';
import { IsInt, IsPositive, IsDate } from 'class-validator';
import { classToClass } from 'class-transformer';
import * as moment from 'moment';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';
import { ExtendActivePlanDto } from './pricing-plan.dto';
import { Tier } from '../company/payment-tiers.list';
import { getEndTime } from '../core/add-duration';

@Entity()
export class PricingPlan extends BaseEntity {
  /** How much credit it subtracted. */
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

  /** To when is this plan active. Default is one month */
  @Column({ precision: 3, default: getEndTime(1) })
  @IsDate()
  expiresAt: Date;

  /** Tier this user has access to when this plan active */
  @Column({ default: 'free' })
  tier: Tier;

  /** Should plan be auto renewed */
  @Column({ default: false })
  autoRenew: boolean;

  /** Is this latest plan, plan that company currently uses */
  @Column({ default: true })
  inUse: boolean;
}
