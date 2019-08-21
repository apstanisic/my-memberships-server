import {
  Controller,
  Body,
  Post,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Put,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { AuthData, SignInResponse } from './auth.dto';
import { plainToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { MailService } from '../mail/mail.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  /* Try to login user */
  @Post('login')
  async login(@Body() { email, password }: AuthData): Promise<SignInResponse> {
    return this.authService.attemptSignIn(email, password);
  }

  /* Register new user */
  @Post('register')
  async register(@Body() data: AuthData) {
    try {
      const user = await this.usersService.create(data);
      const jwtToken = await this.authService.createJwt(data.email);

      const templateData = {
        url: this.mailService.getDomainUrl(),
        email: user.email,
        token: user.secureToken
      };

      const res = await this.mailService.sendConfirmationEmail({
        templateData,
        to: user.email
      });

      console.log(res);

      return plainToClass(SignInResponse, { token: jwtToken, user });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /* Confirm user account */
  @Put('confirm-account/:email/:token')
  async confirmAccout(
    @Param('email') email: string,
    @Param('token') token: string
  ) {
    const user = await this.usersService.findOne({ email });
    if (user === undefined) throw new UnauthorizedException();
    if (user.secureToken !== token) throw new BadRequestException();
    user.confirmed = true;
    user.secureToken = undefined;
    user.tokenCreatedAt = undefined;
    await this.usersService.update(user);
    return plainToClass(User, user);
  }
}
