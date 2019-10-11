export const availableTiers = [
  'free',
  'basic',
  // 'standard',
  'pro',
  'enterprise',
  'banned',
] as const;

export type Tier = typeof availableTiers[number];
