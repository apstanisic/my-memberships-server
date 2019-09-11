import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { Validator } from 'class-validator';
import { UsersService } from '../../user/user.service';
import { JwtPayload } from './jwt.strategy';
import { SignInResponse } from './auth.dto';
import { User } from '../../user/user.entity';

@Injectable()
export class AuthService {
  /** Service logger */
  private logger = new Logger();

  private validator = new Validator();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Try to sign in user */
  async attemptLogin(email: string, password: string): Promise<SignInResponse> {
    const user = await this.usersService.findForLogin(email, password);
    const token = this.createJwt(user.email);
    return { token, user: classToClass(user) };
  }

  /** Validate token on every request. From docs */
  async validateJwt(payload: JwtPayload): Promise<User> {
    if (!payload || !this.validator.isEmail(payload.email)) {
      throw new BadRequestException();
    }
    return this.usersService.findOne({ email: payload.email });
  }

  /** Generate new token when user logs in */
  createJwt(email: string): string {
    return this.jwtService.sign({ email });
  }
}
