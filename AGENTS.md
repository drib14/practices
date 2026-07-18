# AGENTS.md

# Secure Authentication System Rules
Version: 1.0.0

---

# IMPORTANT

Before generating ANY code:

1. ALWAYS read this file completely.
2. Never ignore any security requirement.
3. If this file conflicts with previous conversation, THIS FILE WINS.
4. Every modification must follow these rules.
5. Never remove security features without explicit instruction.
6. Every update to the project MUST also update the Version History section.
7. Every generated file must comply with this document.
8. AI must assume this project will eventually become production software.
9. Never prioritize convenience over security.

---

# Project Goal

Build a production-ready authentication system.

Priority:

Security
↓

Reliability
↓

Maintainability
↓

Performance
↓

Developer Experience

---

# Authentication Requirements

Supported authentication:

- Email + Password
- Google OAuth (future)
- GitHub OAuth (future)
- Magic Link (future)
- Multi-factor Authentication (future)

Password authentication must be implemented first.

---

# Password Rules

Minimum length: 8

Must contain:

- Uppercase
- Lowercase
- Number
- Special Character

Never allow:

- Common passwords
- Dictionary passwords
- User email inside password
- Sequential passwords

Reject weak passwords.

---

# Password Storage

NEVER

- SHA256
- MD5
- Base64
- Encrypt passwords

ONLY

Argon2id

Fallback

bcrypt (12+ rounds)

Passwords must NEVER be reversible.

---

# Session Security

Use:

HTTP Only Cookies

Secure Cookies

SameSite=Lax or Strict

Rotate refresh tokens.

Access token expiration:

15 minutes

Refresh token:

7 days

Revoke compromised sessions.

Support logout from:

- current device
- all devices

---

# JWT Rules

Never store JWT inside:

- localStorage
- sessionStorage

Always verify:

- expiration
- signature
- issuer
- audience

Use strong secret.

Minimum:

256-bit.

---

# CSRF Protection

Required.

Use:

- CSRF Tokens
OR
- SameSite Cookies

Never disable CSRF.

---

# XSS Protection

Sanitize all inputs.

Escape outputs.

Use CSP headers.

Never trust:

- form inputs
- URL params
- query strings
- cookies

---

# SQL Injection

Always use:

Parameterized queries.

Never concatenate SQL.

If ORM:

Never use raw queries unless necessary.

---

# NoSQL Injection

Validate every object.

Whitelist fields.

Never directly pass request body to database.

---

# Rate Limiting

Required.

Login:

5 attempts

per 15 minutes

Registration:

3

per hour

Forgot Password:

3

per hour

OTP:

5

per hour

Global API:

100 requests

per minute

Per IP.

---

# Brute Force Protection

Lock account after:

10 failed attempts.

Temporary lock:

30 minutes.

Alert user by email.

---

# Enumeration Protection

Never reveal:

- email exists
- account exists

Use generic messages.

Example:

Invalid credentials.

NOT

Email not found.

---

# Input Validation

Validate:

- type
- length
- format
- whitelist

Reject unexpected fields.

Never trust frontend validation.

---

# Email Verification

Required.

Account cannot login until verified.

Verification token:

expires in 24 hours.

---

# Password Reset

Single-use token.

Expires in:

30 minutes.

Invalidate old reset tokens.

---

# Logging

Log:

- login success
- failed login
- password reset
- email verification
- suspicious activity
- token refresh
- logout

Never log:

- passwords
- JWT
- secrets
- cookies

---

# Secrets

Store only in:

Environment variables.

Never hardcode:

API Keys

JWT Secret

Database URL

OAuth Secret

Encryption Keys

---

# HTTPS

Production:

HTTPS ONLY.

Force HTTPS redirects.

Enable HSTS.

---

# Headers

Always enable:

Content-Security-Policy

Strict-Transport-Security

Referrer-Policy

Permissions-Policy

X-Content-Type-Options

X-Frame-Options

Cross-Origin-Resource-Policy

Cross-Origin-Opener-Policy

Cross-Origin-Embedder-Policy

---

# CORS

Whitelist origins.

Never:

origin: *

when credentials=true.

Allow only required methods.

---

# Cookies

Must be:

HTTPOnly

Secure

SameSite

Short expiration

---

# Error Messages

Never expose:

