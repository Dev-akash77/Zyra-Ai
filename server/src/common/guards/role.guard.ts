import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../enums/error.code';
import { ROLES_KEY } from '../decorators/Roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //! if there is nore role required then simply passed
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new AppException(
        'Access denied',
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      );
    }

    if (!requiredRole.includes(user.role)) {
      throw new AppException(
        'Access denied',
        HttpStatus.FORBIDDEN,
        ErrorCode.ACCESS_DENIED,
      );
    }
    return true;
  }
}
