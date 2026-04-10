import { Injectable, LoggerService } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import * as fs from 'fs';
import 'winston-daily-rotate-file';

@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;  
  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      transports: [

        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'warning-%DATE%.log'),
          level: 'warn',           
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ message, timestamp }) => {  
              return `${timestamp} warning: ${message}`;
            }),
          ),
        }),

        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ message, timestamp }) => {  
              return `${timestamp} error: ${message}`;
            }),
          ),
        }),

        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'success-%DATE%.log'),
          level: 'info',          
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ message, timestamp }) => {  
              return `${timestamp} success: ${message}`;
            }),
          ),
        }),

      ],
    });
  }

  log(message: string) {         
    this.logger.info(message);
  }

  error(message: string) {       
    this.logger.error(message);
  }

  warn(message: string) {        
    this.logger.warn(message);
  }
}