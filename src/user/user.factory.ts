import * as Faker from 'faker';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

export function generateUser() {
  const user = new User();
  user.id = Faker.random.uuid();
  user.email = Faker.internet.email();
  user.password = bcrypt.hashSync('password', 10);
  user.name = Faker.name.firstName();
  user.phoneNumber = Faker.phone.phoneNumber();
  user.avatar = 'https://i.pravatar.cc/920';

  return user;
}