import { BaseEntity } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
// import { BaseEntity } from '../core/entities/base.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

/** Record of payment */
@Entity('payment_records')
export class PaymentRecord extends BaseEntity {
  /** Price this credit is paid */
  @Column({ default: 0, type: 'int' })
  price: number;

  /** Amount of credit added */
  @Column({ default: 0, type: 'int' })
  creditAdded: number;

  /** Company to which this credit is added */
  @ManyToOne(
    type => Company,
    company => company.payments,
    { onDelete: 'SET NULL' },
  )
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  /** App admin who executed this record */
  @ManyToOne(type => User)
  appAdmin: User;
}
