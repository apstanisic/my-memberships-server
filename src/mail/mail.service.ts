import { Injectable, NotImplementedException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';

/** Simple mail service */
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    if (configService.get('NODE_ENV') !== 'production') {
      nodemailer.createTestAccount().then(testAccount => {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('EMAIL_HOST'),
        port: Number(this.configService.get('EMAIL_PORT')),
        secure: false, // true for 465, false for other ports
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASSWORD'),
        },
      });
    }
  }

  send(data: nodemailer.SendMailOptions) {
    this.transporter.sendMail(data);
  }

  sendConfirmationEmail() {
    throw new NotImplementedException();
  }

  sendResetPasswordEmail() {
    throw new NotImplementedException();
  }
}

interface SendData {
  to: string;
  templateData: Record<string, any>;
}