Stack traces

Database errors

Internal exceptions

Use generic responses.

---

# API Responses

Consistent format.

{
    success,
    message,
    data,
    errors
}

---

# Authorization

Never trust frontend.

Always verify:

- ownership
- permissions
- roles

Backend decides authorization.

---

# RBAC

Support roles:

Admin

Moderator

User

Guest

Future:

Super Admin

---

# File Upload

Validate:

mime type

extension

size

virus scan

rename uploads

store outside public directory

---

# Dependencies

Only trusted packages.

Run:

npm audit

regularly.

Update vulnerable packages immediately.

---

# Security Libraries

Recommended:

helmet

express-rate-limit

express-validator

zod

argon2

cookie-parser

cors

csrf

hpp

compression

morgan

---

# Secure Defaults

Disable:

x-powered-by

Hide server version.

---

# Monitoring

Track:

Failed logins

Rate limit hits

Suspicious IPs

Expired tokens

Token reuse

Multiple location logins

---

# AI Coding Rules

Before creating ANY code:

Read this AGENTS.md.

Never generate insecure shortcuts.

Never remove validation.

Never disable middleware.

Never bypass authentication.

Never skip authorization.

Always explain security-sensitive changes.

---

# Code Quality

Use:

TypeScript

Strict Mode

ESLint

Prettier

Modular Architecture

Dependency Injection when applicable.

---

# Folder Structure

src/

auth/

middleware/

controllers/

routes/

services/

repositories/

validators/

models/

utils/

config/

security/

logs/

tests/

---

# Testing

Must include:

Unit Tests

Integration Tests

Authentication Tests

Authorization Tests

Rate Limiting Tests

Token Tests

Password Reset Tests

Session Tests

Security Regression Tests

---

# Future Features

- MFA
- Passkeys
- Device Management
- Login History
- Session Dashboard
- Trusted Devices
- WebAuthn
- OAuth Providers
- Risk-based Authentication

---

# Documentation

Every security feature added
must also update:

- README.md
- SECURITY.md
- CHANGELOG.md
- This AGENTS.md

---

# Version History

## 1.0.0

Initial production security rules.

Every future update MUST:

- Increment version.
- Add date.
- Describe changes.
- Never delete previous history.

## 1.2.0
Date: 2026-07-18

Added:
- Migrated frontend client to React + Vite.
- Reduced minimum password length constraint from 12 to 8.
- Integrated premium multimedia check-wrench-hexagon logo.

## 1.1.0
Date: 2026-07-18

Added:
- MongoDB database integration.
- Verification and Reset password flows.
- Brute force lockout protection (10 attempts, 30m lock, email alerts).
- Rate limiters for overall API and auth endpoints.
- HttpOnly access & refresh cookies with Rotation & Breach revocation.
- Logouts (current device and all devices).
- Custom secure audit logging.
- High-aesthetic glassmorphism HTML client.

Example:

## 1.1.0
Date:
YYYY-MM-DD

Added:
- Device sessions
- MFA
- Passkeys

# Secrets

Store secrets ONLY in environment variables or an approved secrets manager.

Never hardcode:

- API Keys
- JWT Secrets
- Database URLs
- OAuth Client Secrets
- Encryption Keys
- SMTP Credentials
- Cloud Credentials
- Access Tokens
- Refresh Token Secrets
- Session Secrets

NEVER expose secrets in:

- Source code
- Comments
- Documentation
- Examples
- Tests
- Mock data
- Sample configuration
- Fallback values
- Default constants
- Temporary debugging code

Never generate placeholder secrets that resemble real credentials.

Never write code such as:

❌ JWT_SECRET = "mysecret"
❌ API_KEY = "123456"
❌ DB_PASSWORD = "password"
❌ const SECRET = process.env.JWT_SECRET || "fallback-secret"

Instead:

✔ Validate that the required environment variable exists during application startup.
✔ If a required secret is missing, fail fast with a clear startup error.
✔ Never automatically substitute missing secrets with defaults or fallback values.
✔ Never print secret values to logs, error messages, or the console.

Example pattern (language-agnostic):

- Read the secret from the environment.
- Verify it exists.
- If missing, terminate startup with a descriptive error.
- Continue only when all required secrets are present.

AI Rule:

