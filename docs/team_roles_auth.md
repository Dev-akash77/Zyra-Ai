# Team Roles & Responsibilities

**Project Name:** Zyra  
**Module:** Authentication System  
**Architecture:** Next.js + NestJS + PostgreSQL (Drizzle ORM)

---

## 👤 1. Srishti Saha  
**Role:** Frontend & DTO Handling

### Responsibilities

- Create and manage DTO for:
  - Register
  - Login

- Ensure proper validation rules are defined.

### Register DTO Must Include

- name (string)
- email (string)
- password (string)
- confirmPassword (must match password)

Validation Rules:
- All fields are required
- Email must be valid
- Password must be strong
- Confirm password must match password

### Login DTO Must Include

- email (string)
- password (string)

Validation Rules:
- Both fields required
- Email format must be valid

---

## 👤 2. Surya Majhi  
**Role:** Backend Registration & Database Logic

### Responsibilities

- Handle full registration logic
- Check validation before inserting into database
- Ensure email uniqueness
- Insert data into Register table
- Automatically create Profile record after successful registration
- Ensure correct linking between Register and Profile tables

---

### Registration Flow

1. Validate input data
2. Check if email already exists
3. Insert new user into Register table
4. Get generated Register ID
5. Create Profile record using that Register ID
6. Ensure foreign key relation is correct

---

### Important Rules

- Register ID must auto-generate
- Profile must be created only after successful registration
- registerId in Profile must correctly reference Register.id
- No hardcoded values
- Proper error handling must be followed

---

## 👤 3. Akash Biswas  
**Role:** Team Lead, Login Logic & JWT Implementation

### Responsibilities

- Implement complete login functionality
- Verify email exists
- Compare password securely
- Generate JWT token after successful login
- Handle authentication architecture
- Implement authorization structure
- Manage global exception filter
- Manage global response interceptor
- Ensure no hardcoded error or response format
- Centralize error handling in NestJS

---

### Login Flow

1. Validate login DTO
2. Check if user exists
3. Compare password securely
4. Generate JWT token
5. Return structured response

---

### JWT Responsibilities

- Configure JWT module
- Create token with user ID and role
- Set expiration time
- Secure secret handling
- Prepare structure for future role-based authorization

---

### Architecture Principles

- No business logic inside controller
- All logic inside service layer
- Centralized error handling
- Centralized success response formatting
- Clean and scalable structure
- Production-ready authentication system

---

# Final Notes

- Each member must follow defined responsibility.
- No overlapping logic.
- Clean Git commits must be maintained.
- All features must follow architecture guidelines.