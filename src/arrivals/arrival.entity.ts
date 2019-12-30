import { Expose } from 'class-transformer';
import * as moment from 'moment';
import { BaseEntity, UUID } from 'nestjs-extra';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Location } from '../locations/location.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { User } from '../users/user.entity';

/**
 * There is seperate address, lat and long for each arrival
 * cause location may change it's adress, but arrival can't be changed
 */
@Entity('arrivals')
export class Arrival extends BaseEntity {
  /** To which subscription this arrival belongs */
  @ManyToOne(
    type => Subscription,
    sub => sub.arrivals,
    { onDelete: 'SET NULL' },
  )
  subscription: Subscription;

  /** Subscription that was used for this arrival */
  @Column({ update: false })
  subscriptionId: UUID;

  /** At which location did arrival happen */
  @ManyToOne(
    type => Location,
    location => location.arrivals,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  location?: Location;

  /** Get only Id from location */
  @Column({ nullable: true, update: false })
  locationId?: UUID;

  /** Shortcut for geting company */
  @ManyToOne(type => Company, { onDelete: 'CASCADE' })
  company: Company;

  /** Company Id */
  @Column({ update: false })
  companyId: UUID;

  // @TODO make this non nullable
  /** User that came */
  @ManyToOne(
    type => User,
    user => user.arrivals,
    { onDelete: 'SET NULL' },
  )
  user: User;

  /** User that came id */
  @Column({ update: false })
  userId: UUID;

  /** When did person arrive */
  @Column({ update: false, default: new Date(), precision: 3 })
  arrivedAt: Date;

  /** When did person leave. It's nullable, if person does not checkout */
  @Column({ nullable: true, precision: 3 })
  leftAt?: Date;

  /** Address at which location is located */
  @Column({ nullable: true, update: false })
  address?: string;

  /** Coordinate */
  @Column({ nullable: true, type: 'double precision', update: false })
  lat?: number;

  /** Coordinate */
  @Column({ nullable: true, type: 'double precision', update: false })
  long?: number;

  @ManyToOne(type => User, { nullable: true, onDelete: 'SET NULL' })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedById?: UUID;

  /** Get time spent in minutes */
  @Expose()
  get timeSpent(): number | undefined {
    if (!this.arrivedAt || !this.leftAt) return;
    return moment(this.leftAt).diff(this.arrivedAt, 'minutes');
  }
}
