import {
  Controller,
  Body,
  Post,
  Param,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as moment from 'moment';
import { classToClass } from 'class-transformer';
import { User } from '../../user/user.entity';
import { LoginData } from './auth.dto';
import { UsersService } from '../../user/user.service';
import { ValidEmail } from '../validate-email.pipe';
import { MailService } from '../mail/mail.service';
import { GetUserPipe } from '../../user/get-user.pipe';

/** Controller for password reseting */
@Controller('auth')
export class PasswordResetController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /** Send email with reset instruction */
  @Post('forgot-password/:email')
  async sendPasswordRecoveryMail(
    @Param('email', ValidEmail) email: string,
  ): Promise<{ message: string }> {
    // Don't throw error, just say that you sent mail, if user doesn't exist
    const successMessage = { message: 'Password reset email is sent. ' };
    let user;
    let token;
    try {
      user = await this.usersService.findOne({ email });
      token = user.generateSecureToken();
      user = await this.usersService.update(user);
    } catch (error) {
      return successMessage;
    }

    await this.mailService.send({
      to: user.email,
      subject: 'Password recovery - My Subscriptions',
      text: `Here is your token ${token}`,
      html: `<h1>Password Recovery Test: ${token}</h1>`,
    });

    return successMessage;
  }

  /** Reset user password */
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

    const clonedUser = classToClass(user);

    clonedUser.password = data.password;
    clonedUser.disableSecureToken();
    await this.usersService.update(clonedUser);

    return user;
  }
}
