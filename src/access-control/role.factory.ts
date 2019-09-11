import * as Faker from 'faker';
import { Role } from './roles.entity';
import { availableRoles } from './roles.list';
import { User } from '../user/user.entity';
import { UUID } from '../core/types';

export function generateRole(users: User[], domain: UUID[] = []): Role {
  const random = Faker.random.arrayElement;

  const role = new Role();
  role.user = random(users);
  role.name = random(availableRoles as any);
  role.domain = random(domain);

  return role;
}

export function generateUserRole(user: User): Role {
  const role = new Role();
  role.user = user;
  role.name = availableRoles['1'];
  role.domain = user.id;

  return role;
}
