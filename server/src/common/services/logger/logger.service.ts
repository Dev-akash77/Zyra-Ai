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

    const levelFilter = (level: string) =>
      winston.format((info) => (info.level === level ? info : false))();

    //! Console Format (NestJS Style)
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

      const match = msg.match(/^\[(.*?)\]\s*(.*)/s);
      if (match) {
        context = match[1];
        actualMessage = match[2];
      }

      // Single-line NestJS console style
      return (
        `${green}[Nest] ${pid}${reset}  - ` +
        `${gray}${timestamp}${reset} ` +
        `${levelColor}${levelText}${reset} ` +
        (context ? `${yellow}[${context}]${reset} ` : '') +
        `${green}${actualMessage}${reset} ${gray}+${diff}ms${reset}`
      );
    });

    //! File Format
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
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'DD/MM/YYYY, hh:mm:ss A',
            }),
            consoleFormat,
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'info.log'),
          format: winston.format.combine(levelFilter('info'), fileFormat),
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'warn.log'),
          format: winston.format.combine(levelFilter('warn'), fileFormat),
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          format: winston.format.combine(levelFilter('error'), fileFormat),
        }),
      ],
    });

    this.logger.info('[Logger] Logger initialized');
  }

  log(message: any, context?: string) {
    this.logger.info(this.formatMessage(this.resolveMessage(message), context));
  }

  warn(message: any, context?: string) {
    this.logger.warn(this.formatMessage(this.resolveMessage(message), context));
  }

  debug(message: any, context?: string) {
    this.logger.debug(this.formatMessage(this.resolveMessage(message), context));
  }

  //! Error (handles Error instances, objects, and strings)
  error(message: any, trace?: string, context?: string) {
    let cleanMessage = this.resolveMessage(message);

    // Handle Redis / network ECONNREFUSED
    if (cleanMessage.includes('ECONNREFUSED')) {
      const match = cleanMessage.match(/ECONNREFUSED\s([\d.:]+)/);
      if (match) {
        cleanMessage = `Unable to connect (ECONNREFUSED) at ${match[1]}`;
      }
    }

    // Strip multiline stack trace from the single-line summary if present
    cleanMessage = cleanMessage.split('\n')[0];

    // If context was passed in trace parameter (common NestJS signature: error(msg, context))
    const resolvedContext = context ?? (typeof trace === 'string' && !trace.includes('\n') ? trace : undefined);

    this.logger.error(this.formatMessage(cleanMessage, resolvedContext));
  }

  /**
   * Safely converts strings, Error objects, or JSON objects into a string
   */
  private resolveMessage(message: any): string {
    if (message instanceof Error) {
      return message.message || message.name || 'Unknown Error';
    }
    if (typeof message === 'object' && message !== null) {
      try {
        return JSON.stringify(message);
      } catch {
        return '[Unserializable Object]';
      }
    }
    return String(message ?? '');
  }

  private formatMessage(message: string, context?: string): string {
    return context ? `[${context}] ${message}` : message;   
  }
} 

