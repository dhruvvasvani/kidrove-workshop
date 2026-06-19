# Kidrove — AI & Robotics Summer Workshop 2026

A full-stack workshop registration landing page built with React, TypeScript, and Tailwind CSS on the frontend, and Node.js, Express, and MongoDB on the backend.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Tailwind CSS v3   |
| Bundler  | Vite 5                                  |
| Icons    | Lucide React                            |
| Backend  | Node.js, Express 4                      |
| Database | MongoDB via Mongoose (memory fallback)  |
| Fonts    | Google Fonts — Outfit + Inter           |

---

## Features

- Fully responsive, mobile-first design with sticky CTA bar
- TypeScript throughout the React codebase
- Tailwind CSS utility classes with custom design tokens
- Form validation — client-side and server-side with field-level error messages
- Loading states — spinner on submit, animated server status pill
- Live countdown timer to workshop start date
- Confetti animation on successful registration
- Rate limiting — 5 requests per minute per IP
- Duplicate email detection
- In-memory fallback when MongoDB is unavailable
- SEO — Open Graph, Twitter Card, canonical URL, robots meta

---

## Project Structure

```
kidrove-workshop/
├── client/                        # Vite + React frontend
│   ├── public/
│   │   └── hero-illustration.png
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css              # Custom animations, glassmorphism
│   │   └── WorkshopLandingPage.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── vercel.json
│   └── .env.example
├── server/
│   ├── server.js                  # Express REST API
│   ├── .env.example
│   └── package.json
├── package.json                   # Root workspace scripts
├── .gitignore
└── README.md
```

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/dhruvvasvani/kidrove-workshop.git
cd kidrove-workshop
npm run install:all
```

### 2. Configure environment

```bash
# Client (optional in dev — Vite proxy handles /api/* automatically)
cp client/.env.example client/.env.local

# Server
cp server/.env.example server/.env
# Edit server/.env and set MONGO_URI if you have MongoDB running
```

### 3. Run both servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Commands

```bash
# Install dependencies for both client and server
npm run install:all

# Run client + server concurrently
npm run dev

# Run only the frontend
npm run dev:client

# Run only the backend
npm run dev:server

# Build the frontend for production
npm run build

# Preview the production build locally
npm run preview

# Start the backend in production mode
npm run start:server
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
cd client
vercel --prod
```

When prompted:
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`

### Option B — Vercel Dashboard

1. Push this repo to GitHub
2. Go to vercel.com and click New Project
3. Import `dhruvvasvani/kidrove-workshop`
4. Set Root Directory to `client`
5. Framework will be auto-detected as Vite
6. Add environment variable: `VITE_API_URL` = your deployed backend URL
7. Click Deploy

---

## Deploy Backend (Railway or Render)

### Railway

```bash
npm install -g @railway/cli
railway login
cd server
railway init
railway up
```

Copy the deployed URL and set it as `VITE_API_URL` in Vercel.

### Render

1. Go to render.com and create a new Web Service
2. Connect your repository, set Root Directory to `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `MONGO_URI`, `FRONTEND_URL`, `PORT`

---

## API Reference

### GET /api/health

Returns server and database status.

```json
{
  "status": "ok",
  "database": "mongodb",
  "timestamp": "2026-06-19T09:00:00.000Z"
}
```

### POST /api/enquiry

Register a student for the workshop.

Request body:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210"
}
```

Success response (201):
```json
{
  "success": true,
  "message": "Registration successful! We will contact you within 24 hours.",
  "data": { "id": "...", "name": "Rahul Sharma", "email": "...", "createdAt": "..." }
}
```

Validation error (400):
```json
{
  "success": false,
  "errors": { "email": "Please provide a valid email address." }
}
```

### GET /api/enquiries

Returns all registrations. Intended for admin or debugging use.

---

## Evaluation Criteria

| Criteria | Implementation |
|---|---|
| UI Design & Responsiveness (25%) | Mobile-first layout, glassmorphism, animations, countdown, hero illustration, sticky CTA |
| React Component Structure (20%) | Custom hooks (useCountdown, useReveal), reusable Field and CountUp components, data-driven rendering |
| Code Quality & Readability (20%) | TypeScript types, compact logic, no duplication, consistent naming conventions |
| API Implementation (20%) | REST endpoints with validation, rate limiting, duplicate detection, MongoDB with memory fallback, correct HTTP status codes |
| Attention to Detail (15%) | SEO meta, OG tags, confetti on success, server status pill, seat progress bar, FAQ accordion |
| Bonus — TypeScript | Full TSX codebase |
| Bonus — Tailwind CSS | Tailwind v3 with custom design tokens and animations |
| Bonus — Form validation | Client-side and server-side with field-level error display |
| Bonus — Loading states | Submit spinner, disabled state, server connectivity indicator |
| Bonus — Vercel deploy | vercel.json included with SPA rewrite rule |

---

## License

MIT
