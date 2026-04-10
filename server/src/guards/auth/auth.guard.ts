import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // get the user request
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    return authHeader === 'Bearer my-secret-token'; // just for test -> we need a actual 
  }
}
