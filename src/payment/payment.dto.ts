import { IsInt, IsUUID, IsIn } from 'class-validator';
import { IsBetween } from '../core/is-between';
import { Tier } from './payment-tiers.list';

/** Params provided when adding or subtracting company credit */
export class ChangeCreditDto {
  /** How much was it paid */
  @IsInt()
  @IsBetween(0, 100000)
  price: number;

  /** How much credit was it added */
  @IsInt()
  @IsBetween(-100000, 100000)
  credit: number;

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
