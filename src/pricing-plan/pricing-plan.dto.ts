import * as moment from 'moment';
import { Tier } from '../payment/payment-tiers.list';

export interface PlanChanges {
  duration: moment.Duration;
  creditPrice: number;
  autoRenew?: boolean;
  name?: Tier;
}
