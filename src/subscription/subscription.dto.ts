export interface CreateSubscriptionData {
  companyId: string;
  startsAt?: string;
  expiresAt?: string;
  price: number;
  allowedUses: number;
}

export interface UpdateSubscriptionData {
  startsAt?: string;
  expiresAt?: string;
  price: number;
  allowedUses: number;
}
