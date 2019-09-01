import { IsDate } from 'class-validator';
import { Field, Int } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { DefaultEntity } from '../core/entities/default.entity';
import { DeletedColumns } from '../core/entities/deleted-columns.entity';
import { IsBetween } from '../core/is-between';

@Entity('subscriptions')
export class Subscription extends DefaultEntity {
  /* Company where subscription is valid */
  @ManyToOne(type => Company, company => company.subscriptions)
  @Field(type => Company)
  company: Company;

  /** Company id  */
  @Column()
  @Field()
  companyId: string;

  /** Subscription owner */
  @ManyToOne(type => User, user => user.subscriptions)
  @Field(type => User)
  owner: User;

  /** Subscription owner id  */
  @Column()
  @Field()
  ownerId: string;

  /* Date from which subscription is valid */
  @Column()
  @Field()
  @IsDate()
  startsAt: Date;

  /* Date to which subscription is valid */
  @Column()
  @Field()
  @IsDate()
  expiresAt: Date;

  /* How much did this subscription cost */
  @Column()
  @Field(type => Int)
  @IsBetween(0, 100000)
  price: number;

  /**
   * How much time can user use this subscription
   * (enter an gym, attend pilates...)
   */
  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  allowedUses?: number;

  /** How much time is this sub used */
  @Column({ default: 0 })
  @Field(type => Int, { defaultValue: 0 })
  usedAmount: number;

  /** Standard deleted columns */
  @Column(type => DeletedColumns)
  @Field(type => DeletedColumns)
  deleted: DeletedColumns;

  /** Check if subscription is still valid */
  isValid() {
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
  ) {
    this.startsAt = timeFrom.toDate();
    this.expiresAt = timeFrom
      .add(duration)
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
  }
}
