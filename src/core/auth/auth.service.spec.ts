import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../user/user.service';
import { AuthService } from './auth.service';
import { User } from '../../user/user.entity';

const jwtMock = jest.fn(() => ({ sign: (value: any): string => value }));
const findMock = jest.fn().mockReturnValue(new User());
const findOneMock = jest.fn().mockReturnValue(new User());
const userMock = jest.fn(() => ({
  findForLogin: findMock,
  findOne: findOneMock,
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useFactory: userMock },
        { provide: JwtService, useFactory: jwtMock },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userMock.mockClear();
  });

  it('creates passed value to jwt.sign', () => {
    expect(authService.createJwt('test')).toEqual({ email: 'test' });
    expect(authService.createJwt('any-value')).toEqual({ email: 'any-value' });
  });

  it('validates jwt', async () => {
    await expect(
      authService.validateJwt({ email: 'valid@email.com' }),
    ).resolves.toBeInstanceOf(User);
  });

  it('throws on invalid values', async () => {
    await expect(authService.validateJwt(undefined as any)).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      authService.validateJwt({ email: 'bad-email' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('passes findOne error', async () => {
    findOneMock.mockRejectedValue(new NotFoundException());
    await expect(
      authService.validateJwt({ email: 'test@email.com' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('passes findOne error', async () => {
    findOneMock.mockRejectedValue(new NotFoundException());
    await expect(
      authService.validateJwt({ email: 'test@email.com' }),
    ).rejects.toThrow(NotFoundException);
  });
});
