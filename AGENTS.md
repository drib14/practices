# Module: On-Demand Service Booking (MVP)

Current Version: 3.0.0

---

# Purpose

This module redefines the customer experience to an **On-Demand (Ride-Hailing Style) ecosystem**.

The platform is **NOT** a directory or catalog. Customers do not browse workers.
Instead, customers request a service (e.g., "Fix my sink"), and the system routes the request to available workers. Workers can then accept the jobs.

The objective of this module is to allow customers to instantly book a worker for a job, either "Now" or "Scheduled".

---

# AI Development Rules

Before generating any code:
- Read this document completely.
- Follow every business rule.
- Never assume missing business logic.
- Always prioritize scalability.
- Always follow existing project architecture.
- Every update must increment the module version and update the Version History.

---

# Product Vision

The platform connects people who need work done with skilled workers on-demand.
The customer experience mirrors a ride-hailing app.

The customer thinks:
> "I need a plumber at my house."

The customer requests the job. The system finds the worker.

---

# Platform Philosophy

**On-Demand Convenience.**
Every interaction should revolve around getting the job requested and accepted as frictionlessly as possible.

---

# MVP Scope

**Included:**
- Job Booking Request (Category, Description, Location, Schedule)
- Booking Status Tracking (Searching, Accepted, Cancelled, Completed)
- Booking History
- Simulated Worker Acceptance (Auto-assign a simulated worker)

**Not Included:**
- Worker App/Dashboard (for now, focus is on Customer side)
- Payments
- In-App Chat
- Live GPS Tracking

---

# Customer Journey

The platform should follow this exact flow:

Login → Dashboard → Select Category & Enter Details → Request Worker → System Searches → Worker Accepts → Job Scheduled/Started.

---

# Dashboard (On-Demand UI)

The Home page should immediately offer the booking interface.

Sections:
- **Request Form:** Category dropdown, Job Description, Location, Time (Now or Later).
- **Active Bookings:** Live status of current requests (e.g., "Searching for worker...", "Accepted by John Doe").
- **Booking History:** Past jobs.

---

# Booking Entity

Every booking should contain:
- id
- customerId (User)
- category (e.g., Plumbing, Electrical)
- description (Text)
- location (City/Address)
- scheduledTime (Date/Time)
- status (Searching, Accepted, Cancelled, Completed)
- assignedWorker (Worker ID - null until accepted)
- createdAt
- updatedAt

---

# Worker Entity (Simulation)

Workers exist in the system to accept jobs. They are not categorized strictly on their end, but they fulfill the customer's category requests.
For this MVP, the system will simulate a worker accepting the job shortly after the customer requests it.

---

# UI/UX Philosophy & Standards

- The interface should feel effortless and minimal.
- Primary Action: Request a Worker.
- Use a clean and modern layout with generous spacing.
- Design for **Mobile First** (Support Desktop, Tablet, Mobile).
- **Accessibility is required:** Keyboard navigation, Screen readers.

---

# API & Performance

**API Design:** RESTful structure.
Examples: `POST /bookings`, `GET /bookings`, `PUT /bookings/:id/cancel`

**Response Structure:**
- Success: `{ success: true, message: "...", data: {}, meta: {} }`
- Error: `{ success: false, message: "...", errors: [] }`

**Validation:** Validate all queries and parameters. Reject invalid requests.

---

# Definition of Done

This module is complete when a customer can:
✓ Fill out a job request
✓ Submit the booking (Instant or Scheduled)
✓ See the request enter "Searching" status
✓ See the request update to "Accepted" (via simulation)
✓ View their active and past bookings
*(Without browsing any worker directories)*

---

# AI Principles

The AI should always optimize for:

1. Simplicity
2. Scalability
3. Security
4. Maintainability
5. Readability
6. User Experience

Never over-engineer.
Build only what is required for the current module while keeping the architecture ready for future expansion.

---

# Version History

## [3.0.0] - 2026-07-20
### Added
- Pivoted from Worker Discovery to On-Demand Service Booking architecture.
- Added Booking entity and request flows.
- Removed worker browsing and catalog UI.
- Simulated worker acceptance logic.

## [2.0.0] - 2026-07-19
### Added
- Worker-first marketplace architecture and Customer discovery flow.
- Worker profile system, browsing, search, filtering, sorting, and recommendations.

## [1.3.0] - 2026-07-18
### Added
- Replaced link-based password resets with 6-digit OTP codes.
- Added `resetPasswordLimiter` to prevent OTP brute force.
- Migrated frontend state management to Redux Toolkit (`authSlice.js`).

## [1.2.0] - 2026-07-18
### Added
- Migrated frontend client to React + Vite.
- Reduced minimum password length constraint from 12 to 8.

## [1.1.0] - 2026-07-18
### Added
- Integrated MongoDB Atlas for data persistence.
- Built User model with fields for login lockout tracking.
- Created Session model and controllers for Refresh Token Rotation & Compromise Detection.

## [1.0.0] - 2026-07-18
### Added
- Initial project guidelines and secure auth blueprint configuration.
