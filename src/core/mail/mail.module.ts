import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '../config/config.module';

/**
 * Wrapper around nodemailer.
 * Use this instead of @nest-modules/mailer cause it has fewer
 * dependecies. I don't want Pug or Handlebars without reason.
 */
@Global()
@Module({
  providers: [MailService],
  imports: [ConfigModule],
  exports: [MailService],
})
export class MailModule {}
