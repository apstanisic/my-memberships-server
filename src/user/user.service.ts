import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterData } from '../auth/auth.dto';
import { BaseService } from '../core/base.service';
import { Role } from '../access-control/roles.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    super(repository);
  }

  /**
   * Create user and gives him basic roles.
   * @override Overides BaseServiceMethod for more specific for user.
   */
  async create({ email, password, name }: RegisterData): Promise<User> {
    const userExist = await this.repository.findOne({ email });
    if (userExist) throw new BadRequestException('User exists');

    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    user.generateSecureToken();
    const savedUser = await this.repository.save(user);

    const defaultRole = new Role();
    defaultRole.domain = savedUser.id;
    defaultRole.name = 'user';
    defaultRole.user = savedUser;
    const savedRole = await this.roleRepository.save(defaultRole);

    savedUser.roles.push(savedRole);
    return savedUser;
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

  // async removePersonalInfo(userOrId: User | string): Promise<User> {
  //   const user = await this.convertToEntity(userOrId);
  //   user.name = 'Deleted';
  //   user.email = 'deleted@example.com';
  //   user.phoneNumber = undefined;
  //   user.avatar = undefined;
  //   return user;
  // }
}
