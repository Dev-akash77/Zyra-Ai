# Zyra AI Backend Architecture Documentation

## Overview

Zyra AI backend follows a modular monolith architecture using NestJS.

The system is divided into independent modules such as:

* Auth Module
* Notification Module
* Profile Module
* AI Module

The architecture uses both synchronous and asynchronous communication.

Core business operations are synchronous.
Heavy background operations are asynchronous using RabbitMQ.

This design keeps the API fast, scalable, and production-ready.

---

# Architecture Style

## Current Architecture

The project follows:

* Modular Monolith Architecture
* Layered Architecture
* Event-Driven Communication
* Hexagonal Architecture (for AI module)

---

# Why This Architecture?

## Problem in Traditional Architecture

Without asynchronous communication:

```text
User Register
   ↓
Save User
   ↓
Send Email
   ↓
Generate AI Response
   ↓
Return Response
```

Problems:

* Slow API response
* Server blocking
* Bad user experience
* Heavy CPU usage
* Difficult scaling
* Tight coupling between modules

---

# Solution

The solution is separating:

* Core logic
* Background tasks

Core logic runs synchronously.
Background tasks run asynchronously.

---

# Final Flow

```text
User Request
    ↓
Controller
    ↓
Service
    ├── Core Logic (Sync)
    └── Emit Event (Async)
              ↓
          RabbitMQ Queue
              ↓
          Consumer
              ↓
       Background Processing
```

---

# Synchronous vs Asynchronous

Understanding this is extremely important.

---

# Synchronous Communication

## Definition

The user waits for the operation to complete.

The request-response cycle is immediate.

---

# When to Use Synchronous Communication

Use synchronous communication when:

* User needs instant response
* Operation is lightweight
* Next step depends on result
* Business-critical logic is running

---

# Examples of Synchronous Operations

## Auth Module

### Login

```text
User → Auth → Token Response
```

The user cannot continue without the token.

Therefore login must be synchronous.

---

### Register (Database Save)

```text
User → Auth → Save User → Success Response
```

Saving the user must complete before continuing.

---

### Reset Password Verification

```text
Verify OTP → Update Password
```

This operation must happen immediately.

---

## Profile Module

### Fetch Profile

```text
User → Profile → Return Data
```

---

### Update Profile

```text
User → Update Profile → Return Updated Data
```

---

# Benefits of Synchronous Communication

* Simple logic
* Easier debugging
* Immediate response
* Predictable flow
* Easier validation

---

# Disadvantages of Synchronous Communication

* Blocking operations
* Slower response if task becomes heavy
* Tight coupling
* Difficult horizontal scaling
* API waits for everything

---

# Asynchronous Communication

## Definition

The system performs tasks in the background.

The user does not wait for completion.

---

# When to Use Asynchronous Communication

Use async communication when:

* The operation is heavy
* User does not need instant result
* Retry system is needed
* Background processing is required
* Loose coupling is important

---

# Examples of Asynchronous Operations

## Notification Module

### Welcome Email

```text
User Register
   ↓
Emit Event
   ↓
Background Email Sending
```

The user does not need to wait for email delivery.

---

### OTP Email

```text
Generate OTP
   ↓
Save OTP
   ↓
Emit Event
   ↓
Send Email in Background
```

---

## AI Module

### AI Response Generation

```text
User Prompt
   ↓
Emit AI Request Event
   ↓
AI Worker Processing
   ↓
Save Result
```

AI processing can take time.

Therefore async architecture is ideal.

---

## Analytics and Logging

```text
User Action
   ↓
Emit Analytics Event
   ↓
Background Tracking
```

---

# Benefits of Asynchronous Communication

* Faster API response
* Better scalability
* Loose coupling
* Retry support
* Better fault tolerance
* Background processing
* Better user experience
* Reduced server blocking

---

# Disadvantages of Asynchronous Communication

* More infrastructure complexity
* Harder debugging
* Event ordering issues
* Retry handling needed
* Message queue maintenance
* Event consistency challenges

---

# Why RabbitMQ?

RabbitMQ is used as a message broker.

It acts as a middle layer between modules.

---

# RabbitMQ Flow

```text
Producer
   ↓
RabbitMQ Queue
   ↓
Consumer
```

---

# Producer

A producer emits events.

Example:

```text
Auth Module
```

The auth module emits:

* user_registered
* send_otp

---

# Consumer

Consumers listen for events.

Example:

```text
Notification Module
```

It listens for:

* user_registered
* send_otp

---

# Why RabbitMQ Instead of Direct Service Calls?

## Old Direct Flow

```text
Auth → NotificationService → Email
```

Problems:

* Tight coupling
* Slow response
* Failure affects auth system
* Hard scaling

---

# New Event-Driven Flow

```text
Auth → RabbitMQ → Notification
```

Benefits:

* Loose coupling
* Faster APIs
* Retry capability
* Independent processing
* Better scalability

---

# Module Responsibilities

## Auth Module

### Responsibilities

* Register user
* Login user
* Password reset
* Generate JWT
* Emit events

### Communication Style

