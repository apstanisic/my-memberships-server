import * as Faker from 'faker';
import { Role } from './roles.entity';
import { availableRoles } from './roles.list';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';

export function generateRole(users: User[], companies: Company[] = []) {
  const random = Faker.random.arrayElement;

  const role = new Role();
  role.user = random(users);
  role.name = random(availableRoles as any);
  role.domain = random(companies).id;

  return role;
}

export function generateUserRole(user: User) {
  const role = new Role();
  role.user = user;
  role.name = availableRoles['1'];
  role.domain = user.id;

  return role;
}
