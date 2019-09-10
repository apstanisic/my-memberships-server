export const availablePlans = [
  'free',
  'trial',
  'begginer',
  'standard',
  'pro',
  'enterprise',
] as const;

export type PlanName = typeof availablePlans[number];
