import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';
import { AccessControlModule } from './access-control/access-control.module';

@Module({
  imports: [MailModule, ConfigModule, AccessControlModule],
})
export class CoreModule {}
