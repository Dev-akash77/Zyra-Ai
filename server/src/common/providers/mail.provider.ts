import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { injection_token } from '../constants/injection.token';
import { MyLoggerService } from '../services/logger/logger.service';
import { MailConfigTypes } from '../types/mail.types';

export const MailProvider: Provider = {
  provide: injection_token.NODEMAILER_CONNECTION,
  inject: [ConfigService, MyLoggerService],

  useFactory: (
    configService: ConfigService,
    logger: MyLoggerService,
  ) => {
    const config = configService.get<MailConfigTypes>('mail');

    if (!config) {
      logger.error('Mail config missing', '', 'Mail');
      throw new Error('Mail config missing');
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false, // true for 465, false for 587
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    logger.log('Mail configured successfully', 'Mail');

    return transporter;
  },
};