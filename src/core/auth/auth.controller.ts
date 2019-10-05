import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { classToClass, plainToClass } from 'class-transformer';
import { UsersService } from '../../user/user.service';
import { BaseUser } from '../entities/base-user.entity';
import { AuthMailService } from './auth-mail.service';
import { LoginData, RegisterData, SignInResponse } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly authMailService: AuthMailService,
  ) {}

  /** Attempt to login user */
  @Post('login')
  async login(@Body() { email, password }: LoginData): Promise<SignInResponse> {
    return this.authService.attemptLogin(email, password);
  }

  /** Register new user */
  /** @todo Add sending mail */
  @Post('register')
  async register(@Body() data: RegisterData): Promise<SignInResponse> {
    const user = await this.usersService.create(data);
    const token = this.authService.createJwt(data.email);

    if (!user.secureToken) throw new ForbiddenException();
    await this.authMailService.sendConfirmationEmail(
      user.email,
      user.secureToken,
    );

    // For some reason user is not transformed without class to class
    return { token, user: classToClass(user) };
  }

  /* Confirm user account */
  @Put('confirm-account/:email/:token')
  async confirmAccout(
    @Param('email') email: string,
    @Param('token') token: string,
  ): Promise<BaseUser> {
    const user = await this.usersService.findOne({ email });
    if (user === undefined) throw new UnauthorizedException();
    if (user.secureToken !== token) throw new BadRequestException();
    user.confirmed = true;
    user.secureToken = undefined;
    user.tokenCreatedAt = undefined;
    await this.usersService.update(user);
    return plainToClass(BaseUser, user);
  }
}
