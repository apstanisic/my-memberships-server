import { IsDate, IsInt, IsPositive } from 'class-validator';
import { getEndTime, BaseEntity } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
// import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../companies/company.entity';
import { Tier } from '../companies/payment-tiers.list';
// import { getEndTime } from '../core/add-duration';

@Entity('pricing_plans')
export class PricingPlan extends BaseEntity {
  /** How much credit it subtracted. */
  @Column()
  @IsPositive()
  @IsInt()
  creditCost: number;

  /** Company on which this plan applies */
  @ManyToOne(
    type => Company,
    company => company.plans,
    { onDelete: 'CASCADE' },
  )
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
