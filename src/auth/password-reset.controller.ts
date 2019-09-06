import {
  Controller,
  Body,
  Post,
  Param,
  ForbiddenException,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import * as moment from 'moment';
import { classToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { LoginData } from './auth.dto';
import { UsersService } from '../user/user.service';
import { ValidateEmailPipe } from '../core/validate-email.pipe';
import { MailService } from '../mail/mail.service';
import { GetUserPipe } from '../user/get-user.pipe';

/** Controller for password reseting */
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class PasswordResetController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /** Send email with reset instruction */
  @Post('forgot-password/:email')
  async sendPasswordRecoveryMail(
    @Param('email', ValidateEmailPipe) email: string,
  ) {
    // Don't throw error, just say that you sent mail, if user doesn't exist
    const user = await this.usersService.findOne({ email });
    const token = user.generateSecureToken();
    await this.usersService.update(user);

    const templateData = {
      token,
      email: user.email,
      url: this.mailService.getDomainUrl(),
    };

    await this.mailService.sendResetPasswordEmail({
      templateData,
      to: user.email,
    });

    return { message: 'Password reset email is sent. ' };
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
