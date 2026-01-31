# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Development server with Turbopack
bun run build        # Production build
bun run lint         # ESLint with zero warnings allowed
bun run lint:fix     # Auto-fix lint issues

# Database (Prisma)
bun run db.generate  # Generate new migration (interactive)
bun run db.migrate   # Apply pending migrations
bun run db.reset     # Reset database to fresh state
```

## Architecture

### Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19** with Server Components by default
- **TypeScript 5.9** with strict mode
- **Prisma 7** with PostgreSQL (multi-schema: `public`, `authentication`, `beer_data`)
- **Better-Auth** for authentication
- **next-intl** for i18n (English, French)
- **Tailwind CSS 4** with Radix UI components
- **Conform.js + Zod** for form handling/validation

### Directory Structure

```
/src
  /app/[locale]              # Locale-based routing
    /(auth)                  # Auth routes (sign-in, sign-up, password reset)
    /(business)
      /(with-header)         # Pages with shared header layout
      /(without-header)      # Form pages without header
    /api                     # API routes
  /app/_components           # Shared components (form/, ui/, icons/)
  /domain                    # Business logic (server-only)
    /{entity}/index.ts       # Query/mutation functions
    /{entity}/transforms.ts  # Raw DB → typed model transforms
    /{entity}/types.ts       # Domain type definitions
    /{entity}/errors.ts      # Custom error classes
  /lib                       # Shared utilities
    /auth                    # Better-Auth setup & getCurrentUser()
    /i18n                    # Internationalization & navigation exports
    /prisma                  # Database client & transaction helper
    /routes                  # Typed route constants (Routes.BEER, etc.)
    /action/types.ts         # ActionResult<T> type for server actions
    /storage                 # S3 file upload/delete
    /email                   # React Email templates + Resend
/prisma/schema               # Multi-file Prisma schema
```

### Key Patterns

**Server Actions**: Located in `actions.ts` files next to pages. Use Conform's `parseWithZod` for validation, return `submission.reply()` with i18n translation keys for errors.

**Domain Layer**: All database queries live in `/domain/{entity}/index.ts`. Functions are wrapped with `cache()` for request deduplication when they're used multiple times inside a request (ie: page content + generateMetadata). Always use `transformRaw*` functions to convert Prisma results to domain types.

**Transactions**: Use `getPrismaTransactionClient()` for multi-query transactions:

```ts
const [a, b] = await getPrismaTransactionClient()(async (tx) =>
  Promise.all([tx.model.findMany(...), tx.model.count(...)])
);
```

**ActionResult Type**: Server actions returning data use:

```ts
type ActionResult<T> =
  | { success: true; data?: T }
  | { success: false; translationKey: MessageKeys };
```

**Navigation/Links**: Always import from `@/lib/i18n`, never from `next/link` or `next/navigation` directly (enforced by ESLint).

**Routes**: Use typed constants from `@/lib/routes`:

```ts
import { Routes } from "@/lib/routes";
// Routes.BEER = "/breweries/:brewerySlug/beers/:beerSlug"
```

**Import Aliases**:

- `@/*` → `./src/*`
- `@db/*` → `./prisma/schema/generated/*`

### Import Order (enforced)

1. Built-in/external packages
2. `@db/*` imports
3. `@/*` imports
4. Relative imports (parent imports forbidden)

### Database Notes

- Multi-schema setup: `public` (users, reviews, friends), `authentication` (Better-Auth tables), `beer_data` (beers, breweries, styles)
- IDs use nanoid, slugs generated via `slugify(id, name)`

## Other instructions

- Always use bun commands, never npm or pnpm.
- If needing to verify the state of the project, you can run `bunx tsc` to check the types.
- If needing to test your changes on a browser, assume I already have a development server running and directly open http://localhost:3000.
- Never add comments to your generated code, except if it is explicitly asked for or if it is hard to understand and needs one.
