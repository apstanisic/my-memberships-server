import { Column, Entity, ManyToOne } from 'typeorm';
import * as moment from 'moment';
import { DefaultEntity } from '../core/default.entity';
import { Subscription } from '../subscription/subscription.entity';

/**
 * This field is not normalized because user can change address,
 *  But visit is still in old adress. It stores id as a reference
 * to object
 */
interface Location {
  id: string;
  address: string;
  lat?: number;
  long?: number;
}

@Entity('arrivals')
export class Arrival extends DefaultEntity {
  @ManyToOne(type => Subscription)
  subscription: Subscription;

  // eslint causes problem because it does not recoginize interfaces
  /* eslint-disable-next-line */
  @Column(type => Location)
  location: Location;

  @Column()
  arrivedAt: Date;

  @Column()
  leftAt: Date;

  get timeSpent() {
    if (!this.arrivedAt || !this.leftAt) return 0;
    return moment(this.leftAt).diff(this.arrivedAt, 'minutes');
  }
}
