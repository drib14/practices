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