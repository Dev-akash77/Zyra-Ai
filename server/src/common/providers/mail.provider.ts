import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { injection_token } from '../constants/injection/injection.token';
import { MyLoggerService } from '../services/logger/logger.service';
import { MailConfigTypes } from '../types/mail.types';

export const MailProvider: Provider = {
  provide: injection_token.NODEMAILER_CONNECTION,
  inject: [ConfigService, MyLoggerService],

  useFactory: async (configService: ConfigService, logger: MyLoggerService) => {
    const config = configService.get<MailConfigTypes>('mail');

    if (!config) {
      logger.error('Mail config missing', '', 'MailProvider');
      throw new Error('Mail config missing');
    }

    const transporter = nodemailer.createTransport({ 
      host: config.host,
      port: config.port,
      secure: false, //! true for 465, false for 587
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    try {
      // ! verify node mailer
      await transporter.verify();
      logger.log('Mail server connected', 'MailProvider');
    } catch (error: any) {
      // ! not verify then show and through error
      logger.error('Mail connection failed', error.message, 'MailProvider');
      throw new Error(`SMTP Connection Failed: ${error.message}`);
    }

    return transporter;
  },
};
