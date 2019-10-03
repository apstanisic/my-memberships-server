import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Faker from 'faker';
import { User } from './user.entity';
import { RegisterData } from '../core/auth/auth.dto';
import { BaseService } from '../core/base.service';
import { Role } from '../core/access-control/roles.entity';
import { LogMetadata } from '../core/logger/log-metadata';
import { Log } from '../core/logger/log.entity';
import { StorageService } from '../core/storage/storage.service';
import { generateAllImageSizes } from '../company/company-images/sharp';
import { Image, ImageSizes } from '../core/types';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly storageService: StorageService,
  ) {
    super(repository);
  }

  /**
   * Create user and gives him basic roles.
   * @override Overides BaseServiceMethod for more specific for user.
   * @todo Delete should remove personal info for GDPR
   */
  async create({ email, password, name }: RegisterData): Promise<User> {
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
      defaultRole.user = savedUser;
      await this.roleRepository.save(defaultRole);

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
    const buffers = await generateAllImageSizes(newAvatar);
    const toStore = [];
    toStore.push(this.storageService.put(buffers.xs, `${name}_xs.jpeg`));
    toStore.push(this.storageService.put(buffers.sm, `${name}_sm.jpeg`));
    toStore.push(this.storageService.put(buffers.md, `${name}_md.jpeg`));
    toStore.push(this.storageService.put(buffers.lg, `${name}_lg.jpeg`));

    const storedImages = await Promise.all(toStore);
    const image: ImageSizes = {
      xs: storedImages[0],
      sm: storedImages[1],
      md: storedImages[2],
      lg: storedImages[3],
    };

    user.avatar = image;
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
    const { xs, sm, md, lg } = user.avatar;
    const deleted = [];
    if (xs) deleted.push(this.storageService.delete(xs));
    if (sm) deleted.push(this.storageService.delete(sm));
    if (md) deleted.push(this.storageService.delete(md));
    if (lg) deleted.push(this.storageService.delete(lg));
    await Promise.all([xs, sm, md, lg]);

    delete user.avatar;
    const updatedUser = await this.mutate(user, {
      user,
      reason: 'Remove avatar',
      domain: user.id,
    });

    return updatedUser;
  }
}
