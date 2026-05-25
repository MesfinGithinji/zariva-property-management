# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zariva Property Management System — a premium property management platform for Zariva Africa Properties Ltd (Kenya). Brand identity: dark forest green (`#1A3626`) + warm gold (`#C9A843`). Logo at `frontend/public/logo_transparent.png`.

Two portals:
- **Landlord** (`/landlord/*`) — dashboard, properties, tenants, maintenance, finance, settings
- **Tenant** (`/tenant/*`) — dashboard, payments, maintenance, documents, settings

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

**Routing pattern:** Every portal route uses the same shell — `"use client"`, `<Sidebar />` with `ml-72` offset, then page content in `FadeCard` wrappers with Framer Motion.

**Shared component library** (`frontend/components/ui/`):
- `StatCard` — animated CountUp metric tile, `variant` prop: `"green" | "gold" | "neutral"`
- `StatusBadge` — unified pill for all status types (lease, payment, maintenance, priority, occupancy)
- `FadeCard` — motion wrapper with stagger `delay` prop
- `PageHeader` — title + gold shimmer name display
- `Button` — CVA variants: `default | outline | ghost | destructive | link`
- `Skeleton` — loading placeholder

**State:** All pages currently consume `frontend/lib/mock-data.ts` (no live API calls yet). The `AuthContext` (`frontend/context/auth-context.tsx`) and `frontend/lib/auth.ts` / `frontend/lib/api.ts` are wired but pages still use mock data — P5 integration work connects them.

**API client** (`frontend/lib/api.ts`): `api.get/post/patch/delete` — reads `NEXT_PUBLIC_API_URL` env var, attaches JWT from `localStorage["zariva_token"]` automatically.

**Styling:**
- Tailwind v4 — uses `@import "tailwindcss"` + `@config` directive, NOT the v3 `tailwind()` plugin pattern
- `postcss.config.mjs` must use `"@tailwindcss/postcss": {}` (not `tailwindcss: {}`)
- Custom palette loaded from `tailwind.config.ts`: `primary-950` (#1A3626), `gold-500` (#C9A843), `cream`
- `.text-gold-shimmer` — animated gradient sweep on key headings (defined in `globals.css`)
- `.num` — tabular-nums class for KES values

**Animations:** Framer Motion throughout. Standard easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, minimum 200ms transitions. Page-level transitions via `app/template.tsx` (fade + slide on every route change). Sidebar active pill uses `layoutId` spring.

**Dark surfaces (portal backgrounds):**
- Sidebar: `#0D2818`
- Page backgrounds: `#1A3626`
- Glass cards: `rgba(255,255,255,0.06)` + `border-gold/20`
- Content cards: white

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
    models/            # SQLAlchemy ORM models
    schemas/           # Pydantic request/response schemas
    routers/           # auth, properties, units, tenants, leases, payments, maintenance
```

**Auth flow:** JWT HS256, token in `Authorization: Bearer <token>` header. `get_current_user` → `require_landlord` / `require_tenant` FastAPI dependencies guard routes by role.

**Config:** All settings read from environment / `.env` file via `app/core/config.py`. Key vars: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`, `ENVIRONMENT`.

**Migrations:** Alembic reads `DATABASE_URL` from `settings` at runtime (set in `alembic/env.py`). All models must be imported in `alembic/env.py` to be picked up by autogenerate.

**Demo credentials:**
- Landlord: `matty@zariva.com` / `zariva123`
- Tenant: `john.kamau@email.com` / `tenant123`

## Adding New Pages

Follow the established pattern:
1. Create `frontend/app/<portal>/<page>/page.tsx` with `"use client"` at top
2. Import `Sidebar`, `FadeCard`, `StatCard`, `StatusBadge` as needed
3. Data from `landlordData` or `tenantData` in `frontend/lib/mock-data.ts`
4. Wrap content sections in `<FadeCard delay={0.1 * index}>` for stagger animation
5. Use `toast()` from `sonner` for user feedback

## Adding New API Endpoints

1. Add/update model in `backend/app/models/`
2. Add schema in `backend/app/schemas/`
3. Add route function in appropriate `backend/app/routers/` file
4. Register router in `backend/main.py` if new file
5. Run `alembic revision --autogenerate -m "description"` then `alembic upgrade head`

## Deployment Target

- **Frontend:** Vercel (env var: `NEXT_PUBLIC_API_URL=<koyeb-url>`)
- **Backend:** Koyeb (env vars: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS=<vercel-url>`, `ENVIRONMENT=production`)
- **Database:** Neon (serverless PostgreSQL — `DATABASE_URL` connection string)

Branching: `feature/*` → `develop` → `main`. Push to `develop` triggers preview; `main` is production.
