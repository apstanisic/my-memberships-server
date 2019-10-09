import { Tier } from './payment-tiers.list';

/** How much does each tier cost per month */
export const tierPrices: Record<Tier, number> = {
  banned: 0,
  free: 0,
  basic: 10,
  pro: 25,
  enterprise: 60,
};
