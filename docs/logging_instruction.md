# Logging System Documentation

## 1. Overview

This project uses a centralized logging system built with Winston.
The logger is designed to provide:

* Structured and readable console output (NestJS-style)
* Automatic daily log file generation
* Separation of logs by level (success, warning, error)
* Global availability across the application

The logger is implemented as a global service and can be used in any module without additional configuration.

---

## 2. Log Storage Structure

All logs are stored inside the `logs/` directory at the root of the server.

```
server/
└── logs/
    ├── success-YYYY-MM-DD.log
    ├── error-YYYY-MM-DD.log
    └── warning-YYYY-MM-DD.log
```

Key points:

* Log files are created automatically when the application starts
* A new file is generated each day
* Logs are separated by type for easier debugging and monitoring

---

## 3. Using the Logger

### 3.1 Injecting the Logger

Inject the logger service into any class via the constructor:

```ts
import { MyLoggerService } from 'src/common/services/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: MyLoggerService) {}
}
```

---

### 3.2 Logging Methods

Use the following methods based on the situation:

```ts
// Success / informational logs
this.logger.log('Operation completed successfully', 'ContextName');

// Warning logs
this.logger.warn('Unexpected but handled scenario', 'ContextName');

// Error logs
this.logger.error('Operation failed due to error', undefined, 'ContextName');
```

---

## 4. Context Usage

The second (or third in error) parameter is the **context**, which helps identify the source of the log.

Example:

```ts
this.logger.log('User created successfully', 'AuthService');
```

Output:

```
[Nest] 25080  - time     LOG [AuthService] User created successfully +1ms
```

Best practice:

* Always provide a meaningful context (e.g., service name)
* Avoid generic values like "logger" or "service"

---

## 5. Example Implementation

```ts
@Injectable()
export class AuthService {
  constructor(private readonly logger: MyLoggerService) {}

  async register(dto: RegisterDto) {
    try {
      // business logic
      this.logger.log(`User registered: ${dto.email}`, 'AuthService');
    } catch (error) {
      this.logger.error(
        `Register failed: ${error.message}`,
        undefined,
        'AuthService',
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      // business logic
      this.logger.log(`User logged in: ${dto.email}`, 'AuthService');
    } catch (error) {
      this.logger.error(
        `Login failed: ${error.message}`,
        undefined,
        'AuthService',
      );
    }
  }
}
```

---

## 6. Log Level Guidelines

| Method           | Usage Scenario                       | Output File            |
| ---------------- | ------------------------------------ | ---------------------- |
| `logger.log()`   | Successful operations                | success-YYYY-MM-DD.log |
| `logger.warn()`  | Recoverable or suspicious conditions | warning-YYYY-MM-DD.log |
| `logger.error()` | Failures, exceptions, system errors  | error-YYYY-MM-DD.log   |

---

## 7. Error Logging Best Practices

* Log only the meaningful error message (avoid full stack traces unless required)
* Keep logs short and readable
* Prefer structured messages

Example:

```ts
this.logger.error('Unable to connect to Redis', undefined, 'RedisService');
```

Avoid:

```ts
this.logger.error(error.stack);
```

---

## 8. Global Availability

The logger is registered as a global provider.

Implications:

* No need to import any logger module in feature modules
* Direct injection is sufficient
* Ensures consistency across the application

---

## 9. Console Output Format

Console logs follow a structured format:

```
[Nest] PID  - timestamp     LEVEL [Context] message +Xms
```

Example:

```
[Nest] 25080  - 17/04/2026, 11:31:27 PM     LOG [AuthService] User logged in +2ms
```

---

## 10. Recommendations

* Always include context
* Keep messages concise and meaningful
* Do not log sensitive information (passwords, tokens, etc.)
* Use appropriate log levels consistently

---

## 11. Summary

This logging system ensures:

* Consistent logging across services
* Easy debugging and monitoring
* Clean and readable output
* Scalable logging for production systems

All developers are expected to follow the defined logging practices to maintain consistency across the codebase.
