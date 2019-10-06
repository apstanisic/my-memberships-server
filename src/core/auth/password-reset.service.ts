import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment';
import { User } from '../../user/user.entity';
import { UsersService } from '../../user/user.service';

@Injectable()
export class PasswordResetService {
  constructor(private readonly usersService: UsersService) {}

  async resetPassword(
    user: User,
    token: string,
    password: string,
  ): Promise<User> {
    if (!user.compareToken(token)) throw new ForbiddenException();

    const expired = moment(user.tokenCreatedAt)
      .add(2, 'hours')
      .isBefore(moment());

    if (expired) {
      throw new BadRequestException(
        'Link is not valid. Link is valid for 2 hours',
      );
    }

    user.password = password;
    user.disableSecureToken();
    user = await this.usersService.mutate(user, {
      user,
      reason: 'Password reset',
      domain: user.id,
    });

    return user;
  }
}
