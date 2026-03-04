# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint
npm run start        # Start production server

# Database
npx prisma migrate dev --name <migration_name>   # Create migration
npx prisma generate                               # Regenerate Prisma client
npx prisma db push                                # Push schema without migration
```

## Architecture

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript, deployed on Vercel.

**What this app does**: A todo-list app for organizing LeetCode problems. Users authenticate via GitHub OAuth, manage todos with dates/tags/difficulty, and track completion. A daily cron job fetches LeetCode's "question of the day" via their GraphQL API and stores the ID in Vercel Edge Config.

### Rendering & Routing

- Uses Next.js App Router with hybrid server/client components
- `@todos/` is a **parallel route** slot — the root layout receives `{ children, todos }` props
- Server components (`page.tsx`, `TopBar/index.tsx`) fetch session/data; all interactive UI is `"use client"`

### State Management — Jotai

All client state lives in Jotai atoms (`src/state/index.ts`). Key atoms:
- `todosAtom` — the core todo list
- `filteredTodosAtom` — derived atom applying tag/difficulty/state filters
- `selectedFiltersAtom` — contains `Set` objects for each filter dimension

**Hydration**: `src/components/InitialLoad.tsx` uses `useHydrateAtoms` to seed atoms with server-fetched data on initial load.

**Auto-save**: A 2-second debounced effect in `src/components/Todos/index.tsx` watches `todosAtom` and calls the `saveTodo` server action for authenticated users.

### Data Layer

- **Prisma + MySQL**. Schema in `prisma/schema.prisma`
- Todos are stored as a **JSON column** on the User model (not a separate table) — the entire array is serialized/deserialized as one blob
- Server actions in `src/actions/problems.ts` handle search (Fuse.js), persistence, and user settings
- `src/db/User.ts` contains user CRUD; `src/db/prisma.ts` is the client singleton

### Auth

Custom GitHub OAuth using the **Arctic** library (not NextAuth). Flow:
- `/api/login/github` → GitHub → `/api/login/github/callback`
- Sessions: 30-day expiry with rolling extension (see `src/lib/auth.ts`)
- Middleware (`middleware.ts`) extends session cookies on GET and validates CSRF on non-GET

### UI & Styling

- **shadcn/ui** components in `src/components/ui/` (New York style, zinc base color)
- Tailwind CSS with HSL CSS variable theming; dark mode via `next-themes`
- Custom `Chip` component (`src/components/ui/chip.tsx`) with CVA variants for difficulty colors
- Animations via `motion` (Framer Motion), respecting `disableAnimations` user preference

### Component Organization

Feature-based directories with `index.tsx` barrel files:
- `Todos/` — main list, item, add, column header, tags
- `BoardSettings/` — settings dropdown (show tags, collapse, layout, animations)
- `Filter/` — filter button + animated chip list
- `TopBar/` — server component with user dropdown

### Key Types

Core types in `src/app/types.ts`: `TodoItem`, `Question`, `QuestionDifficulty` ("Easy" | "Medium" | "Hard"), `FilterType`, `FilterState` ("done" | "future" | "inProgress"), `PreparedUser`.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Environment Variables

`DATABASE_URL`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `EDGE_CONFIG`, `VERCEL_API_TOKEN`, `CRON_SECRET`
