import * as moment from 'moment';
import { PlanName } from './pricing-plan.entity';

export interface PlanChanges {
  duration: moment.Duration;
  creditPrice: number;
  autoRenew?: boolean;
  name?: PlanName;
}
