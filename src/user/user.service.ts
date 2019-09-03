import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import BaseException from '../core/BaseException';
import { LoginData } from '../auth/auth.dto';
import { BaseService } from '../core/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  /**
   * Create user
   * @override Overides BaseServiceMethod for more specific for user.
   */
  async create({ email, password }: LoginData): Promise<User> {
    const userExist = await this.findOne({ email });
    if (userExist) throw new BaseException({ message: 'User exist' });

    const user = new User();
    user.email = email;
    user.password = password;
    user.generateSecureToken();
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