Never generate, reveal, invent, infer, or expose any secret values, even as examples, placeholders, demonstrations, mock values, fallback values, or test fixtures.

---

# Security Policy

## Supported Versions

Only the latest release is actively supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| < 1.3.0 | :x:                |

## Security Controls Implemented

FixConnect enforces strict policies at the engine and network level:
* **Payload Size Limits:** Express routes restrict payload bodies to `< 10kb` to mitigate buffer overflow attempts.
* **XSS Mitigation:** Using Helmet and escaping inputs before handling DB transactions.
* **Cookie Defenses:** JWT sessions are placed in HttpOnly, Secure, and SameSite=Strict cookies.
* **Brute-Force Safeguards:** Accounts locked after 10 failures, rate-limit boundaries placed.

## Reporting a Vulnerability

If you identify a security vulnerability within this project, please do **not** open a public GitHub issue. Instead, report it privately by emailing the security officer at `jhondribramirez7@gmail.com`.

---

# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-07-18

### Added
- Replaced link-based password resets with **6-digit OTP email verification codes**.
- OTP codes are stored as SHA-256 hashes with 15-minute expiration.
- Added `resetPasswordLimiter` (5 attempts/hour/IP) to prevent OTP brute force.
- Migrated frontend to **Redux Toolkit** with centralized auth state (`authSlice.js`).
- Restructured client into `pages/`, `components/`, `store/`, and `utils/` directories.
- Integrated **SweetAlert2 Toast** notifications for all auth transactions.
- Added premium OTP digit input with monospace styling.

## [1.2.0] - 2026-07-18

### Added
- Migrated frontend client to React + Vite.
- Reduced minimum password length constraint from 12 to 8.
- Integrated premium multimedia check-wrench-hexagon logo.

## [1.1.0] - 2026-07-18

### Added
- Integrated **MongoDB Atlas** for data persistence.
- Built **User model** with fields for verification and login lockout tracking.
- Set up **Nodemailer email service** for verification, greetings, and lockout alert notifications.
- Created **Session model** and controllers for **Refresh Token Rotation & Compromise Detection**.
- Formulated IP-based **rate limiters** for `/login`, `/register`, `/forgot-password`, `/verify`, and overall API pathing.
- Implemented **Brute Force Protection** (temporary lockout for 30m after 10 failed login attempts).
- Coded a premium glassmorphic frontend interface with custom SEO metadata.

## [1.0.0] - 2026-07-18

### Added
- Initial project guidelines and secure auth blueprint configuration.

# Module: Customer Service Discovery (MVP)

Version: 2.0.0

---

# Purpose

This document defines the business rules, system design, development standards, and AI instructions for the **Customer Service Discovery** module.

The AI agent MUST read this file before generating, modifying, or deleting any code.

This document is the single source of truth for this module.

---

# AI Rules

Before making any change:

1. Read this entire document.
2. Follow every rule in this document.
3. Do not assume business logic.
4. If unsure, ask instead of inventing behavior.
5. Never break existing architecture.
6. Never bypass validation.
7. Never remove security.
8. Never generate temporary or mock business logic unless explicitly requested.
9. Every new feature must integrate cleanly with existing modules.
10. Every update to this module must increment the version and append to the Version History section.

---

# MVP Goal

The objective is **NOT** to allow booking.

The objective is to help customers discover services quickly and confidently.

The platform should answer one question:

> "What service best solves my problem?"

Booking comes later.

---

# Platform Vision

The platform connects customers with service providers.

Customer Journey:

```
Login

↓

Browse Services

↓

Search Services

↓

Apply Filters

↓

Open Service Details

↓

Decide if this service fits the need

↓

(Book Later)
```

No booking logic should exist in this module.

---

# Primary User

Customer

Only customer features are implemented.

Provider, Admin, and Staff portals are outside the scope of this module.

---

# Core Business Logic

A customer should be able to:

* Browse available services
* Search services
* Filter services
* Sort services
* View service details

A customer CANNOT:

* Book
* Contact provider
* Chat
* Pay
* Review
* Cancel bookings

Those belong to future modules.

---

# Service Discovery Philosophy

Customers should never feel lost.

Every page should help customers answer:

* What services exist?
* Which one fits my needs?
* Who offers it?
* Is it trustworthy?
* How much does it cost?

---

# Service Entity

