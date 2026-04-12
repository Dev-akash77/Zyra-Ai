import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import * as fs from 'fs';

@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Custom color function
    const colorizeByLevel = (level: string, message: string) => {
      const colors: Record<string, string> = {
        info: '\x1b[32m', // green
        warn: '\x1b[33m', // yellow
        error: '\x1b[31m', // red
      };

      const reset = '\x1b[0m';
      return `${colors[level] || ''}${message}${reset}`;
    };

    // Console format (FULL LINE COLOR)
    const consoleFormat = winston.format.printf(
      ({ level, message, timestamp }) => {
        const log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        return colorizeByLevel(level, log);
      },
    );

    // File format (no color)
    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.timestamp({ format: 'HH:mm:ss' }),
      transports: [
        // Console (full colored)
        new winston.transports.Console({
          format: consoleFormat,
        }),

        // Files (clean logs)
        new winston.transports.File({
          filename: path.join(logDir, 'info.log'),
          level: 'info',
          format: fileFormat,
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'warn.log'),
          level: 'warn',
          format: fileFormat,
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

  error(message: string, trace?: string, context?: string) {
    this.logger.error(this.formatMessage(`${message} ${trace ?? ''}`, context));
  }

  warn(message: string, context?: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  private formatMessage(message: string, context?: string) {
    return context ? `[${context}] ${message}` : message;
  }
}
