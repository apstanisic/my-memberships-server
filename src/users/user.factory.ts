import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import * as Faker from 'faker';
import { Image } from 'nestjs-extra';
import { User } from './user.entity';

/* This will only once hash password */
const passwordHash = bcrypt.hashSync('password', 12);

export function generateUser(): User {
  const user = new User(Faker.random.uuid());
  // user.id = Faker.random.uuid();
  user.email = Faker.internet.email().toLowerCase();
  user._password = passwordHash;
  user.name = Faker.name.firstName();
  user.phoneNumber = Faker.phone.phoneNumber();
  user.avatar = plainToClass(Image, {
    prefix: 'https://i.pravatar.cc',
    xs: 'https://i.pravatar.cc/220',
    sm: 'https://i.pravatar.cc/420',
    md: 'https://i.pravatar.cc/720',
    lg: 'https://i.pravatar.cc/920',
  });

  return user;
}
