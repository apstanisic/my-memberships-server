import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseService,
  RegisterUserDto,
  Role,
  StorageImagesService,
  RoleService,
} from 'nestjs-extra';
import { Repository } from 'typeorm';
// import { Role } from '../core/access-control/roles.entity';
// import { RegisterUserDto } from '../core/auth/auth.dto';
// import { BaseService } from '../core/base.service';
// import { StorageImagesService } from '../core/storage/storage-images.service';
import { User } from './user.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly storageImagesService: StorageImagesService,
  ) {
    super(repository);
  }

  /**
   * Create user and gives him basic roles.
   * @override Overides BaseServiceMethod for more specific for user.
   * @todo Delete should remove personal info for GDPR
   */
  async create({ email, password, name }: RegisterUserDto): Promise<User> {
    const userExist = await this.repository.findOne({ email });
    if (userExist) throw new BadRequestException('User exists');

    try {
      const user = new User();
      user.email = email;
      user.password = password;
      user.name = name;
      user.generateSecureToken();
      const savedUser = await this.repository.save(user);

      const defaultRole = new Role();
      defaultRole.domain = savedUser.id;
      defaultRole.name = 'user';
      defaultRole.userId = savedUser.id;
      await this.roleService.create(defaultRole);

      return savedUser;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
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

  /** Add avatar to user entity and to storage. Delete old avatar if exists. */
  async changeAvatar(user: User, newAvatar: Buffer): Promise<any> {
    if (user.avatar) {
      await this.removeAvatar(user);
    }

    const name = `avatars/${user.id}`;
    const [sizes, prefix] = await this.storageImagesService.addImage(newAvatar);

    user.avatar = sizes;
    const updatedUser = await this.mutate(user, {
      user,
      reason: 'Add avatar',
      domain: user.id,
    });

    return updatedUser;
  }

  /** Remove avatar image from storage and from entity */
  async removeAvatar(user: User): Promise<User> {
    if (!user.avatar) return user;
    await this.storageImagesService.removeImageBySizes(user.avatar);

    delete user.avatar;
    const updatedUser = await this.mutate(user, {
      user,
      reason: 'Remove avatar',
      domain: user.id,
    });

    return updatedUser;
  }
}
