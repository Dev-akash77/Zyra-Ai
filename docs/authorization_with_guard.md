# Authentication and Authorization (JWT + RBAC)

## 1. Overview

This application implements a secure authentication and authorization system using:

* JSON Web Tokens (JWT) for authentication
* Guards for route protection
* Role-Based Access Control (RBAC) for authorization

The system ensures that:

* Only authenticated users can access protected routes
* Access to specific resources is restricted based on user roles

---

## 2. Authentication Flow

```id="flow-auth"
Client Request
   ↓
JwtAuthGuard (token validation)
   ↓
JwtStrategy.validate()
   ↓
User object attached to request (req.user)
   ↓
RoleGuard (role validation, if applied)
   ↓
Access Granted / Denied
```

---

## 3. Protected Endpoints

```id="routes-auth"
auth/
├── /profile   (authenticated users)
└── /admin     (admin role only)
```

---

## 4. Usage

### 4.1 Login and Retrieve Token

```http
POST /auth/login
```

Response:

```json
{
  "access_token": "jwt_token"
}
```

---

### 4.2 Access Protected Routes

Example request:

```http
GET /auth/profile
```

Required header:

```http
Authorization: Bearer <access_token>
```

---

## 5. Authenticated Route Example

```ts id="profile-route"
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Req() req) {
  return req.user;
}
```

Access:

* Any authenticated user

Response:

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "user"
}
```

---

## 6. Role-Protected Route Example

```ts id="admin-route"
@Get('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
getAdminResource() {
  return 'Admin resource';
}
```

Access:

* Only users with role = `admin`

---

## 7. Roles Decorator

```ts id="roles-decorator"
export const Roles = (...roles: string[]) =>
  SetMetadata('roles', roles);
```

Purpose:

* Attaches required roles metadata to route handlers
* Used later by the RoleGuard for validation

---

## 8. RoleGuard Implementation

```ts id="role-guard"
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.includes(user.role);
  }
}
```

Responsibilities:

* Reads roles metadata
* Compares with `req.user.role`
* Grants or denies access

---

## 9. JwtAuthGuard

```ts id="jwt-guard"
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Responsibilities:

* Extracts JWT from Authorization header
* Validates token
* Triggers strategy validation

---

## 10. JwtStrategy

```ts id="jwt-strategy"
async validate(payload: JwtPayload) {
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
```

Responsibilities:

* Receives decoded token payload
* Returns user object
* Attaches user to `req.user`

---

## 11. Expected Behavior

| Scenario                       | Result           |
| ------------------------------ | ---------------- |
| Valid token and correct role   | Access granted   |
| Valid token but incorrect role | 403 Forbidden    |
| Missing token                  | 401 Unauthorized |
| Invalid or expired token       | 401 Unauthorized |

---

## 12. Important Notes

* `req.user` is populated from the `validate()` method
* `SetMetadata` only defines metadata; it does not enforce logic
* Guard execution order is critical:

```ts id="guard-order"
@UseGuards(JwtAuthGuard, RoleGuard)
```

* Authentication must always run before authorization

---

## 13. When to Use Each Component

| Component    | Responsibility                       |
| ------------ | ------------------------------------ |
| JwtAuthGuard | Authenticate requests                |
| JwtStrategy  | Extract and validate user from token |
| validate()   | Define structure of `req.user`       |
| RoleGuard    | Enforce role-based access control    |
| @Roles()     | Declare required roles for a route   |

---

## 14. Best Practices

* Always protect sensitive routes with guards
* Use role-based restrictions for admin or privileged actions
* Avoid exposing sensitive data in JWT payloads
* Keep token payload minimal and secure
* Maintain consistent role naming across the system

---

## 15. Summary

This authentication system provides:

* Secure user authentication using JWT
* Scalable authorization using role-based guards
* Clean separation of concerns between authentication and authorization

All developers should follow this structure to ensure consistency, maintainability, and security across the application.