Every service contains:

* id
* slug
* title
* shortDescription
* fullDescription
* category
* thumbnail
* gallery
* providerId
* providerName
* serviceArea
* startingPrice
* estimatedDuration
* tags
* status
* createdAt
* updatedAt

---

# Service Status

Only services marked as:

ACTIVE

should be visible.

Hidden services:

* Draft
* Archived
* Suspended
* Deleted

must never appear.

---

# Search Logic

Search should support:

* Title
* Description
* Tags
* Category

Search should be:

Case insensitive

Trim whitespace

Ignore duplicate spaces

No exact-match requirement.

---

# Filtering

Support filtering by:

* Category
* Service Area
* Price Range

Future:

* Rating
* Availability
* Verified Provider

---

# Sorting

Support:

Newest

Oldest

Price Low → High

Price High → Low

Alphabetical

---

# Pagination

Do NOT return all services.

Default:

20 services per page.

Support:

page

limit

---

# Service Cards

Each card should display:

* Thumbnail
* Title
* Category
* Provider
* Starting Price
* Short Description

Cards should be lightweight.

Avoid excessive information.

---

# Service Details Page

Display:

Gallery

Full Description

Provider

Starting Price

Estimated Duration

Coverage Area

Related Services

Future:

Reviews

Booking Button

Availability

---

# Related Services

Recommend services using:

1. Same category
2. Same provider
3. Similar tags

Never recommend inactive services.

---

# Empty States

If no services exist:

Display friendly message.

Suggest browsing categories.

Never show blank pages.

---

# Error Handling

If service is missing:

Return:

404

Do not crash.

Do not expose database errors.

---

# Performance

Use pagination.

Lazy load images.

Optimize database queries.

Avoid N+1 queries.

---

# Images

Validate:

* File type
* File size
* Resolution

Use optimized images.

Never trust uploaded filenames.

---

# API Design

RESTful.

Examples:

GET /services

GET /services/:slug

GET /categories

Future endpoints should remain consistent.

---

# Response Format

Every API response:

{
success,
message,
data,
meta
}

Errors:

{
success,
message,
errors
}

---

# Validation

Validate:

* Query parameters
* Filters
* Sort values
* Pagination
* IDs
* Slugs

Reject invalid requests.

---

# Security

Never expose:

Provider private data

Internal IDs

Database structure

Secrets

Environment variables

Admin-only information

---

# Privacy

Customers should only receive public information.

Do not expose:

Provider email

Phone

Government IDs

Private notes

Internal analytics

---

# UI Principles

Keep interfaces:

Simple

Fast

Minimal

Mobile-friendly

Accessible

Do not overload pages.

---

# Accessibility

Support:

Keyboard navigation

Semantic HTML

ARIA labels where needed

Alt text for images

Visible focus states

---

# Architecture

Recommended layers:

```
Presentation

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Business logic belongs inside the Service layer.

Controllers should remain thin.

Repositories should only access data.

---

# Code Standards

Use:

TypeScript

Strict typing

Reusable components

Reusable services

Reusable validators

Avoid duplicated logic.

---

# Naming

Use clear names.

Example:

getServices()

searchServices()

findServiceBySlug()

Avoid vague names.

---

# Logging

Log:

Errors

Performance

Unexpected failures

Never log:

Secrets

Tokens

Passwords

Personal information

---

# Future Modules

The following are intentionally excluded:

Booking

Provider Dashboard

Admin Dashboard

Payments

Chat

Reviews

Notifications

Scheduling

Availability

Maps

Instant Booking

These will be separate modules.

---

# Definition of Done

This module is complete when a customer can:

✔ Browse services

✔ Search services

✔ Filter services

✔ Sort services

✔ Open service details

Without any booking functionality.

---

# AI Development Principles

The AI should prioritize:

1. Clean Architecture
2. Maintainability
3. Scalability
4. Security
5. Readability
6. Reusability

Never optimize prematurely.

Never generate unnecessary complexity.

Prefer simple, extensible solutions.

---

# Version History

## 2.0.0

Date:
2026-07-19

Initial Customer Service Discovery module.

Features:

* Browse services
* Search
* Filtering
* Sorting
* Service details
* Architecture rules
* Business logic
* API standards
* Security rules
* UI guidelines
* AI development instructions
