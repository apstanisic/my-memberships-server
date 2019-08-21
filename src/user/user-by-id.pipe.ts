import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './user.service';

/* Get user by provided Id. This will return user without authorization */
@Injectable()
export class UserByIdPipe implements PipeTransform<string> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: string) {
    try {
      return await this.usersService.findById(value);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
