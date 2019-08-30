import { IsDate, IsNumber, Min } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { DefaultEntity } from '../core/default.entity';
import { DeletedColumns } from '../core/deleted-columns.entity';

@Entity('subscriptions')
@ObjectType({ description: 'Subscription Model' })
export class Subscription extends DefaultEntity {
  /* Company where subscription is valid */
  @ManyToOne((type) => Company, (company) => company.subscriptions)
  @Field((type) => Company)
  company: Company;

  /** Subscription owner */
  @ManyToOne((type) => User, (user) => user.subscriptions)
  @Field((type) => User)
  owner: User;

  /** Subscription owner id  */
  @Column()
  ownerId: string;

  /** Company id  */
  @Column()
  companyId: string;

  /* Date from which subscription is valid */
  @Column()
  @Field()
  @IsDate()
  from: Date;

  /* Date to which subscription is valid */
  @Column()
  @Field()
  @IsDate()
  to: Date;

  /* How much did this subscription cost */
  @Column()
  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  /** Standard deleted columns */
  @Column((type) => DeletedColumns)
  deleted: DeletedColumns;

  /**
   * Set how long subscription is valid, and when it starts.
   * Default is one month, and starts now
   */
  setDuration(
    duration: moment.Duration = moment.duration(1, 'month'),
    timeFrom: moment.Moment = moment(),
  ) {
    this.from = timeFrom.toDate();
    this.to = timeFrom
      .add(duration)
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
  }
}
