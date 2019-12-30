import { Arrival } from '../arrivals/arrival.entity';
import { CompanyImage } from '../company-images/company-image.entity';
import { Company } from '../companies/company.entity';
import { LocationImage } from '../location-images/location-image.entity';
import { Location } from '../locations/location.entity';
import { PaymentRecord } from '../payments/payment-record.entity';
import { PricingPlan } from '../pricing-plans/pricing-plan.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { User } from '../users/user.entity';
import { CompanyConfig } from '../company-config/company-config.entity';

export const appEntities = [
  User,
  Arrival,
  Company,
  Location,
  PaymentRecord,
  PricingPlan,
  Subscription,
  LocationImage,
  CompanyImage,
  CompanyConfig,
];
