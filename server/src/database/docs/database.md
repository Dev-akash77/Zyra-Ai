# 🗄 Database Documentation

## Overview

This backend uses **PostgreSQL (Neon Cloud)** as the primary database and **Drizzle ORM** for type-safe SQL queries.

The database is configured as a **Global Module in NestJS**, making it accessible across all modules using dependency injection.

---

# Architecture

## Database Stack

- PostgreSQL (Neon)
- `pg` (node-postgres driver)
- Drizzle ORM
- NestJS Global Module
- Injection Token Pattern

## Connection Flow

1. `.env` or `.env.example` provides `DATABASE_URL`
2. `connect.ts` creates PostgreSQL connection pool
3. Drizzle wraps the pool
4. Database instance is exported via `DatabaseModule`
5. Services inject database using injection token

---

# 📂 Folder Structure

```
src/
└── database/
├── connect.ts
├── database.module.ts
├── schema.ts
└── common/constants/
└── injection.token.ts
```

---

# Environment Configuration

## Required Environment Variable

```
DATABASE_URL = postgresql://username:password@host/dbname?sslmode=require
```

### Notes

- Stored inside `.env`
- `.env` must be added to `.gitignore`
- Never commit credentials to GitHub

---

# Database Connection Implementation

## connect.ts

```ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const connectDatabase = (database_url: string) => {
  try {
    const pool = new Pool({
      connectionString: database_url,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log(`POSTGRE Connected`);
    return drizzle(pool, { schema });
  } catch (error) {
    console.log(`POSTGRE SQL database connection failled ${error}`);
  }
};
```

# Migrations

## Drizzle is used for schema management.

### Generate Migration

```
npm run db:generate
```

---

### Push Schema to Database

```
npm run db:push
```

---

# Rules

- Always generate migration after schema changes
- Never modify production database manually
- Keep schema file updated

---

# Verifying Database Connection

## Run:

```
npm run start:dev
```

## Expected output:

```
[Nest] 39760  - 21/02/2026, 12:15:20 am     LOG [NestFactory] Starting Nest application...
[Nest] 39760  - 21/02/2026, 12:15:20 am     LOG [InstanceLoader] ConfigHostModule dependencies initialized +12ms

POSTGRE Connected

```
