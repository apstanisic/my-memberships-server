import * as moment from 'moment';
import { PlanName } from './plans.list';

export interface PlanChanges {
  duration: moment.Duration;
  creditPrice: number;
  autoRenew?: boolean;
  name?: PlanName;
}
