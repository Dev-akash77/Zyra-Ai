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

    // ! Create logs folder if not exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    //!  Level Filter (STRICT separation)
    const levelFilter = (level: string) =>
      winston.format((info) => {
        return info.level === level ? info : false;
      })();

    //!  Console Format (NestJS Style)
    const consoleFormat = winston.format.printf((info) => {
      const { level, message, timestamp } = info;
      const msg = String(message);

      const now = Date.now();
      const diff = now - this.lastTime;
      this.lastTime = now;

      const pid = process.pid;

      // Colors
      const green = '\x1b[32m';
      const yellow = '\x1b[33m';
      const red = '\x1b[31m';
      const gray = '\x1b[90m';
      const reset = '\x1b[0m';

      const levelMap: Record<string, string> = {
        info: 'LOG',
        warn: 'WARN',
        error: 'ERROR',
        debug: 'DEBUG',
      };

      const levelText = levelMap[level] || level.toUpperCase();

      const levelColor =
        level === 'error' ? red : level === 'warn' ? yellow : green;

      // Extract context
      let context = '';
      let actualMessage = msg;

      const match = msg.match(/^\[(.*?)\]\s*(.*)/);
      if (match) {
        context = match[1];
        actualMessage = match[2];
      }

      return (
        `${green}[Nest] ${pid}${reset} - ${gray}${timestamp}${reset} ` +
        `${levelColor}${levelText}${reset} ` +
        `${yellow}[${context}]${reset} ` +
        `${green}${actualMessage}${reset} ${gray}+${diff}ms${reset}`
      );
    });

    //!  File Format
    const fileFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => {
        const msg = String(info.message);
        return `${info.timestamp} [${info.level.toUpperCase()}] ${msg}`;
      }),
    );

    //!  Logger Setup
    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        // !Console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'DD/MM/YYYY, hh:mm:ss A',
            }),
            consoleFormat,
          ),
        }),

        // ! ONLY INFO
        new winston.transports.File({
          filename: path.join(logDir, 'info.log'),
          format: winston.format.combine(levelFilter('info'), fileFormat),
        }),

        //! ONLY WARN
        new winston.transports.File({
          filename: path.join(logDir, 'warn.log'),
          format: winston.format.combine(levelFilter('warn'), fileFormat),
        }),

        // !ONLY ERROR
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          format: winston.format.combine(levelFilter('error'), fileFormat),
        }),
      ],
    });

    // ! Test log (optional)
    this.logger.info('[Logger] Logger initialized');
  }

  //! Info
  log(message: string, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  //! Warn
  warn(message: string, context?: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  //! Debug
  debug(message: string, context?: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  //! Error (cleaned)
  error(message: string, trace?: string, context?: string) {
    let cleanMessage = message;

    //! Handle Redis errors nicely
    if (message.includes('ECONNREFUSED')) {
      const match = message.match(/ECONNREFUSED\s([\d.:]+)/);
      if (match) {
        cleanMessage = `Unable to connect (ECONNREFUSED) at ${match[1]}`;
      }
    }

    //! Remove stack noise
    cleanMessage = cleanMessage.split('\n')[0];

    this.logger.error(this.formatMessage(cleanMessage, context));
  }

  //! Format message with context
  private formatMessage(message: string, context?: string) {
    return context ? `[${context}] ${message}` : message;
  }
}
