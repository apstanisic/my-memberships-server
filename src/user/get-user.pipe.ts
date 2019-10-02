import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';
import { UsersService } from './user.service';
import { User } from './user.entity';

/**
 *  Get user by provided Id or email. This will return user without authorization
 *  @example
 *    method(@Param('id', GetUserPipe) user: User) {}
 */
@Injectable()
export class GetUserPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any): Promise<User> {
    const validator = new Validator();
    let user: User;

    if (validator.isUUID(value)) {
      user = await this.usersService.findOne(value);
    } else if (validator.isEmail(value)) {
      user = await this.usersService.findOne({ email: value });
    } else {
      throw new BadRequestException();
    }

    return user;
  }
}
