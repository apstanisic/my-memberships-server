import { Column, Entity, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { Field } from 'type-graphql';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../core/entities/base.entity';
import { Subscription } from '../subscription/subscription.entity';
import { Location } from '../locations/location.entity';

/**
 * There is seperate address, lat and long for each arrival
 * cause location may change it's adress, but arrival can't be changed
 */
@Entity('arrivals')
export class Arrival extends BaseEntity {
  /** To which subscription this arrival belongs */
  @ManyToOne(type => Subscription)
  @Field(type => Subscription)
  subscription: Subscription;

  /** Subscription that was used for this arrival */
  @Column()
  subscriptionId: string;

  /** At which location did arrival happen */
  @ManyToOne(type => Location, location => location.arrivals, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(type => Location)
  location?: Location;

  /** Get only Id from location */
  @Column({ nullable: true })
  locationId?: string;

  /** When did person arrive */
  @Column({ update: false, default: new Date(), precision: 3 })
  @Field()
  arrivedAt: Date;

  /** When did person leave. It's nullable, if person does not checkout */
  @Column({ nullable: true, precision: 3 })
  @Field({ nullable: true })
  leftAt?: Date;

  /** Address at which location is located */
  @Column({ nullable: true })
  address?: string;

  /** Coordinate */
  @Column({ nullable: true, type: 'double precision', update: false })
  lat?: number;

  /** Coordinate */
  @Column({ nullable: true, type: 'double precision', update: false })
  long?: number;

  /** Get time spent in minutes */
  @Expose()
  get timeSpent(): number | undefined {
    if (!this.arrivedAt || !this.leftAt) return;
    return moment(this.leftAt).diff(this.arrivedAt, 'minutes');
  }
}
