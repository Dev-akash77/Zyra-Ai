import { Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../common/constants/injection.token';
import { type Transporter } from 'nodemailer';
import { MyLoggerService } from '../../common/services/logger/logger.service';
import { WelcomeTemplate } from './templates/welcome.templete';
import { otpTemplate } from './templates/otp.templete';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(injection_token.NODEMAILER_CONNECTION)
    private readonly transporter: Transporter,
    private readonly logger: MyLoggerService, 
  ) {}

  //! SEND WELCOME EMAIL
  async sendWelcomeEmail(name: string, to: string) {
    const html = WelcomeTemplate(name, to, 'zyra.vercel.app');

    return await this.transporter.sendMail({
      from: `"Zyra AI" <${process.env.SENDER_EMAIL}>`,
      to,
      subject: 'WELCOME TO ZYRA AI',
      html,
    });
  }

  //! SEND OTP
  async sendOtpEmail(otp: string, to: string) {
    const html = otpTemplate(otp);

    const info = await this.transporter.sendMail({
      from: `"Zyra AI" <${process.env.SENDER_EMAIL}>`,
      to,
      subject: 'YOUR OTP CODE',
      html,
    });

    this.logger.log(
      `OTP email sent to ${to} | MessageId: ${info.messageId}`,
      'notification.service',
    );
  }
}
