import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { availableTiers, Tier } from '../company/payment-tiers.list';

export class ExtendPricingPlanDto {
  /** Duration in months. Default 1 month */
  @IsOptional()
  @IsInt()
  duration: number = 1;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  @IsIn([...availableTiers])
  tier?: Tier;
}

export class NewPricingPlanDto {
  @IsInt()
  @IsPositive()
  duration: number = 1;

  @IsBoolean()
  autoRenew: boolean = false;

  @IsIn([...availableTiers])
  tier: Tier = 'basic';
}
