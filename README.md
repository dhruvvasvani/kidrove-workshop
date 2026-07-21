# Kidrove — Advanced Workshop Registration Platform

A full-stack, scalable SaaS-style landing page and registration system. Built with modern, reliable technologies and designed for production deployment on platforms like Render and Vercel.

---

## Architecture & Tech Stack

| Layer    | Technology                              | Purpose                                          |
|----------|-----------------------------------------|--------------------------------------------------|
| Frontend | React 18, TypeScript, Tailwind CSS v3   | Fast, type-safe, mobile-first dynamic UI         |
| Bundler  | Vite 5                                  | Lightning-fast HMR and optimized production build|
| Backend  | Node.js, Express 4                      | Scalable REST API with strict rate-limiting      |
| Database | MongoDB via Mongoose (Atlas Cloud)      | Persistent, flexible NoSQL document storage      |
| Security | Helmet, Express-Mongo-Sanitize, CORS    | Production-ready protection against XSS/NoSQLi   |

---

## Features (Current)

- **Dynamic Forms**: Frontend and backend adapt automatically to database schema fields.
- **Fail-Fast Database**: Server strictly requires a MongoDB connection to ensure data integrity.
- **Production Security**: Implements `helmet` for secure headers and `mongoSanitize` to block NoSQL injection.
- **Robust Rate Limiting**: Dedicated API rate limiters per IP to prevent spam and DDoS attacks, compatible with reverse proxies.
- **Modern UI/UX**: Glassmorphism, animations, loading states, and confetti success screens.
- **SEO Optimized**: Open Graph, Twitter Cards, canonical URLs.

---

## Advanced Future Roadmap (What to build next)

To make this a fully-fledged enterprise SaaS product, here are powerful features you can add:

### 1. Payment Integration (Stripe)
Instead of just registering, redirect users to a Stripe Checkout session to collect workshop fees instantly.
* **How:** Add Stripe SDK to backend, create a webhook endpoint to update the `enquiry` status to "Paid".

### 2. Email Automation (Resend or SendGrid)
Send beautiful, automated confirmation emails to parents immediately after they register.
* **How:** Integrate `resend` in the `/api/enquiry` route and use React Email to design the templates.

### 3. Admin Dashboard & Authentication
Build a secure dashboard for workshop organizers to view, export (CSV), and manage registrations.
* **How:** Create a login route with `jsonwebtoken` (JWT), protect admin API routes, and build a table view on the frontend using something like AG Grid or TanStack Table.

### 4. Advanced Anti-Spoofing & Bot Protection
Prevent malicious bots from bypassing rate limits using rotating IPs.
* **How:** Integrate **Cloudflare Turnstile** or **Google reCAPTCHA v3**. The frontend generates a token, and the backend verifies it before saving to the database.

### 5. Automated Waitlists
When a workshop's `capacity` is reached, automatically switch the registration to a waitlist.
* **How:** Check `Enquiry.countDocuments({ workshopId })` before saving. If it exceeds capacity, tag the document as `status: 'waitlist'`.

---

## Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/dhruvvasvani/kidrove-workshop.git
cd kidrove-workshop
npm run install:all
```

### 2. Environment Variables
Create `.env` in the `server/` directory:
```env
MONGO_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/kidrove_workshop"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### 3. Start Development Servers
```bash
# Run both client and server concurrently
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---
