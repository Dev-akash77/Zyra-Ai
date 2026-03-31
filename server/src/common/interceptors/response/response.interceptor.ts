import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SUCCESS_MESSAGE_KEY } from '../../decorators/success-message.decorators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const controller = context.getClass();
    const request = context.switchToHttp().getRequest();

    const message =
      this.reflector.get<String>(SUCCESS_MESSAGE_KEY, handler) ||
      this.reflector.get<String>(SUCCESS_MESSAGE_KEY, controller) ||
      'Request successfull';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        data: data ?? null,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
