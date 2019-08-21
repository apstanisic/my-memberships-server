import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';
import { ConfigService } from '../config/config.service';

interface MailData extends mailgun.messages.SendData {
  [key: string]: any;
}

@Injectable()
export class MailService {
  private mg: mailgun.Mailgun;
  private data: MailData;

  constructor(private readonly configService: ConfigService) {
    this.mg = mailgun({
      apiKey: configService.get('MAILGUN_ACTIVE_API_KEY'),
      domain: configService.get('MAILGUN_DOMAIN')
    });
    this.data = {
      from:
        'Nadji auto test <postmaster@sandbox21d33c531d11422b870651057720097e.mailgun.org>',
      to: 'test@nadjiauto.com',
      subject: 'Nadji auto'
    };
  }

  /* It will get all passed object keys, and replace detault object with it */
  send(data: MailData) {
    const mergedData = { ...this.data };
    Object.keys(data).forEach(prop => {
      mergedData[prop] = data[prop];
    });
    return this.mg.messages().send(mergedData);
  }

  /*
  URL for callback. In production use nadjiauto.com, in test give url of the
  React instance
  */
  getDomainUrl() {
    const url =
      process.env.NODE_ENV === 'production'
        ? 'https://www.nadjiauto.com'
        : 'http://localhost:3000';
    return url;
  }

  sendConfirmationEmail({ templateData, to }: SendData) {
    return this.send({
      to,
      'h:X-Mailgun-Variables': templateData,
      template: 'confirm_email',
      subject: 'Potvrda naloga'
    });
  }

  sendResetPasswordEmail({ to, templateData }: SendData) {
    return this.send({
      to,
      'h:X-Mailgun-Variables': templateData,
      subject: 'Nadji auto - Resetovanje sifre',
      template: 'password_recovery'
    });
  }
}

interface SendData {
  to: string;
  templateData: Record<string, any>;
}
