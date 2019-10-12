import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { availableTiers, Tier } from '../company/payment-tiers.list';

/** Values needed when extending currently active plan */
export class ExtendActivePlanDto {
  /** Duration in months. Default 1 month */
  @IsOptional()
  @IsInt()
  duration: number = 1;

  /** If undefined use value of old plan */
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  /** If undefined use value of old plan */
  @IsOptional()
  @IsIn([...availableTiers])
  tier?: Tier;
}

/** Values needed for new plan. Default values provided. */
export class NewPricingPlanDto {
  /** Duration in months */
  @IsInt()
  @IsPositive()
  duration: number = 1;

  @IsBoolean()
  autoRenew: boolean = false;

  @IsIn([...availableTiers])
  tier: Tier = 'basic';
}
