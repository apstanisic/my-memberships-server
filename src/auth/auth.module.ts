import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PasswordResetController } from './password-reset.controller';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get('JWT_SECRET');
        return { secret, signOptions: { expiresIn: '10 days' } };
      },
    }),
    MailModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, PasswordResetController],
  exports: [AuthService],
})
export class AuthModule {}
