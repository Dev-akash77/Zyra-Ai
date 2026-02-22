import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../enums/error.code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('SERVER ERROR:', exception);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // ! based on the coustom app exception
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let message = 'Internal Server Error';
    let errors = [];

    // ! if there is no internal server error
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      errorCode = res.errorCode || errorCode;
      message = res.message || message;
      errors = res.errors || [];
    }

    // ! the formated final error message
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
