import { Injectable, NotImplementedException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';
import { InternalError } from '../core/custom-exceptions';

/**
 * Simple mail service. Wrapper around nodemailer.
 * Default values are Ethereal test data and config.
 */
@Injectable()
export class MailService {
  /** Object that is in charge of sending mail */
  private transporter: nodemailer.Transporter;

  /** Sender email address */
  private sender: string = 'toby.leffler@ethereal.email';

  /** Sender password */
  private password: string = 'tXC6AxGXHYWBmXrtyq';

  /** Sender real name */
  private sendeName: string = 'Toby Leffler';

  /** Host address */
  private host: string = 'smtp.ethereal.email';

  /** Port */
  private port: number = 587;

  /** Should use secure transport */
  private secure: boolean = false;

  /** Logger */
  private logger = new Logger();

  /** In production use values from configModule (.env file) */
  constructor(private readonly configService: ConfigService) {
    if (configService.get('NODE_ENV') === 'production') {
      this.host = this.configService.get('EMAIL_HOST');
      this.port = Number(this.configService.get('EMAIL_PORT'));
      this.secure = false; // true for 465, false for other ports
      this.sender = this.sender;
      this.password = this.configService.get('EMAIL_PASSWORD');
    }
    this.createTransport();
  }

  /** Send mail */
  send(data: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    try {
      return this.transporter.sendMail(data);
    } catch (error) {
      this.logger.error(error);
      throw new InternalError('Problem sending email.');
    }
  }

  /** Creates transporter instance */
  private createTransport() {
    this.transporter = nodemailer.createTransport(
      {
        host: this.host,
        port: this.port,
        secure: this.secure, // true for 465, false for other ports
        auth: {
          user: this.sender,
          pass: this.password,
        },
      },
      { sender: this.sender },
    );
    this.transporter
      .verify()
      .then(() => this.logger.log('Mail is working correctly.', 'MailModule'))
      .catch(e => this.logger.error('Mail is not working', e, 'MailModule'));
  }
}
