# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Monorepo

Bun workspaces + Turborepo.

- `apps/mobile` — Expo app (`@blink/mobile`)
- `apps/backend` — Hono API server (`@blink/backend`), port 3000, mounted shared routes from `@blink/api`
- `packages/api` — zod schemas + shared Hono routes + `AppType` (used for type-safe RPC via `hono/client`)
- `packages/theme` — consolidated design tokens (colors, fonts, radii, spacing, type, shadows)

Commands from the root: `bun run dev`, `bun run typecheck`, `bun run lint`.