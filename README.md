# FixConnect - Premium Service Booking Platform

FixConnect is a next-generation, secure, and intuitive local service booking platform. It bridges the gap between home/business clients needing help and local service professionals (electricians, plumbers, handymen, contractors).

---

## Key Features

1. **Service Marketplace & Discovery:**
   - Search and browse local service categories.
   - Filter professionals by rating, proximity, and specialization.

2. **Intuitive Booking & Scheduling Engine:**
   - Real-time calendar scheduling for booking jobs.
   - Status logs and booking timeline updates for clients and providers.

3. **Secure Authentication & Session Management:**
   - **Walkthrough Signup Wizard:** User-friendly step-by-step onboarding flow.
   - **HttpOnly Cookies Security:** Double-token JWT system (15-minute access, 7-day refresh) transmitted strictly via HttpOnly, Secure, and SameSite=Strict cookies to protect against XSS and CSRF.
   - **Refresh Token Rotation:** Mitigates replay attacks by rotating tokens on each validation request, with breach detection mechanism that revokes all active session keys on token reuse.
   - **Brute Force Lockout:** Automatically locks accounts for 30 minutes after 10 failed login attempts, alerting the user immediately via email.
   - **Email Verification & Password Reset:** Secure validation links issued via single-use, time-restricted tokens.
   - **Rate Limiting:** Route-specific limitations preventing brute force and platform overload.

4. **Interactive Dashboard & Portal:**
   - Personalized dashboards with distinct layouts for **Customers** and **Service Providers**.
   - Session termination controls (logout from current device or logout from all devices).

---

## Technology Stack

* **Frontend:** Minimalist, mobile-first design using Vanilla HTML5, CSS3, ES Modules, Axios, and SweetAlert2. Search engine optimized (SEO) with descriptive headings and tags.
* **Backend:** Node.js, Express, Helmet (HTTP header security), CORS, cookie-parser, and express-rate-limit.
* **Database:** MongoDB (using Mongoose schemas) with Session TTL indexing.
* **Notifications:** Nodemailer SMTP integration for email receipts, security notifications, and registration confirmations.

---

## Local Setup & Installation

### 1. Prerequisites
* Node.js (v16+)
* MongoDB instance (local or MongoDB Atlas connection URL)

### 2. Backend Setup
1. Open your terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the Node packages:
   ```bash
   npm install
   ```
3. Create a `.env` configuration file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://...
   JWT_ACCESS_SECRET=your-secure-256bit-access-secret
   JWT_REFRESH_SECRET=your-secure-256bit-refresh-secret
   EMAIL_USER=your-smtp-email@gmail.com
   EMAIL_PASSWORD=your-smtp-app-password
   CLIENT_URL=http://localhost:5500
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Launch a local web server (such as the VS Code Live Server extension) targeting the `client/` folder on port **5500**.
2. Open `http://localhost:5500/login.html` in your browser.
