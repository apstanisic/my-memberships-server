import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';
import { plainToClass } from 'class-transformer';
import { SignInResponse } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /* Try to sign in user */
  async attemptSignIn(
    email: string,
    password: string
  ): Promise<SignInResponse> {
    const user = await this.usersService.findForLogin(email, password);
    const token = this.jwtService.sign({ email: user.email });
    return plainToClass(
      SignInResponse,
      { token, user },
      { enableCircularCheck: true }
    );
  }

  /* Validate token on every request */
  async validateJwt({ email }: JwtPayload): Promise<any> {
    return this.usersService.findOne({ email });
  }

  /* Generate new token when user logs in */
  async createJwt(email: string) {
    return this.jwtService.sign({ email });
  }
}
