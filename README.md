# FixConnect - On-Demand Service Platform

FixConnect is a secure, intuitive on-demand local service platform. Operating like a ride-hailing app, it connects home/business clients needing help with local service professionals instantly.

---

## Key Features

1. **On-Demand Service Booking:**
   - Instantly request a worker for specific categories (e.g., Plumbing, Electrical).
   - Provide job descriptions, locations, and choose to book "Now" or "Schedule Later".
   - Live tracking of job status (Searching for Worker -> Accepted).
   - Automated worker simulation (for MVP demonstration purposes).

2. **Secure Authentication & Session Management:**
   - **Walkthrough Signup Wizard:** User-friendly step-by-step onboarding flow.
   - **HttpOnly Cookies Security:** Double-token JWT system transmitted strictly via HttpOnly, Secure, and SameSite=Strict cookies to protect against XSS and CSRF.
   - **Refresh Token Rotation:** Mitigates replay attacks by rotating tokens on each validation request, with breach detection mechanism.
   - **Brute Force Lockout:** Automatically locks accounts for 30 minutes after 10 failed login attempts.
   - **Password Reset:** Secure OTP (6-digit) verification codes with expiration.
   - **Rate Limiting:** Route-specific limitations preventing brute force and platform overload.

3. **Interactive Dashboard & Portal:**
   - Streamlined dashboard focusing purely on requesting help and managing active bookings.
   - Quick session termination controls (logout from current device or logout from all devices).

---

## Technology Stack

* **Frontend:** React, Vite, Redux Toolkit, CSS3, Axios, and SweetAlert2. Search engine optimized (SEO) with descriptive headings and responsive layout.
* **Backend:** Node.js, Express, Helmet (HTTP header security), CORS, cookie-parser, and express-rate-limit.
* **Database:** MongoDB (using Mongoose schemas).
* **Notifications:** Nodemailer SMTP integration for security notifications and password resets.

---

## Local Setup & Installation

### 1. Prerequisites
* Node.js (v18+)
* MongoDB instance (local or MongoDB Atlas connection URL)

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install packages: `npm install`
3. Create `.env` using `.env.example` as a template.
4. Start backend: `npm run dev`

### 3. Frontend Setup
1. Navigate to client folder: `cd client`
2. Install packages: `npm install`
3. Start frontend: `npm run dev`
