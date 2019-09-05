import * as Faker from 'faker';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

/* This will only once hash password */
const passwordHash = bcrypt.hashSync('password', 12);

export function generateUser() {
  const user = new User();
  user.id = Faker.random.uuid();
  user.email = Faker.internet.email().toLowerCase();
  user._password = passwordHash;
  user.name = Faker.name.firstName();
  user.phoneNumber = Faker.phone.phoneNumber();
  user.avatar = 'https://i.pravatar.cc/920';

  return user;
}
