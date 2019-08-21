import * as Faker from 'faker';
import { Subscription } from '../../src/subscription/subscription.entity';
import { User } from '../../src/user/user.entity';
import { Company } from '../../src/company/company.entity';

export default function subscriptionFactory(
  users: User[],
  companies: Company[]
) {
  const random = Faker.random.arrayElement;
  const sub = new Subscription();

  sub.setDuration();
  sub.owner = random(users);
  sub.company = random(companies);
  sub.price = Faker.random.number({ min: 5, max: 100 }) * 100;

  return sub;
}
