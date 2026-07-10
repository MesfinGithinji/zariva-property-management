# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zariva Property Management System — a premium property management platform for Zariva Africa Properties Ltd (Kenya). Brand identity: dark forest green (`#1A3626`) + warm gold (`#C9A843`). Logo at `frontend/public/logo_transparent.png`.

Two portals:
- **Landlord** (`/landlord/*`) — dashboard, properties, tenants, maintenance, finance, settings, consent requests
- **Tenant** (`/tenant/*`) — dashboard, payments, maintenance, documents, settings, consent requests, privacy notice

## Commands

### Frontend (`cd frontend`)
```bash
npm run dev          # dev server at localhost:3000
npm run build        # production build
npm run type-check   # tsc --noEmit (run before committing)
npm run lint         # eslint
```

### Backend (`cd backend`)
```bash
source venv/bin/activate
uvicorn main:app --reload            # dev server at localhost:8000, docs at /docs
alembic upgrade head                 # apply migrations
alembic revision --autogenerate -m "description"  # generate new migration
python seed.py                       # seed database with demo data
ruff check .                         # lint
black .                              # format
pytest                               # run tests
```

### Docker (full stack)
```bash
docker compose up          # starts frontend + backend + postgres + redis
docker compose up -d db    # just the database
```

Local ports: frontend `3000`, backend `8000`, postgres `5433`, redis `6380`.

## Architecture

### Frontend — Next.js 16 App Router

**Routing pattern:** Every portal route uses the same shell — `"use client"`, `<Sidebar />` with `lg:ml-72` offset, then page content in `FadeCard` wrappers with Framer Motion.

**All 19 routes built and live:**
- `/` — landing page
- `/login`, `/signup` — auth pages (dark split-panel design)
- `/_not-found` — custom 404 page
- `/privacy` — public privacy notice (Kenya Data Protection Act)
- `/landlord` — dashboard
- `/landlord/properties`, `/landlord/property/[id]` — property management
- `/landlord/tenants` — tenant management
- `/landlord/maintenance` — maintenance requests
- `/landlord/finance` — financials
- `/landlord/requests` — consent request review (landlord side)
- `/landlord/settings` — account settings
- `/tenant` — dashboard
- `/tenant/payments` — payment history
- `/tenant/maintenance` — maintenance requests
- `/tenant/documents` — lease documents
- `/tenant/requests` — consent form submissions (sublet, alterations, pet)
- `/tenant/settings` — account settings

**Shared component library** (`frontend/components/ui/`):
- `StatCard` — animated CountUp metric tile, `variant` prop: `"green" | "gold" | "neutral"`. Has tinted gradient backgrounds and a coloured left accent bar per variant.
- `StatusBadge` — unified pill for all status types (lease, payment, maintenance, priority, occupancy)
- `FadeCard` — motion wrapper with stagger `delay` prop
- `PageHeader` — title + gold shimmer name display
- `Button` — CVA variants: `default | outline | ghost | destructive | link`
- `Skeleton` — loading placeholder

**Other components:**
- `Sidebar` — shows logged-in user's name, role, and avatar initials via `useAuth()`. Has mobile drawer (AnimatePresence spring). Includes consent-related nav links.
- `ConsentModal` — first-login onboarding modal; collects lease_admin_consent, communications_consent, marketing_consent, national_id. Posts to `/consent`.

**State:** Most portal pages consume `frontend/lib/mock-data.ts`. Fully wired to live API: signup/login (real `POST /auth/register` + `/auth/login`), the tenant + landlord dashboards, the consent requests page (`/tenant/requests`), the landlord requests page (`/landlord/requests`), and the onboarding flows (tenant "join a property", landlord "add property"). `AuthContext` (`frontend/context/auth-context.tsx`) manages logged-in user state; `frontend/lib/auth.ts` has `login()` + `register()`.

**Onboarding flows:**
- `frontend/components/JoinProperty.tsx` — shown on the tenant dashboard when the tenant has no lease; search property → request to join → pending/declined states.
- `frontend/components/AddPropertyModal.tsx` — two-step landlord flow: property details (`POST /properties`) → add units (`POST /units`).
- Landlord dashboard shows a "Welcome to Zariva" hero + setup checklist when the landlord has zero properties.

**API client** (`frontend/lib/api.ts`): `api.get/post/patch/delete` — reads `NEXT_PUBLIC_API_URL` env var, attaches JWT from `localStorage["zariva_token"]` automatically.

