import { IsDate } from 'class-validator';
import { Column, Entity, ManyToOne, Index } from 'typeorm';
import * as moment from 'moment';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { BaseEntity } from '../core/entities/base.entity';
import { ActionColumns } from '../core/entities/deleted-columns.entity';
import { SoftDelete } from '../core/entities/soft-delete.interface';
import { IsBetween } from '../core/is-between';

@Entity('subscriptions')
export class Subscription extends BaseEntity implements SoftDelete {
  /* Company where subscription is valid */
  @ManyToOne(type => Company, company => company.subscriptions)
  company: Company;

  /** Company id  */
  @Column()
  companyId: string;

  /** Subscription owner */
  @ManyToOne(type => User, user => user.subscriptions)
  owner: User;

  /** Subscription owner id  */
  @Column()
  ownerId: string;

  /* Date from which subscription is valid */
  @Column({ precision: 3 })
  @IsDate()
  startsAt: Date;

  /* Date to which subscription is valid. Has index couse it's offten sorted */
  @Column({ precision: 3 })
  @Index()
  @IsDate()
  expiresAt: Date;

  /* How much did this subscription cost */
  @Column()
  @Index()
  @IsBetween(0, 100000)
  price: number;

  /**
   * How much time can user use this subscription
   * (enter an gym, attend pilates...).
   * If null it's unlimided.
   */
  @Column({ nullable: true })
  allowedUses?: number;

  /** How much time is this sub used */
  @Column({ default: 0 })
  usedAmount: number;

  /** Standard deleted columns */
  @Column(type => ActionColumns)
  @Exclude()
  deleted: ActionColumns;

  /** Check if subscription is still valid */
  isValid(): boolean {
    if (this.deleted.at) return false;
    if (moment(this.expiresAt).isBefore(moment.now())) return false;
    if (this.allowedUses && this.allowedUses <= this.usedAmount) return false;
    return true;
  }

  /**
   * Set how long subscription is valid, and when it starts.
   * Default is one month, and starts now
   */
  setDuration(
    duration: moment.Duration = moment.duration(1, 'month'),
    timeFrom: moment.Moment = moment(),
  ): void {
    this.startsAt = timeFrom.toDate();
    this.expiresAt = timeFrom
      .add(duration)
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
  }
}
