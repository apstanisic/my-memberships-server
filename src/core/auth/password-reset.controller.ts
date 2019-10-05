import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
} from '@nestjs/common';
import * as moment from 'moment';
import { GetUserPipe } from '../../user/get-user.pipe';
import { User } from '../../user/user.entity';
import { UsersService } from '../../user/user.service';
import { ValidEmail } from '../validate-email.pipe';
import { AuthMailService } from './auth-mail.service';
import { OnlyPasswordDto } from './auth.dto';

/** Controller for password reseting */
@Controller('auth')
export class PasswordResetController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authMailService: AuthMailService,
  ) {}

  /**
   * Send email with reset instruction.
   * This is async, but there is no need to wait.
   * User should not know if account with given email exist.
   * Always return success. Even if it throws error, return success.
   */
  @Post('forgot-password/:email')
  async sendPasswordRecoveryMail(
    @Param('email', ValidEmail) email: string,
  ): Promise<{ message: string }> {
    this.authMailService.sendResetPasswordEmail(email);

    return { message: 'Password reset email is sent. ' };
  }

  /**
   * Method that reset the user password and sets it in db.
   * Frontend should call this method. It must be post request.
   */
  @Post('reset-password/:email/:token')
  async resetPassword(
    @Param('email', GetUserPipe) user: User,
    @Param('token') token: string,
    @Body() { password }: OnlyPasswordDto,
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
