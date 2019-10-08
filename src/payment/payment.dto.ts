import { IsInt, IsUUID, IsIn } from 'class-validator';
import { IsBetween } from '../core/is-between';
import { Tier } from '../company/company.entity';

/** Params provided when adding or subtracting company credit */
export class ChangeCreditDto {
  @IsInt()
  @IsBetween(-100000, 100000)
  amount: number;

  @IsUUID()
  companyId: string;
}

/** Params provided when changing company tier */
export class ChangeTierDto {
  @IsUUID()
  companyId: string;

  @IsIn(['free', 'basic', 'pro', 'enterprise', 'banned'])
  tier: Tier;
}
