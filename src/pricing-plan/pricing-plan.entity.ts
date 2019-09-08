import { Entity, Column } from 'typeorm';
import { IsInt, IsPositive, IsDate } from 'class-validator';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';

type PlanName =
  | 'trial'
  | 'free'
  | 'begginer'
  | 'standart'
  | 'pro'
  | 'enterprise';

@Entity()
export class PricingPlan extends BaseEntity {
  @Column()
  @IsPositive()
  @IsInt()
  creditPrice: number;

  @Column()
  company: Company;

  @Column({ precision: 3 })
  @IsDate()
  from: Date;

  @Column({ precision: 3 })
  @IsDate()
  to: Date;

  @Column()
  name: PlanName;

  @Column()
  autoRenew: boolean;
}
