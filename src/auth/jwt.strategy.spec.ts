import { Test } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

const configMock = jest.fn(() => ({ get: (key: any): string => key }));
const authMock = jest.fn(() => ({
  async validateJwt(payload: any): Promise<User | undefined> {
    if (payload.email === 'throwme') throw new ForbiddenException();
    if (payload.email === 'return-falsy') return undefined;
    return new User();
  },
}));

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useFactory: configMock },
        { provide: AuthService, useFactory: authMock },
        JwtStrategy,
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('returns a user', async () => {
    const user = await jwtStrategy.validate({ email: 'testemail@examle.com' });
    expect(user).toBeInstanceOf(User);
  });

  it('throws if authService throws', async () => {
    const res = jwtStrategy.validate({ email: 'throwme' });
    await expect(res).rejects.toThrow(ForbiddenException);
  });

  it('throws if authService returns falsy', async () => {
    const res = jwtStrategy.validate({ email: 'return-falsy' });
    await expect(res).rejects.toThrow(UnauthorizedException);
  });
});
