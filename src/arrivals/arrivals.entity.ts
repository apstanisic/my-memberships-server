import { Column, Entity, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { Field, Float } from 'type-graphql';
import { BaseEntity } from '../core/entities/base.entity';
import { Subscription } from '../subscription/subscription.entity';

/**
 * This field is not normalized because user can change address,
 *  But visit is still in old adress. It stores id as a reference
 * to object
 */
class Location {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field(type => Float)
  lat?: number;

  @Field(type => Float)
  long?: number;
}

@Entity('arrivals')
export class Arrival extends BaseEntity {
  @ManyToOne(type => Subscription)
  @Field(type => Subscription)
  subscription: Subscription;

  // eslint causes problem because it does not recoginize interfaces
  /* eslint-disable-next-line */
  @Column(type => Location)
  @Field(type => Location)
  location: Location;

  @Column()
  @Field()
  arrivedAt: Date;

  @Column()
  @Field()
  leftAt: Date;

  get timeSpent() {
    if (!this.arrivedAt || !this.leftAt) return 0;
    return moment(this.leftAt).diff(this.arrivedAt, 'minutes');
  }
}