* Mostly synchronous
* Emits asynchronous events

### Producer

Auth module acts as a producer.

---

# Notification Module

## Responsibilities

* Send emails
* Send OTP
* Background notifications

### Communication Style

* Asynchronous

### Consumer

Notification module acts as a consumer.

---

# Profile Module

## Responsibilities

* User profile management
* Profile update
* Profile fetch

### Communication Style

* Synchronous

### RabbitMQ Usage

Usually unnecessary.

---

# AI Module

## Responsibilities

* AI processing
* Prompt handling
* AI workflows
* AI generation

### Communication Style

* Mostly asynchronous

### Architecture

Uses Hexagonal Architecture.

---

# Hexagonal Architecture for AI Module

## Why Hexagonal?

AI systems change frequently.

Examples:

* OpenAI
* Claude
* Gemini
* HuggingFace
* Local Models

The architecture must allow provider replacement.

---

# AI Module Structure

```text
AI Module
 ├── Domain
 ├── Application
 ├── Infrastructure
 ├── Adapters
```

---

# Domain Layer

Contains:

* Core business rules
* Interfaces
* Entities

This layer must not depend on external APIs.

---

# Application Layer

Contains:

* Use cases
* Application services
* Workflow logic

---

# Infrastructure Layer

Contains:

* OpenAI adapter
* Gemini adapter
* HuggingFace adapter
* Database access
* Queue consumers

---

# Why Hexagonal Architecture Is Important

Benefits:

* Easy provider replacement
* Testability
* Cleaner code
* Better scalability
* Reduced coupling
* Easier maintenance

---

# Recommended Communication Strategy

## Sync Operations

Use direct service calls for:

* Login
* Register database operations
* Profile fetch
* Profile update
* Password verification
* JWT generation

---

# Async Operations

Use RabbitMQ for:

* Email sending
* OTP sending
* AI processing
* Notifications
* Logging
* Analytics
* Long-running jobs

---

# Important Design Principle

Never make everything asynchronous.

Never make everything synchronous.

Use hybrid architecture.

---

# Correct Hybrid Flow

```text
Auth
 ├── Database Save (Sync)
 └── Email Event (Async)
```

---

# Incorrect Design

```text
Login → RabbitMQ
```

Login should never be asynchronous.

---

# Another Incorrect Design

```text
AI Processing → Sync
```

Heavy AI processing should not block APIs.

---

# RabbitMQ Producer Flow

```text
Service
   ↓
Producer
   ↓
RabbitMQ Queue
```

---

# RabbitMQ Consumer Flow

```text
RabbitMQ Queue
   ↓
Consumer
   ↓
Background Service
```

---

# Queue Acknowledgement

Consumers must acknowledge messages.

## Success

```text
ack()
```

Message removed from queue.

---

## Failure

```text
nack()
```

Message retry possible.

---

# Retry System

If processing fails:

* RabbitMQ can retry
* The system becomes fault tolerant
* Temporary failures become recoverable

---

# Future Improvements

## Planned Improvements

* Redis OTP storage
* Dead letter queue
* Retry queue
* AI worker scaling
* Event analytics
* Distributed tracing
* Queue monitoring
* Multi-queue architecture

---

# Suggested Queue Separation

## Email Queue

```text
email_queue
```

---

# AI Queue

```text
ai_queue
```

---

# Analytics Queue

```text
analytics_queue
```

---

# Why Separate Queues?

Benefits:

* Better scaling
* Independent workers
* Better monitoring
* Isolation of failures
* Easier debugging

---

# Project Flow Summary

## Register Flow

```text
User Register
   ↓
Auth Controller
   ↓
Auth Service
   ├── Validate Data
   ├── Hash Password
   ├── Save User
   └── Emit user_registered Event
              ↓
         RabbitMQ Queue
              ↓
     Notification Consumer
              ↓
      Send Welcome Email
```

---

# Forgot Password Flow

```text
Forgot Password Request
   ↓
Generate OTP
   ↓
Save OTP
   ↓
Emit send_otp Event
   ↓
RabbitMQ Queue
   ↓
Notification Consumer
   ↓
Send OTP Email
```

---

# AI Processing Flow

```text
AI Request
   ↓
AI Controller
   ↓
Emit ai_request Event
   ↓
RabbitMQ Queue
   ↓
AI Worker
   ↓
AI Processing
   ↓
Save Result
```

---

# Final Design Philosophy

The system follows a hybrid architecture:

* Synchronous communication for core logic
* Asynchronous communication for heavy background processing

This provides:

* Better performance
* Scalability
* Cleaner architecture
* Easier maintenance
* Production readiness

---

# Final Conclusion

Zyra AI backend is designed to evolve from:

```text
Modular Monolith
      ↓
Event-Driven Modular System
      ↓
Scalable Distributed Architecture
```

The current architecture prioritizes:

* Clean modularity
* Scalability
* Performance
* Maintainability
* Future AI expansion

This architecture is suitable for:

* SaaS platforms
* AI systems
* Real-time systems
* Event-driven applications
* Production-grade backend systems
