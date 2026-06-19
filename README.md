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

