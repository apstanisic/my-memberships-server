import * as moment from 'moment';
import { Tier } from '../company/payment-tiers.list';
import { UUID } from '../core/types';

export interface PlanChangesDto {
  duration: moment.Duration;
  creditPrice: number;
  autoRenew?: boolean;
  tier?: Tier;
}

export interface PlanWithCompanyDto extends PlanChangesDto {
  companyId: UUID;
}

/** Params provided when changing company tier */
// export class ChangeTierDto {
//   @IsUUID()
//   companyId: string;

//   @IsIn(['free', 'basic', 'pro', 'enterprise', 'banned'])
//   tier: Tier;
// }
