import {
  Controller,
  Body,
  Post,
  Param,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as moment from 'moment';
import { User } from '../../user/user.entity';
import { LoginData } from './auth.dto';
import { UsersService } from '../../user/user.service';
import { ValidEmail } from '../validate-email.pipe';
import { MailService } from '../mail/mail.service';
import { GetUserPipe } from '../../user/get-user.pipe';
import { AuthMailService } from './auth-mail.service';

/** Controller for password reseting */
@Controller('auth')
export class PasswordResetController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authMailService: AuthMailService,
  ) {}

  /** Send email with reset instruction */
  @Post('forgot-password/:email')
  async sendPasswordRecoveryMail(
    @Param('email', ValidEmail) email: string,
  ): Promise<{ message: string }> {
    this.authMailService.sendResetPasswordEmail(email);

    // Don't throw error, just say that you sent mail, if user doesn't exist
    return { message: 'Password reset email is sent. ' };
  }

  /** Method that reset the user password and sets it in db */
  @Post('reset-password/:email/:token')
  async resetPassword(
    @Param('email', GetUserPipe) user: User,
    @Param('token') token: string,
    @Body() data: LoginData,
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

    user.password = data.password;
    user.disableSecureToken();
    user = await this.usersService.mutate(user, {
      user,
      reason: 'Password reset',
      domain: user.id,
    });

    return user;
  }
}
