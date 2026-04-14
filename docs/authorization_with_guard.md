# 🔐 Authentication & Role Guard Documentation

## Overview

This project uses **JWT Authentication + Role-Based Guard (RBAC)**
to protect routes like **profile** and **admin**.

* JWT is used to authenticate users
* Guards are used to protect routes
* Roles are used to restrict access (e.g., admin only)

---

## 🔁 Authentication Flow

```
Client Request
   ↓
JwtAuthGuard (verify token)
   ↓
JwtStrategy.validate()
   ↓
req.user created
   ↓
RoleGuard (check role)
   ↓
Access Granted / Denied
```

---

## 📁 Protected Routes

```
auth/
├── /profile   ✅ Logged-in users only
└── /admin     🔐 Admin only
```

---

## How to Use

### Step 1 — Login and Get Token

```http
POST /auth/login
```

Response:

```json
{
  "access_token": "your_jwt_token"
}
```

---

### Step 2 — Call Protected Route

```http
GET /auth/profile
```

### Add Header:

```http
Authorization: Bearer YOUR_TOKEN
```

---

## 👤 Profile Route (Authenticated)

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Req() req) {
  return req.user;
}
```

### ✅ Access:

* Any valid logged-in user

### 📤 Response:

```json
{
  "userId": 1,
  "email": "test@gmail.com",
  "role": "user"
}
```

---

## 🔐 Admin Route (Role Protected)

```typescript
@Get('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
createUser() {
  return 'Admin';
}
```

### ✅ Access:

* Only users with role = `admin`

---

## 🧩 Custom Roles Decorator

```typescript
export const Roles = (...roles: string[]) =>
  SetMetadata('roles', roles);
```

👉 Stores required roles as metadata

---

## 🛡️ RoleGuard

```typescript
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
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

👉 This guard:

* Reads roles from metadata
* Compares with `req.user.role`

---

## 🔑 JwtAuthGuard

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

👉 This guard:

* Extracts token from header
* Verifies token
* Calls `validate()`

---

## ⚙️ JwtStrategy

```typescript
async validate(payload: JwtPayload) {
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
```

👉 This:

* Receives decoded token
* Returns user → stored in `req.user`

---

## 📊 Expected Results

| Case                         | Result           |
| ---------------------------- | ---------------- |
| ✅ Valid token + correct role | Access granted   |
| ❌ Valid token + wrong role   | 403 Forbidden    |
| ❌ No token                   | 401 Unauthorized |
| ❌ Invalid token              | 401 Unauthorized |

---

## ⚠️ Important Notes

* `req.user` comes from `validate()` method
* `SetMetadata` only stores data — Guard reads it
* Guard order is important:

```typescript
@UseGuards(JwtAuthGuard, RoleGuard) ✅
```

---

## 🧠 When to Use What

| Feature      | Purpose                 |
| ------------ | ----------------------- |
| JwtAuthGuard | Authenticate user       |
| JwtStrategy  | Extract user from token |
| validate()   | Define `req.user`       |
| RoleGuard    | Check user role         |
| @Roles()     | Define access rules     |

---

## 🚀 Summary

* JWT ensures authentication
* Guards protect routes
* Roles restrict access
* Clean and scalable structure for backend systems

---
