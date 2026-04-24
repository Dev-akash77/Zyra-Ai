import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../constants/injection.token';
import { MyLoggerService } from '../logger/logger.service';
import { type Transporter } from 'nodemailer';
import { ErrorCode } from '../../enums/error.code';
import { AppException } from '../../exceptions/app.exception';

@Injectable()
export class MailService {
  constructor(
    @Inject(injection_token.NODEMAILER_CONNECTION)
    private readonly transporter: Transporter,
    private readonly logger: MyLoggerService,
  ) {}

  private getOtpTemplate(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
          
          <h2 style="color: #333;">🔐 Verify Your Email</h2>
          
          <p style="color: #555;">
            Use the OTP below to complete your verification process:
          </p>

          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; color: #2d89ef;">
            ${otp}
          </div>

          <p style="color: #777;">
            This OTP is valid for <b>10 minutes</b>.
          </p>

          <p style="color: #999; font-size: 12px;">
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>
      </div>
    `;
  }

  private getWelcomeTemplate(name: string, email: string): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 10px; text-align: center;">
        
        <h2 style="color: #2d89ef;">🎉 Welcome, ${name}!</h2>

        <p style="color: #555; font-size: 16px;">
          Your account has been successfully created.
        </p>

        <div style="margin: 20px 0; padding: 12px; background: #f1f1f1; border-radius: 6px;">
          <p style="margin: 0; color: #333; font-size: 14px;">
            <strong>Registered Email:</strong><br/>
            ${email}
          </p>
        </div>

        <p style="color: #555;">
          You can now explore all features of our platform.
        </p>

        <a href="http://your-app-url.com" 
           style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2d89ef; color: #fff; text-decoration: none; border-radius: 5px;">
           Get Started 🚀
        </a>

        <p style="margin-top: 20px; color: #999; font-size: 12px;">
          If this wasn’t you, please contact support immediately.
        </p>

      </div>
    </div>
  `;
  }



  // send mail
  async sendOtpMail(to: string, otp: string) {
    console.log('Sending OTP email to:', to); // Debug log for email address

    this.logger.log(`Sending OTP email to: ${to}`, 'MailService');

    if (to === '') {
      this.logger.error('No recipient email provided', 'MailService');

      throw new AppException(
        'Recipient email is required',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }

    if (otp === '') {
      this.logger.error('No OTP provided', 'MailService');
      throw new AppException(
        'OTP is required',
        HttpStatus.BAD_REQUEST,
        ErrorCode.MISSING_REQUIRED_FIELD,
      );
    }
    const html = this.getOtpTemplate(otp);

    return this.transporter.sendMail({
      from: `"Zyra AI" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      html,
    });
  }


  // welcome mail
  async sendWelcomeMail(to: string, name: string) {
  const html = this.getWelcomeTemplate(name, to);

  return this.transporter.sendMail({
    from: `"Zyra AI" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Welcome to Our Platform 🎉',
    html,
  });
}
}