**Styling:**
- Tailwind v4 — uses `@import "tailwindcss"` + `@config` directive, NOT the v3 `tailwind()` plugin pattern
- `postcss.config.mjs` must use `"@tailwindcss/postcss": {}` (not `tailwindcss: {}`)
- Custom palette: `primary-950` (#1A3626), `gold-500` (#C9A843), `cream` (#F5F1E8)
- `.text-gold-shimmer` — animated gradient sweep on key headings (defined in `globals.css`)
- `.num` — tabular-nums class for KES values
- **Tailwind v4 class rules:** use `bg-linear-to-r` (not `bg-gradient-to-r`), `shrink-0` (not `flex-shrink-0`), canonical numeric sizes (`w-120` not `w-[480px]`), `z-50` not `z-[50]`

**Standard design patterns:**
- Button: `bg-primary-950 hover:bg-primary-900 text-gold-400 border border-gold-500/20 font-semibold rounded-xl`
- Input focus: `bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all`
- Dark aurora panel: `bg-[#0D2818]` with animated radial gradient blobs (`radial-gradient(circle, #C9A843 0%, transparent 70%)`)
- Page title: `<span className="text-gold-shimmer">` on the key word
- Slide-over drawer: AnimatePresence spring (`stiffness: 320, damping: 36`), `x: [420 → 0]`, fixed right panel `max-w-lg`
- Request cards: `relative overflow-hidden rounded-2xl` with absolute `w-1 rounded-r-full` left accent bar (colour = status)

**Animations:** Framer Motion throughout. Standard easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, minimum 200ms transitions. Page-level transitions via `app/template.tsx` (fade + slide on every route change). Sidebar active pill uses `layoutId` spring.

**Dark surfaces:**
- Sidebar + auth left panel: `#0D2818`
- Glass cards: `rgba(255,255,255,0.06)` + `border-gold/20`
- Content cards: white with `border-gray-100 shadow-sm rounded-2xl`

### Backend — FastAPI

**Structure:**
```
backend/
  main.py              # app entry, CORS, router registration
  app/
    core/
      config.py        # Settings (pydantic-settings, reads .env)
      database.py      # SQLAlchemy engine, SessionLocal, Base, get_db()
      security.py      # JWT encode/decode, bcrypt hashing
    dependencies.py    # get_current_user, require_landlord, require_tenant
    models/            # SQLAlchemy ORM models (including consent.py)
    schemas/           # Pydantic request/response schemas (including consent.py)
    routers/           # auth, properties, units, tenants, leases, payments, maintenance, consent
```

**Auth flow:** JWT HS256, token in `Authorization: Bearer <token>` header. `get_current_user` → `require_landlord` / `require_tenant` FastAPI dependencies guard routes by role.

**Config:** All settings read from environment / `.env` file via `app/core/config.py`. Key vars: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`, `ENVIRONMENT`.

**Migrations:** Alembic reads `DATABASE_URL` from `settings` at runtime (set in `alembic/env.py`). All models must be imported in `alembic/env.py` to be picked up by autogenerate.

**Consent management endpoints** (`/consent` router):
- `POST /consent` — record tenant consent (lease_admin, communications, marketing, national_id)
- `POST /consent/sublet` — submit sublet/assignment request
- `GET /consent/sublet/me` — tenant's own sublet requests
- `POST /consent/alterations` — submit alteration request
- `GET /consent/alterations/me` — tenant's own alteration requests
- `POST /consent/pets` — submit pet consent request
- `GET /consent/pets/me` — tenant's own pet requests

**Join request endpoints** (`/join-requests` router) — the tenant "join a property" flow:
- `GET /join-requests/properties/search?q=` — tenant searches by property name or landlord email (empty query returns `[]`; no full public dump)
- `POST /join-requests` — tenant requests to join a property (guards: already-linked, duplicate pending)
- `GET /join-requests/me` — tenant's own requests (drives pending/declined state)
- `GET /join-requests` — landlord lists requests for their own properties only
- `POST /join-requests/{id}/approve` — landlord assigns a vacant unit + rent/deposit/dates → **creates the Lease + flips unit occupied**
- `POST /join-requests/{id}/decline` — landlord declines with optional reason
- Landlord actions authorize via `property.owner_id`. Model in `app/models/join_request.py` (reuses the `requeststatus` enum).

**Demo credentials:**
- Landlord: `matty@zariva.com` / `zariva123`
- Tenant: `john.kamau@email.com` / `tenant123`

## Adding New Pages

Follow the established pattern:
1. Create `frontend/app/<portal>/<page>/page.tsx` with `"use client"` at top
2. Import `Sidebar`, `FadeCard`, `StatCard`, `StatusBadge` as needed
3. Live data: use `api.get/post` from `frontend/lib/api.ts`; mock data: use `landlordData` or `tenantData` from `frontend/lib/mock-data.ts`
4. Wrap content sections in `<FadeCard delay={0.1 * index}>` for stagger animation
5. Use `toast()` from `sonner` for user feedback
6. Page title pattern: `<h1>Page <span className="text-gold-shimmer">Title</span></h1>`

## Adding New API Endpoints

1. Add/update model in `backend/app/models/`
2. Add schema in `backend/app/schemas/`
3. Add route function in appropriate `backend/app/routers/` file
4. Register router in `backend/main.py` if new file
5. Run `alembic revision --autogenerate -m "description"` then `alembic upgrade head`

## Deployment

- **Frontend:** Vercel — auto-deploys on push to `main` (env var `NEXT_PUBLIC_API_URL` → the Render backend URL). Live at `zariva-property-management.vercel.app`.
- **Backend:** Render (`zariva-backend.onrender.com`) — auto-deploys on push to `main`. Env vars: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS=<vercel-url>`, `ENVIRONMENT=production`. The `backend/Dockerfile` CMD runs `alembic upgrade head` before starting uvicorn, so migrations apply automatically on deploy. (Migrated off Koyeb; the old `fly.toml` was removed.)
- **Database:** Neon (serverless PostgreSQL, eu-west-2).

Branching: `feature/*` → `develop` → `main`. **Push to `main` triggers production deploys on BOTH Vercel (frontend) and Render (backend)** — a backend push with a new Alembic migration self-applies via the Dockerfile CMD.

### Hosting cost plan

Full breakdown in `HOSTING_COST_BREAKDOWN.md`. Current state: all infra is on free tiers except the domain.

- **Domain:** buy via Cloudflare Registrar (wholesale pricing, no renewal markup — `.com` is $10.44/yr flat forever).
- **Frontend:** Vercel Hobby is $0/mo but its terms are non-commercial — since Zariva is a paying business, budget for **Vercel Pro ($20/mo)** once revenue/scale justifies compliance.
- **Backend:** now on **Render free Hobby tier** ($0/mo, cold starts on wake). Migrated off Koyeb. If cold starts become a problem, **Railway (~$5/mo, no cold starts)** is the fallback.
- **Database:** Neon free tier (100 CU-hrs/mo, 0.5GB storage) covers current usage; paid tiers start at $5/mo minimum if exceeded.
- Realistic cost today: ~$10/year (domain only). Worst-case if everything needs to go paid: ~$26-31/mo.

#### Domain name search status (as of 2026-06-16)

- `zariva.com` — taken, not available.
- `zarivaproperties.com` — **available**, $11.25/yr (checked via Vercel domain API).
- `zariva.africa` / `zariva.co.ke` — not checked yet; Vercel's domain API doesn't support these TLDs. Need to check directly via a `.africa` registrar (e.g. registry.africa, Nescom) and a `.co.ke` registrar (e.g. KENIC, Truehost).
- Decision pending — next session should either confirm `.africa`/`.co.ke` availability or proceed with `zarivaproperties.com`.

## Completed Work (as of May 2026)

### UI/UX Polish — all merged to main
- **Auth pages** (`/login`, `/signup`): Dark split-panel redesign — left `#0D2818` aurora panel, right white form card. Brand-consistent buttons and inputs.
- **404 page**: Dark brand theme, gold-shimmer 404 number.
- **Landing page** (`/`): Mobile hamburger nav with AnimatePresence drawer. Fixed Tailwind v4 gradient classes.
- **Sidebar**: Shows logged-in user's name, role badge, and avatar initials via `useAuth()`.
- **Settings pages** (landlord + tenant): Responsive mobile layout — `flex-col md:flex-row`.
- **StatCard**: Visually distinct variants with tinted gradient backgrounds and coloured left accent bars.
- **All data tables** (tenant dashboard, property detail, tenant requests): Responsive — `hidden md:table` + `md:hidden` mobile card views.
- **Login logo**: Enlarged from `h-20` to `h-28` with `max-w-55` cap for better visual balance.
- **Tenant consent/requests page** (`/tenant/requests`): Full redesign — 3 summary stat cards, full-width underline tabs, slide-over form drawer with brand inputs, rich request cards with status accent bars, actionable empty states.

### Consent Management — backend + frontend
- Database models, Alembic migration, FastAPI router for sublet, alteration, and pet consent requests.
- Tenant `ConsentModal` for first-login data consent (Kenya DPA compliant).
- Public `/privacy` page.
- Landlord `/landlord/requests` page for reviewing incoming consent requests.

### Onboarding — real signup + join/first-run flows (2026-07)
- **Signup wired for real** — `signup/page.tsx` calls `POST /auth/register` for both roles (was a stub); `lib/auth.ts` gained `register()`.
- **Tenant "join a property"** — self-signup model: tenant searches by property name/landlord email → requests to join → landlord approves (assigning a vacant unit + lease terms) → lease created, tenant's dashboard goes live. New `join_requests` table + `/join-requests` router; `JoinProperty` component + "Join Requests" tab on `/landlord/requests`.
- **Landlord first-run** — fresh landlord (0 properties) sees a welcome hero + setup checklist; `AddPropertyModal` creates a property and its units. A new property is immediately discoverable by tenants, closing the onboarding loop.
