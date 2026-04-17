import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import * as fs from 'fs';

@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;
  private lastTime = Date.now();

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    //! 🔥 NestJS Style Console Format
    const consoleFormat = winston.format.printf((info) => {
      const { level, message, timestamp } = info;
      const msg = String(message);

      const now = Date.now();
      const diff = now - this.lastTime;
      this.lastTime = now;

      const pid = process.pid;

      // ! Colors
      const green = '\x1b[32m';
      const yellow = '\x1b[33m';
      const red = '\x1b[31m';
      const reset = '\x1b[0m';
      const gray = '\x1b[90m';

      const levelMap: Record<string, string> = {
        info: 'LOG',
        warn: 'WARN',
        error: 'ERROR',
        debug: 'DEBUG',
      };

      const levelText = levelMap[level] || level.toUpperCase();

      // !Level color
      const levelColor =
        level === 'error'
          ? red
          : level === 'warn'
          ? yellow
          : green;

      // ! Extract context
      let context = '';
      let actualMessage = msg;

      const match = msg.match(/^\[(.*?)\]\s*(.*)/);
      if (match) {
        context = match[1];
        actualMessage = match[2];
      }

      return (
        `${green}[Nest] ${pid}${reset}  - ${gray}${timestamp}${reset}     ` +
        `${levelColor}${levelText}${reset} ` +
        `${yellow}[${context}]${reset} ` +
        `${green}${actualMessage}${reset} ${gray}+${diff}ms${reset}`
      );
    });

    //! File format (clean)
    const fileFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => {
        const msg = String(info.message);
        return `${info.timestamp} [${info.level.toUpperCase()}] ${msg}`;
      }),
    );

    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.timestamp({
        format: 'DD/MM/YYYY, hh:mm:ss A',
      }),
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),

        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
          format: fileFormat,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  warn(message: string, context?: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  debug(message: string, context?: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  //! Clean Error (short + readable)
  error(message: string, trace?: string, context?: string) {
    let cleanMessage = message;

    //! Smart Redis / connection error formatting
    if (message.includes('ECONNREFUSED')) {
      const match = message.match(/ECONNREFUSED\s([\d.:]+)/);
      if (match) {
        cleanMessage = `Unable to connect (ECONNREFUSED) at ${match[1]}`;
      }
    }

    //! remove long stack
    cleanMessage = cleanMessage.split('\n')[0];

    this.logger.error(this.formatMessage(cleanMessage, context));
  }

  private formatMessage(message: string, context?: string) {
    return context ? `[${context}] ${message}` : message;
  }
}