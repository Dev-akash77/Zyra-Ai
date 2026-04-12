# Logger Documentation

## Overview
This project uses **Winston** logger that automatically creates
log files every day.

---

## Log Files Location
```
server/
└── logs/
    ├── success-YYYY-MM-DD.log   ✅ success logs
    ├── error-YYYY-MM-DD.log     ❌ error logs
    └── warning-YYYY-MM-DD.log   ⚠️ warning logs
```
> `logs/` folder is **automatically created** when app starts.

---

## How to Use

### Step 1 — Inject in Constructor
```typescript
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class YourService {
  constructor(private logger: MyLoggerService) {}
}
```

### Step 2 — Use in Your Methods
```typescript
// ✅ Success
this.logger.log('your message');

// ❌ Error
this.logger.error('your message');

// ⚠️ Warning
this.logger.warn('your message');
```

---

## Real Example
```typescript
@Injectable()
export class AuthService {
  constructor(private logger: MyLoggerService) {}

  async register(dto: RegisterDto) {
    try {
      // your logic...
      this.logger.log(`User registered: ${dto.email}`);
    } catch (error) {
      this.logger.error(`Register failed: ${error.message}`);
    }
  }

  async login(dto: LoginDto) {
    try {
      // your logic...
      this.logger.log(`User logged in: ${dto.email}`);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
    }
  }
}
```

---

## When to Use What

| Method | When | File |
|---|---|---|
| `this.logger.log()` | Operation succeeded | `success.log` |
| `this.logger.error()` | Exception or failure | `error.log` |
| `this.logger.warn()` | Suspicious activity | `warning.log` |

---

## Note
- No need to import `LoggerModule` in every module
- Logger is **globally available** — just inject in constructor
- New log file created **every day** automatically