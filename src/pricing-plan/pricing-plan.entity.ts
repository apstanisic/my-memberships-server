import { Entity, Column, ManyToOne } from 'typeorm';
import { IsInt, IsPositive, IsDate } from 'class-validator';
import { classToClass } from 'class-transformer';
import * as moment from 'moment';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';
import { PlanChanges } from './pricing-plan.dto';
import { PlanName } from './plans.list';

@Entity()
export class PricingPlan extends BaseEntity {
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
    if (changes.name) newPlan.name = changes.name;
    if (changes.autoRenew) newPlan.autoRenew = changes.autoRenew;

    await newPlan.validate();
    return newPlan;
  }

  @Column()
  @IsPositive()
  @IsInt()
  creditPrice: number;

  @ManyToOne(type => Company, company => company.plans)
  company: Company;

  @Column()
  companyId: string;

  @Column({ precision: 3 })
  @IsDate()
  from: Date;

  @Column({ precision: 3 })
  @IsDate()
  to: Date;

  @Column()
  name: PlanName;

  @Column({ default: false })
  autoRenew: boolean;
}
