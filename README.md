<div align="center">

<img src="https://img.shields.io/badge/-RITHTOPUP-f97316?style=for-the-badge&labelColor=0f172a&logoColor=white" alt="RITHTOPUP" />

### ⚡ Instant game top-up storefront for Cambodia

A production-ready **Next.js 14** platform for selling in-game credits — with KHQR payments, an admin control panel, and polished PDF invoices.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-lightgrey)](#)

[Features](#-features) · [Quick start](#-quick-start-5-minutes) · [Deploy to Vercel](#-deploy-to-vercel) · [Admin panel](#-admin-panel) · [Environment](#-environment-variables) · [Troubleshooting](#-troubleshooting)

</div>

---

## 🎯 What is this?

**RITHTOPUP** lets customers buy Diamonds / UC / Genesis Crystals / game passes using a single KHQR code scannable by **every major Cambodian bank app** — ABA Pay, ACLEDA Pay, Wing, TrueMoney, Chip Mong, Prince Bank, and more.

| Customer side | Admin side |
|---|---|
| Browse featured games | Manage games, products, orders |
| Pick a package + enter UID | Approve / fulfil / refund orders |
| Pay via KHQR (180s expiry) | Hero banners, FAQ, blog, banlist |
| Track status live (3s poll) | Revenue chart, customers, audit log |
| Download branded PDF invoice | Telegram notifications on new orders |

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🛒 Storefront
- Mobile-first landing page with hero carousel
- Game catalog + per-game product pages
- Live UID / server validation hooks
- USD ↔ KHR currency switcher
- Site-wide announcement bar
- Public FAQ & blog pages
- Order tracking with animated timeline

### 💳 Payments
- **KHPay** integration (KHQR)
- 180-second expiring QR codes
- HMAC-SHA256 webhook signing
- Auto-poll fallback when webhooks fail
- Simulation mode for local dev (no API key needed)

</td>
<td width="50%" valign="top">

### 🛠️ Admin panel
- Email/password login (JWT cookie)
- Full CRUD: games, products, orders
- Drag-free up/down reorder
- Hero banners, FAQ, blog posts
- Customer list (aggregated from orders)
- Email/phone/UID banlist
- Audit log of every admin action
- CSV export + KHPay refresh button

### 📄 Invoices
- Generated server-side with `pdfkit`
- A4 layout, brand-coloured header
- Order details, items table, totals
- Rotated **PAID** stamp
- Customer + admin can download

</td>
</tr>
</table>

---

## 🧱 Tech stack

```
Next.js 14 (App Router)  ·  React 18  ·  TypeScript (strict)
Prisma 5  ·  SQLite (dev) / PostgreSQL (prod)
Tailwind CSS 3  ·  lucide-react icons
jose (JWT)  ·  bcryptjs  ·  pdfkit  ·  zod
```

---

## ⚡ Quick start (5 minutes)

> **Requires** Node.js 20+ and npm. Windows, macOS, Linux all fine.

### 1. Clone & install

```bash
git clone https://github.com/angkerith1/rithtopup-site.git
cd rithtopup-site
npm install
```

### 2. Create your `.env`

```bash
cp .env.example .env
```

Open `.env` and set at minimum:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="$(openssl rand -base64 32)"
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="YourStrongPassword!"
PAYMENT_SIMULATION_MODE="true"
```

> 💡 For local dev leave `DATABASE_URL="file:./dev.db"` and keep `provider = "sqlite"` in `prisma/schema.prisma`. No Postgres needed yet.

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

The seed creates your first admin account using `ADMIN_EMAIL` + `ADMIN_PASSWORD`, plus a few demo games.

### 4. Run it

```bash
npm run dev
```

Open **http://localhost:3000** — storefront.
Open **http://localhost:3000/admin/login** — admin panel.

✅ That's it. In simulation mode, paying for an order auto-completes after 3 seconds so you can test the full flow without KHPay credentials.

---

## 🚀 Deploy to Vercel

> ⚠️ **Important:** SQLite does **not** work on Vercel (serverless FS is read-only and ephemeral). You must switch to Postgres before deploying.

### Step 1 — Create a Postgres database

Pick one (all have free tiers):

- **[Neon](https://neon.tech)** — recommended, instant setup, great free tier
- **[Supabase](https://supabase.com)** — includes auth/storage you don't need but fine
- **[Vercel Postgres](https://vercel.com/storage/postgres)** — one-click from dashboard

Copy the `DATABASE_URL` connection string.

### Step 2 — Switch Prisma to Postgres

Edit [`prisma/schema.prisma`](prisma/schema.prisma):

```prisma
datasource db {
  provider = "postgresql"   // ← was "sqlite"
  url      = env("DATABASE_URL")
}
```

Locally, point `.env` at your new Postgres URL and run:

```bash
npx prisma db push
npm run db:seed
```

Then commit & push:

```bash
git add prisma/schema.prisma
git commit -m "chore: switch to postgres for production"
git push
```

### Step 3 — Import the repo into Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Import `angkerith1/rithtopup-site`
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (auto) — this runs `prisma generate && next build`
5. **Do not deploy yet** — add environment variables first ↓

### Step 4 — Add environment variables

In **Vercel → Settings → Environment Variables**, add for **Production + Preview**:

| Variable | Example / how to get it |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `JWT_SECRET` | Run `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Strong password (used on first seed only) |
| `KHPAY_BASE_URL` | `https://khpay.site/api/v1` |
| `KHPAY_API_KEY` | From [khpay.site](https://khpay.site) dashboard |
| `KHPAY_WEBHOOK_SECRET` | Generated in KHPay dashboard |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` (no trailing slash) |
| `PUBLIC_APP_URL` | Same as `NEXT_PUBLIC_BASE_URL` |
| `PAYMENT_SIMULATION_MODE` | `false` |
| `TELEGRAM_BOT_TOKEN` | *(optional)* for new-order notifications |
| `TELEGRAM_CHAT_ID` | *(optional)* chat or channel ID |

### Step 5 — Deploy & configure KHPay webhook

1. Click **Deploy** in Vercel — wait for the build to finish
2. In your **KHPay dashboard**, set webhook URL to:
   ```
   https://your-domain.vercel.app/api/payment/webhook/khpay
   ```
3. Visit `https://your-domain.vercel.app/admin/login` and sign in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
4. Go to **Admin → Games / Products** and configure your catalog

🎉 **You're live.**

---

## 🧑‍💼 Admin panel

| Path | What it does |
|---|---|
| `/admin` | Dashboard — revenue sparkline, quick links |
| `/admin/games` | Add / edit / reorder games |
| `/admin/products` | Manage top-up packages per game |
| `/admin/orders` | All orders, CSV export, clear-all |
| `/admin/orders/[number]` | Order detail, refund, refresh from KHPay |
| `/admin/banners` | Homepage hero carousel |
| `/admin/faqs` | FAQ manager (public at `/faq`) |
| `/admin/blog` | Blog posts (public at `/blog`) |
| `/admin/customers` | Customers aggregated from orders |
| `/admin/banlist` | Block emails, phones, UIDs, IPs |
| `/admin/audit-logs` | Every admin mutation, paginated |
| `/admin/settings` | Site branding, announcement, maintenance mode, Telegram |

---

## 🔑 Environment variables

All variables documented in [`.env.example`](.env.example). The essential ones:

```env
# Database
DATABASE_URL="file:./dev.db"              # dev (sqlite)
# DATABASE_URL="postgresql://..."         # prod

# Auth
JWT_SECRET="<32+ char random string>"
ADMIN_EMAIL="admin@rithtopup.com"
ADMIN_PASSWORD="ChangeMeNow123!"

# KHPay (leave API key blank to use simulation mode)
KHPAY_BASE_URL="https://khpay.site/api/v1"
KHPAY_API_KEY=""
KHPAY_WEBHOOK_SECRET=""

# URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
PUBLIC_APP_URL=""                         # same as NEXT_PUBLIC_BASE_URL in prod

# Dev flag
PAYMENT_SIMULATION_MODE="true"            # auto-completes payments after 3s
```

---

## 📁 Project structure

```
app/
├── (public pages)         /, /games/[slug], /order, /blog, /faq
├── admin/                 Admin UI (games, orders, banners, ...)
└── api/
    ├── orders/            Public order + invoice endpoints
    ├── payment/           KHPay init, simulate, webhook
    └── admin/             Protected admin API routes
components/                Header, Footer, GameCard, TopUpForm, carousel
lib/
├── auth.ts                JWT session + bcrypt
├── payment.ts             KHPay client + simulator
├── telegram.ts            notifyTelegram()
├── audit.ts               writeAudit()
└── prisma.ts              Shared client
prisma/
├── schema.prisma          Data model
└── seed.ts                First admin + demo games
middleware.ts              /admin/* + /api/admin/* auth gate
```

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on `:3000` |
| `npm run build` | `prisma generate && next build` |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply Prisma schema to database |
| `npm run db:seed` | Seed admin user + demo games |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🐛 Troubleshooting

<details>
<summary><b>Admin login returns 401 right after deploy</b></summary>

Did you run the seed on the production database? Connect locally with your prod `DATABASE_URL` and run `npm run db:seed` once.
</details>

<details>
<summary><b>KHPay QR expired / webhook never fires</b></summary>

- The QR is **valid for 180 seconds** — this is a KHPay limit, not a bug.
- Webhook URL in KHPay dashboard must be `https://your-domain/api/payment/webhook/khpay` (HTTPS, not localhost).
- For local testing use a tunnel: `cloudflared tunnel --url http://localhost:3000` and set `PUBLIC_APP_URL` to the tunnel URL.
- If the webhook doesn't reach you, the order-detail page auto-polls KHPay every 3 seconds — the order will still flip to PAID.
</details>

<details>
<summary><b>Prisma error on Vercel: "Can't reach database"</b></summary>

- You're still on SQLite. Switch `provider` to `postgresql` in `prisma/schema.prisma` and push.
- Or your `DATABASE_URL` is wrong. For Neon/Supabase, make sure it ends with `?sslmode=require`.
</details>

<details>
<summary><b>PDF invoice returns 500 on Vercel</b></summary>

- Already handled: [`next.config.js`](next.config.js) declares `pdfkit` as `serverComponentsExternalPackages` and the route is pinned to `runtime = "nodejs"`. If it still happens, redeploy after clearing Vercel's build cache.
</details>

<details>
<summary><b>Uploaded images disappear on Vercel</b></summary>

`public/uploads/` is **read-only** on Vercel. Wire any upload feature to Vercel Blob / Cloudinary / S3 instead of the filesystem.
</details>

---

## 🔒 Security checklist before going live

- [ ] Change `ADMIN_PASSWORD` from the default
- [ ] `JWT_SECRET` is 32+ random chars, different from any other project
- [ ] `PAYMENT_SIMULATION_MODE=false` in production
- [ ] `KHPAY_WEBHOOK_SECRET` matches the one configured in KHPay dashboard
- [ ] Custom domain set in Vercel with HTTPS enforced
- [ ] `.env` is **not** committed (verify with `git ls-files | grep .env`)
- [ ] Admin users are created via the seed script, not hardcoded

---

## 📄 License

Private — © RITHTOPUP. All rights reserved.

---

<div align="center">

Built with ⚡ for the Cambodian gaming community.
Support: **[@rithtopup](https://t.me/rithtopup)** on Telegram.

</div>
