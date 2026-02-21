# Team Roles & Responsibilities

**Project Name:** Zyra  
**Project Role:** Authentication System  
**Architecture:** Next.js (Frontend) + NestJS (Backend) + PostgreSQL (Drizzle ORM)

---

## 👤 1. Srishti Saha  
**Role:** Frontend Developer  

### Responsibilities
- Build Registration Page
- Build Login Page
- Implement form validation using Zod
- Use Next.js App Router
- Connect frontend with backend API
- Ensure proper validation and clean UI

---

### Registration Page – Required Fields

Mandatory fields in registration form:

- name (string)
- email (string)
- password (string)
- confirm password (must match password)

Backend Data Structure:
```typescript
Register {
  id: integer (primary key)
  name: string
  email: string
  password: string
  role: ["user", "admin"]
  otp: string
  number: integer
  updated_at: timestamp
}
```
---

Validation Rules:
- Email must be valid format
- Password must be strong
- Confirm password must match password
- All fields are required

---

### Login Page – Required Fields

- email
- password

Validation must be implemented using Zod.

---

### Key Technologies
- Next.js (App Router)
- Zod Validation
- API Integration (Fetch/Axios)

---

### Resources
Database Model:  
https://app.eraser.io/workspace/kVkJO1PSbS0KxZguvX0w  

---

---

## 👤 2. Surya Majhi  
**Role:** Backend Developer (Database & Schema Design)

### Responsibilities
- Create database schema using Drizzle ORM
- Create Register table
- Create Profile table
- Ensure proper foreign key linking
- Ensure each table auto-generates its own ID
- Perform migration and push schema

---

### Required Database Tables

#### Register Table

```typescript
Register {
  id: integer (primary key)
  name: string
  email: string
  password: string
  role: ["user", "admin"]
  otp: string
  number: integer
  updated_at: timestamp
}
```

---

#### Profile Table

```typescript
Profile {
  id: integer (primary key)
  registerId: integer (foreign key -> Register.id)
  name: string
  avatar_url: string
  bio: string
  email: string
  verified: boolean
  suspend: boolean
  gender: ["male", "female", "other"]
  updated_at: timestamp
}
```

---

### Important Requirements

- registerId must link properly to Register.id
- Each table must auto-generate unique ID
- Foreign key must be enforced
- Migration must be completed before testing

---

### Migration Commands

```bash
npm run drizzle:generate
npm run drizzle:push
```

## Resources

DB Model:
https://app.eraser.io/workspace/kVkJO1PSbS0KxZguvX0w

Example Schema Code:
https://github.com/Dev-akash77/snipetvault/blob/main/backend/src/database/schema.ts

---
## 👤 3. Akash Biswas  
**Role:** Team Lead & Backend Architecture Engineer

## Responsibilities

- Design complete backend architecture

- Implement authentication logic

- Implement authorization logic

- Create global exception filter

- Create global response interceptor

- Centralize error handling

- Centralize response formatting

- Maintain production-ready code

- Manage Git workflow

- Final technical decision maker

---

## Global Error Response Format

``` JSON
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400,
  "timestamp": "ISO Date"
}
```
## Global Success Response Format

``` JSON
{
  "success": true,
  "message": "Success message here",
  "data": {},
  "timestamp": "ISO Date"
}
```
---
## Architecture Rules

- No hardcoded responses inside controllers

- No repeated try-catch blocks

- All errors handled in global filter

- All success responses formatted in interceptor

- Clean and scalable NestJS structure

---

## Final Notes

- Follow clean code principles

- Maintain proper Git commit messages

- Do not modify database directly without migration

- Follow defined schema strictly

- Every member is responsible for writing readable code