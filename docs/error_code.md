# 🚨 Error Codes Documentation

This document defines all standardized error codes used in the backend system.

All API errors follow a consistent response structure.

---

# 📦 Standard Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "timestamp": "2026-02-22T10:00:00.000Z",
  "path": "/api/auth/login"
}
```

 Frontend must rely on `errorCode`, not `message`.

---

# Error Categories

---

## 1️ System Errors (500)

| Error Code | HTTP Status | Description | When to Use |
|------------|------------|-------------|-------------|
| INTERNAL_ERROR | 500 | Unexpected server error | Fallback error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable | External dependency failure |
| DATABASE_ERROR | 500 | Database operation failed | Query crash |
| DATABASE_CONNECTION_FAILED | 500 | DB connection failure | DB down |

---

## 2 Validation Errors (400)

| Error Code | HTTP Status | Description |
|------------|------------|-------------|
| VALIDATION_ERROR | 400 | DTO validation failed |
| INVALID_INPUT | 400 | Invalid data format |

Use when request body, params, or query validation fails.

---

## 3 Authentication Errors (401)

| Error Code | HTTP Status | Description |
|------------|------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| TOKEN_EXPIRED | 401 | JWT token expired |
| TOKEN_INVALID | 401 | JWT token invalid |

---

## 4 Authorization Errors (403)

| Error Code | HTTP Status | Description |
|------------|------------|-------------|
| FORBIDDEN | 403 | Access denied |
| INSUFFICIENT_PERMISSIONS | 403 | User role not allowed |

---

## 5️ Resource Errors (404)

| Error Code | HTTP Status | Description |
|------------|------------|-------------|
| NOT_FOUND | 404 | Resource not found |
| USER_NOT_FOUND | 404 | User does not exist |

---

## 6️ Conflict Errors (409)

| Error Code | HTTP Status | Description |
|------------|------------|-------------|
| CONFLICT | 409 | Generic conflict |
| EMAIL_ALREADY_EXISTS | 409 | Duplicate email |

---

# Error Handling Rules

##  Backend Rules

- Always throw `AppException`
- Always include `errorCode`
- Never expose internal stack traces in production

## Frontend Rules

- Do NOT depend on error `message`
- Always use `errorCode` for conditional logic

Example:

```ts
if (errorCode === 'TOKEN_EXPIRED') {
  redirectToLogin();
}
```

---

#  Architecture Flow

Controller  
→ Service  
→ throw AppException  
→ GlobalExceptionFilter  
→ Standard JSON Response  

---

#  Production Notes

- In development: stack trace can be logged.
- In production: never expose stack trace to client.
- Log all INTERNAL_ERROR cases.

---

# Future Extension

- Add error ID for tracing
- Integrate with logging service (Winston / Pino)
- Integrate with monitoring (Sentry)
- Microservice-friendly error format

---

# Version

Error System Version: 1.0.0  
Last Updated: 2026-02-22