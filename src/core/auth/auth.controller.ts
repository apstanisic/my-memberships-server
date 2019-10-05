import {
  Controller,
  Body,
  Post,
  BadRequestException,
  Param,
  Put,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToClass, classToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { UsersService } from '../../user/user.service';
import { LoginData, SignInResponse, RegisterData } from './auth.dto';
import { MailService } from '../mail/mail.service';
import { BaseUser } from '../entities/base-user.entity';
import { Struct } from '../types';
import { AuthMailService } from './auth-mail.service';

/** AuthController needs this method. Implement so we can inject usersService */
interface IUsersService {
  attemptLogin: (email: string, password: string) => Promise<SignInResponse>;
  findOne: (filter: Struct) => Promise<BaseUser>;
  create: (user: RegisterData) => Promise<BaseUser>;
  update: (user: BaseUser, newData?: any) => Promise<BaseUser>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
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
