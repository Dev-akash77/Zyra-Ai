import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error.code';
import { MyLoggerService } from '../../modules/logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: MyLoggerService, // 👈 inject logger
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // ! default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let message = 'Internal Server Error';
    let errors = [];

    // ! handle known http exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res: any = exception.getResponse();

      errorCode = res.errorCode || errorCode;
      message = res.message || message;
      errors = res.errors || [];
    }

    // 🔥 LOG ERROR USING LOGGER (IMPORTANT)
    this.logger.error(
      `${request.method} ${request.url} - ${message}`,
      exception?.stack,
      'GlobalExceptionFilter',
    );

    // ! send response
    response.status(status).json({
      message,
      errorCode,
      errors,
      success: false,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
