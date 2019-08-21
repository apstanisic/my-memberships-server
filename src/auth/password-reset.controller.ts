import {
  Controller,
  Body,
  Post,
  Param,
  ForbiddenException,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthData } from './auth.dto';
import { UsersService } from '../user/user.service';
import * as moment from 'moment';
import { ValidateEmailPipe } from './parse-email.pipe';
import { MailService } from '../mail/mail.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class PasswordResetController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  /* send email with reset instruction */
  @Post('forgot-password/:email')
  async sendPasswordRecoveryMail(
    @Param('email', ValidateEmailPipe) email: string
  ) {
    const user = await this.usersService.findOne({ email });
    /* Don't throw error, just say that you sent mail, if email doesn't exist */
    if (user !== undefined) {
      user.generateSecureToken();
      this.usersService.update(user);
      const token = user.secureToken;

      const templateData = {
        token,
        email: user.email,
        url: this.mailService.getDomainUrl()
      };
      // TODO: Replace this email addres
      const res = await this.mailService.sendResetPasswordEmail({
        templateData,
        to: 'vegujame@coinlink.club'
      });

      console.log(res);

      // mail(user.email, token)
    }
    return { message: 'Password reset email is sent. ' };
  }

  /* Reset user password */
  @Post('reset-password/:email/:token')
  async resetPassword(
    @Param('email', ValidateEmailPipe) email: string,
    @Param('token') token: string,
    @Body() data: AuthData
  ): Promise<User> {
    const user = await this.usersService.findOne({ email });

    if (user === undefined || !user.tokenCreatedAt) {
      throw new ForbiddenException();
    }

    const expired = moment(user.tokenCreatedAt)
      .add(2, 'hours')
      .isAfter(moment());

    if (user.secureToken !== token || !expired) {
      throw new BadRequestException(
        'Link is eather not valid or is expired. Try again.'
      );
    }

    await user.setPassword(data.password);
    user.secureToken = undefined;
    user.tokenCreatedAt = undefined;
    await this.usersService.update(user);

    return user;
  }
}
