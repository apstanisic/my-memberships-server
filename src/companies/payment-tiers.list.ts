export const availableTiers = ['free', 'basic', 'pro', 'enterprise', 'banned'] as const;

export type Tier = typeof availableTiers[number];
