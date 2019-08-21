import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import parseQuery from '../core/parseQuery';
import BaseException from '../core/BaseException';
import { AuthData } from '../auth/auth.dto';
import { UpdateUserInfo } from './update-user.dto';

/* This actions are not protected. It's up to controllers to protect them. */
@Injectable()
export class UsersService {
  /* Service can use user repository */
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  /* Find single user with any query */
  findOne(criteria: DeepPartial<User>) {
    return this.usersRepository.findOne({ where: parseQuery(criteria) });
  }

  /* Find user by id */
  findById(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  /* Create new user */
  async create({ email, password }: AuthData): Promise<User> {
    const userExist = await this.findOne({ email });
    if (userExist !== undefined)
      throw new BaseException({ message: 'User exist' });

    const user = new User();
    user.email = email;
    await user.setPassword(password);
    user.generateSecureToken();
    await user.validate();
    return this.usersRepository.save(user);
  }

  /* Delete existing user */
  async delete(user: User): Promise<User> {
    return this.usersRepository.remove(user);
  }

  /* Update user by id */
  /* You can provide already modified user to save */
  async update(user: User, data: UpdateUserInfo = {}): Promise<User> {
    this.usersRepository.merge(user, data);
    await user.validate();
    return this.usersRepository.save(user);
  }

  /* Find user for login with provided email and password */
  async findForLogin(email: string, password: string): Promise<User> {
    const user = await this.findOne({ email });
    if (user === undefined) throw new NotFoundException();

    if (!(await user.comparePassword(password))) {
      throw new BadRequestException('Password does not match.');
    }
    return user;
  }
}
