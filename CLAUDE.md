# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript monorepo using **Turborepo** + **pnpm workspaces** with a NestJS backend and Next.js frontend.

## Commands

### Development
```bash
pnpm dev                  # Start all apps (backend :3000, frontend :3001)
docker compose up -d      # Start PostgreSQL and Redis (required for backend)
```

### Build & Quality
```bash
pnpm build                # Build all apps/packages
pnpm lint                 # Lint all apps/packages
pnpm check-types          # Type-check all apps/packages
pnpm format               # Prettier format all .ts/.tsx/.md files
```

### Database (Prisma)
```bash
pnpm db:migrate           # Run Prisma migrations (apps/backend)
pnpm db:studio            # Open Prisma Studio GUI
```

### Backend Testing
```bash
cd apps/backend
pnpm test                 # Run unit tests (Jest)
pnpm test -- --testPathPattern=<pattern>  # Run a single test file
pnpm test:watch           # Watch mode
pnpm test:cov             # Coverage report
pnpm test:e2e             # E2E tests (uses test/jest-e2e.json config)
```

## Architecture

### Monorepo Structure
- **apps/backend** — NestJS 11 API server (port 3000)
- **apps/frontend** — Next.js 16 with App Router (port 3001)
- **packages/ui** — Shared React component library (`@repo/ui`)
- **packages/eslint-config** — Shared ESLint flat configs (base, next, react-internal)
- **packages/typescript-config** — Shared tsconfig bases (base, react-library, nextjs)

### Backend (NestJS)
- **ORM**: Prisma 7 with PostgreSQL. Client is generated to `apps/backend/generated/prisma`.
- **Caching**: Redis via ioredis.
- **API Docs**: Swagger mounted at `/api`.
- **Logging**: nestjs-pino — pretty-printed in dev, structured JSON in production.
- **Tests**: Jest with ts-jest. Unit tests co-located as `*.spec.ts`; E2E tests in `test/` directory.

### Frontend (Next.js)
- **State management**: TanStack React Query (server state), Zustand (client state), Jotai (atomic state).
- **Styling**: Tailwind CSS 4 with shadcn/ui-compatible setup (see `components.json`). Uses `clsx` + `tailwind-merge` via a `cn()` utility.
- **Icons**: Lucide React.
- **Import alias**: `@/*` maps to the app root.

### Infrastructure
Docker Compose provides PostgreSQL 16 and Redis 7. Backend reads `DATABASE_URL` and `REDIS_HOST`/`REDIS_PORT` from environment variables (`.env` in `apps/backend/`).