import {
  PipeTransform,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Validator } from 'class-validator';
import { UsersService } from './user.service';
import { User } from './user.entity';

/**
 *  Get user by provided Id. This will return user without authorization
 *  User can be undefined!!
 *  @example
 *    method(@Param('id', UserByIdPipe) user?: User) {}
 */
@Injectable()
export class GetUserPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: string): Promise<User | undefined> {
    const validator = new Validator();
    let user: User | undefined;

    if (validator.isUUID(value)) {
      user = await this.usersService.findById(value);
    } else if (validator.isEmail(value)) {
      user = await this.usersService.findOne({ email: value });
      if (!user) throw new NotFoundException();
    } else {
      throw new BadRequestException();
    }

    return user;
  }
}
