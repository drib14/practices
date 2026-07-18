# FixConnect Authentication System

FixConnect is a secure, production-ready, custom authentication system built for a startup service booking platform. It implements advanced security layers to protect client and service provider accounts, conforming to strict security standards.

---

## Key Authentication Features

1. **Strict Password Security:**
   - Enforces a minimum length of 12 characters.
   - Requires mixed character classes (uppercase, lowercase, numbers, special characters).
   - Rejects common dictionary words, sequential characters, and usernames/emails within passwords.

2. **Session Security & HttpOnly Cookies:**
   - **Access Token:** Short-lived JWT (15-minute expiration) containing user identifiers and roles.
   - **Refresh Token:** Long-lived secure token (7-day expiration) stored in the database.
   - Both tokens are transmitted solely via **HttpOnly, Secure, and SameSite=Strict cookies**. This eliminates the risk of Cross-Site Scripting (XSS) extraction and blocks Cross-Site Request Forgery (CSRF).

3. **Refresh Token Rotation & Breach Detection:**
   - When a client refreshes an expired access token, the backend invalidates the current refresh token and issues a new access/refresh pair.
   - If an invalidated refresh token is ever presented again (indicating token theft/leakage), the system immediately revokes all active session tokens for that user, clearing local cookies and forcing a prompt login.

4. **Brute Force Protection & Account Locking:**
   - Accounts are temporarily locked for **30 minutes** after **10 failed login attempts**.
   - Upon lock initialization, the system automatically alerts the user via email.
   - Generic response messages (`Invalid credentials`) are returned to prevent user enumeration attacks.

5. **Email Verification & Password Reset:**
   - Verification links are sent automatically upon signup (valid for 24 hours). Login is forbidden until verification is complete.
   - Password reset links are dispatched via single-use tokens valid for 30 minutes.

6. **Rate Limiting:**
   - Login: 5 requests per 15 minutes.
   - Registration: 3 requests per hour.
   - Forgot Password: 3 requests per hour.
   - Email Verification: 5 requests per hour.
   - Global API: 100 requests per minute.

---

## Technical Stack

* **Frontend:** Glassmorphism UI using Vanilla HTML5, CSS3, ES Modules, Bootstrap Icons/FontAwesome, Axios, and SweetAlert2. Optimized with custom metadata for search engine optimization (SEO).
* **Backend:** Node.js, Express, Helmet (security headers), CORS (configured with credentials), cookie-parser, and express-rate-limit.
* **Database:** MongoDB (via Mongoose) with session TTL indexes.
* **Mailing:** Nodemailer SMTP Transporter.

---

## Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB Atlas Cluster or local MongoDB instance

### Installation
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the required packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory based on the `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://...
   JWT_ACCESS_SECRET=your-secure-256bit-access-secret
   JWT_REFRESH_SECRET=your-secure-256bit-refresh-secret
   EMAIL_USER=your-smtp-email@gmail.com
   EMAIL_PASSWORD=your-smtp-app-password
   CLIENT_URL=http://localhost:5500
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
5. Launch the frontend files under the `client/` folder using a local server (e.g., Live Server extension in VS Code on port 5500).
