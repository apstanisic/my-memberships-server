import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './user.service';

/**
 *  Get user by provided Id. This will return user without authorization
 *  User can be undefined!!
 *  @example
 *    method(@Param('id', UserByIdPipe) user?: User) {}
 */
@Injectable()
export class GetUserByEmailPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: string) {
    const user = await this.usersService.findOne({ email: value });
    if (!user) throw new NotFoundException();
    return user;
  }
}
