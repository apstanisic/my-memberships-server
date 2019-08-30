import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '../config/config.module';

@Module({
  providers: [MailService],
  imports: [ConfigModule],
  exports: [MailService],
})
export class MailModule {}
