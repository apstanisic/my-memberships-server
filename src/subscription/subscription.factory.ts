import * as Faker from 'faker';
import { Subscription } from './subscription.entity';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';

export function generateSubscription(
  users: User[],
  companies: Company[],
): Subscription {
  const random = Faker.random.arrayElement;
  const sub = new Subscription();

  sub.setDuration();
  sub.owner = random(users);
  sub.company = random(companies);
  sub.price = Faker.random.number({ min: 5, max: 100 }) * 100;

  return sub;
}
