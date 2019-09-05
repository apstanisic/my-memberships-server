import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import * as moment from 'moment';
import { Field, Float } from 'type-graphql';
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
  // @Column(type => Location)
  @ManyToOne(type => Location, location => location.arrivals)
  @Field(type => Location)
  location: Location;

  /** Get only Id from location */
  // @RelationId((arrival: Arrival) => arrival.location)
  @Column()
  locationId: string;

  /** When did person arrive */
  @Column({ update: false, default: new Date() })
  @Field()
  arrivedAt: Date;

  /** When did person leave. It's nullable, if person does not checkout */
  @Column({ nullable: true })
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

  get timeSpent(): number {
    if (!this.arrivedAt || !this.leftAt) return 0;
    return moment(this.leftAt).diff(this.arrivedAt, 'minutes');
  }
}
