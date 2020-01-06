import * as Faker from 'faker';
import { Subscription } from './subscription.entity';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';

export function generateSubscription(users: User[], companies: Company[]): Subscription {
  const random = Faker.random.arrayElement;
  const sub = new Subscription();

  sub.setDuration();
  sub.owner = random(users);
  sub.company = random(companies);
  sub.active = Math.random() > 0.3; // 7 / 10 are active
  sub.price = Faker.random.number({ min: 5, max: 100 }) * 100;

  return sub;
}
