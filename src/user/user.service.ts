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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  /** Find single user with any query */
  findOne(criteria: Record<string, any>): Promise<User | undefined> {
    return this.repository.findOne({ where: parseQuery(criteria) });
  }

  /** Find user by id */
  findById(id: string): Promise<User> {
    return this.repository.findOneOrFail(id);
  }

  /** Create user */
  async create({ email, password }: AuthData): Promise<User> {
    const userExist = await this.findOne({ email });
    if (userExist) throw new BaseException({ message: 'User exist' });

    const user = new User();
    user.email = email;
    user.password = password;
    user.generateSecureToken();
    return this.repository.save(user);
  }

  /** Delete user */
  async delete(user: User): Promise<User> {
    return this.repository.remove(user);
  }

  /** Update user by id. You can provide already modified user to save */
  async update(user: User, data: UpdateUserInfo = {}): Promise<User> {
    this.repository.merge(user, data);
    return this.repository.save(user);
  }

  /** Find user for login with provided email and password */
  async findForLogin(email: string, password: string): Promise<User> {
    const user = await this.findOne({ email });
    if (!user) throw new NotFoundException();

    if (!(await user.checkPassword(password))) {
      throw new BadRequestException('Invalid parameters.');
    }
    return user;
  }
}
