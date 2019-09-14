import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MailModule, ConfigModule, AccessControlModule, AuthModule],
})
export class CoreModule {}
