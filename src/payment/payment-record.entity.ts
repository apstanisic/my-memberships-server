import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../company/company.entity';

/** Every payment is recorded */
@Entity()
export class PaymentRecord extends BaseEntity {
  /** Price this credit is paid */
  @Column({ default: 0, type: 'int' })
  price: number;

  /** Amount of credit added */
  @Column({ default: 0, type: 'int' })
  creditAdded: number;

  /** Company to which this credit is added */
  @ManyToOne(type => Company, company => company.payments)
  company: Company;
}
