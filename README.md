# 🤖 Kidrove — AI & Robotics Summer Workshop 2026

A full-stack workshop registration landing page built with **React + TypeScript + Tailwind CSS** (client) and **Node.js + Express + MongoDB** (server).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ✨ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Tailwind CSS v3   |
| Bundler  | Vite 5                                  |
| Icons    | Lucide React                            |
| Backend  | Node.js, Express 4                      |
| Database | MongoDB (Mongoose) — falls back to RAM  |
| Fonts    | Google Fonts — Outfit + Inter           |

---

## 🏆 Features

- **Fully responsive** — mobile-first design with sticky CTA bar
- **TypeScript** throughout the React codebase
- **Tailwind CSS** utility classes + custom design tokens
- **Form validation** — client-side + server-side with clear error messages
- **Loading states** — spinner on submit, server status pill (live/connecting/demo)
- **Countdown timer** — live seconds countdown to workshop start
- **Confetti** — fires on successful registration
- **Rate limiting** — 5 req/min per IP on the API
- **Duplicate detection** — blocks same email from registering twice
- **Memory fallback** — server works without MongoDB (perfect for demos)
- **SEO** — full Open Graph, Twitter Card, canonical, robots meta

---

## 📁 Project Structure

```
kidrove/
├── client/                  # Vite + React frontend
│   ├── public/
│   │   └── hero-illustration.png
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css        # Custom CSS (animations, glass, etc.)
│   │   └── WorkshopLandingPage.tsx   # Main page component
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── vercel.json          # Vercel SPA rewrite rule
│   └── .env.example
├── server/
│   ├── server.js            # Express API
│   ├── .env.example
│   └── package.json
└── package.json             # Root workspace scripts
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/kidrove-workshop.git
cd kidrove-workshop

# Install all dependencies (client + server)
npm run install:all
```

### 2. Configure environment

```bash
# Client — optional, proxy handles this in dev
cp client/.env.example client/.env.local

# Server
cp server/.env.example server/.env
# Edit server/.env and set MONGO_URI if you have MongoDB
```

### 3. Run dev servers (both at once)

```bash
npm run dev
```

This starts:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5000

> The Vite dev server proxies `/api/*` → `localhost:5000` automatically.

---

## 🔧 Individual Commands

```bash
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

## ☁️ Deploy to Vercel (Frontend)

### Option A — Vercel CLI

```bash
# Install Vercel CLI globally (one-time)
npm install -g vercel

# Deploy from the client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: kidrove-workshop
# - In which directory is your code located? ./
# - Build command: npm run build
# - Output directory: dist
# - Development command: npm run dev

# On next deploys, just run:
vercel --prod
```

### Option B — Vercel Dashboard (No CLI)

1. Push this repo to **GitHub**
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Set **Root Directory** to `client`
5. Framework: **Vite** (auto-detected)
6. Add environment variable: `VITE_API_URL` = your backend URL
7. Click **Deploy** ✅

---

## ☁️ Deploy Backend (Railway / Render)

### Railway (recommended — free tier)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd server
railway init
railway up
```

Then copy the Railway URL and set it as `VITE_API_URL` in Vercel.

### Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your repo, set **Root Directory** to `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add env vars: `MONGO_URI`, `FRONTEND_URL`

---

## 🔌 API Reference

### `GET /api/health`
Returns server status and database mode.

```json
{
  "status": "ok",
  "database": "mongodb",
  "timestamp": "2026-06-19T09:00:00.000Z"
}
```

### `POST /api/enquiry`
Register a student for the workshop.

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210"
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Registration successful! We will contact you within 24 hours.",
  "data": { "id": "...", "name": "Rahul Sharma", "email": "...", "createdAt": "..." }
}
```

**Validation error (400):**
```json
{
  "success": false,
  "errors": { "email": "Please provide a valid email address." }
}
```

### `GET /api/enquiries`
List all registrations (admin/debug use).

---

## 📋 Evaluation Criteria Coverage

| Criteria | Coverage |
|---|---|
| **UI Design & Responsiveness (25%)** | Mobile-first, glassmorphism, animations, sticky CTA, countdown, hero illustration |
| **React Component Structure (20%)** | Custom hooks (`useCountdown`, `useReveal`), reusable `Field`, `CountUp` components, clean separation of data/logic/UI |
| **Code Quality & Readability (20%)** | TypeScript types, compact data-driven rendering, no duplication, clear naming |
| **API Implementation (20%)** | REST API with validation, rate limiting, duplicate detection, MongoDB + memory fallback, proper HTTP status codes |
| **Attention to Detail (15%)** | SEO meta, OG tags, confetti on success, server status pill, seat progress bar, FAQ accordion |
| **Bonus: TypeScript** ✅ | Full TSX codebase |
| **Bonus: Tailwind CSS** ✅ | Tailwind v3 + custom design tokens |
| **Bonus: Form validation** ✅ | Client + server side with field-level errors |
| **Bonus: Loading states** ✅ | Spinner, disabled button, server status indicator |
| **Bonus: Vercel deploy** ✅ | `vercel.json` included, deploy steps above |

---

## 📝 License

MIT — feel free to use and adapt.
