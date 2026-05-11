# Smaky Track 🚬📊

Smaky Track is a modern full-stack cigarette smoking tracker and analytics platform built with Next.js 16, React 19, Drizzle ORM, Neon PostgreSQL, and Auth.js v5.

The application helps users monitor smoking habits, spending patterns, reduction progress, and behavioral analytics through a clean SaaS-style dashboard experience.

---

# ✨ Features

## 🔐 Authentication

* Email & Password Authentication
* Google OAuth Login
* Secure JWT Sessions
* Protected Dashboard Routes

## 🚬 Smoking Tracker

* Quick Smoke logging
* Track cigarette brands
* Track smoking timestamps
* Last smoked timer
* Recent smoking history

## 💰 Spending Analytics

* Daily spending
* Weekly spending
* Monthly spending
* Yearly spending
* Brand-wise spending analysis

## 📊 Dashboard & Analytics

* KPI Cards
* Smoking reduction comparison
* Most smoked brand
* Average cigarettes/day
* Weekly heatmaps
* Monthly trend charts
* Brand distribution charts

## 📅 Contribution Calendar

GitHub-style smoking heatmap calendar:

* Color intensity based on smoking count
* Filter by month/year
* Hover tooltips
* Daily smoking insights

## 📦 Packet Tracking

* Track packet purchases
* Packet cost analysis
* Consumption estimation
* Spending reports

## 🌙 UI/UX

* Modern SaaS dashboard
* Fully responsive
* Dark-mode-first design
* Smooth animations
* Skeleton loaders
* Toast notifications

## 🔎 SEO Optimized

* Metadata API
* OpenGraph support
* Twitter cards
* Dynamic metadata
* Robots.txt
* Sitemap.xml
* JSON-LD structured data
* Lighthouse optimized

---

# 🛠 Tech Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Framer Motion
* Recharts

## Backend

* Server Actions
* React Server Components
* Auth.js v5
* Drizzle ORM

## Database

* PostgreSQL
* Neon Database

## Validation & Forms

* Zod
* React Hook Form

---

# 📂 Project Structure

```bash
app/
src/
  db/
  auth/
  features/
  components/
  lib/
  hooks/
  providers/
drizzle/
```

Architecture follows a scalable feature-based structure.

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/your-username/smaky-track.git
cd smaky-track
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=
AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# 🗄 Database Setup

## Generate Migration

```bash
npm run db:generate
```

## Run Migration

```bash
npm run db:migrate
```

## Seed Database

```bash
npm run db:seed
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

Application will run on:

```bash
http://localhost:3000
```

---

# 📊 Default Cigarette Brands

| Brand        | Price  |
| ------------ | ------ |
| Camel        | 10 BDT |
| Lucky Strike | 12 BDT |
| Gold Leaf    | 15 BDT |
| Marlboro     | 20 BDT |
| B&S          | 20 BDT |

---

# 🧠 Architecture Highlights

* Server Components first architecture
* Server Actions for mutations
* Edge-safe auth configuration
* Optimistic UI updates
* SEO-first rendering strategy
* Typed database queries
* Modular feature architecture
* Production-grade code organization

---

# 📈 Planned Features

* CSV Export
* Achievement System
* Goal Tracking
* Smoke-free streak system
* Push notifications
* Full PWA support
* AI-powered smoking insights

---

# 🔒 Security

* Password hashing with bcryptjs
* Zod validation everywhere
* Protected routes
* JWT session strategy
* Secure server actions
* Input sanitization

---

# 📱 Performance

* Lazy loaded charts
* Dynamic imports
* Optimized metadata
* Minimal client hydration
* Core Web Vitals optimization
* Turbopack support

---

# 🌐 Deployment

Optimized for deployment on:

* Vercel
* Neon PostgreSQL

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Miftaul Islam Ariyan

* Full Stack Developer
* Node.js & Next.js Developer
* Backend-focused Engineer

LinkedIn:
https://www.linkedin.com/in/miftaul-islam-5b46a0279/

---

# ⭐ Project Purpose

Smaky Track is both:

* a real-world smoking/spending tracker
* a production-grade portfolio SaaS project demonstrating modern full-stack architecture and scalable application design.
