import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseUserService } from 'nestjs-extra';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends BaseUserService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
}
