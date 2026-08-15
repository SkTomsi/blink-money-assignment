# BlinkMoney — Wealth Circle

A polished React Native (Expo) prototype for a private social investing feature: users create circles with family, partners, or friends and build investing habits together — without pooling money.

## What's inside

- **Create Circle flow** — multi-step wizard (type, name, investment setup with SIP projection, member invites)
- **Circle check-ins** — daily check-in interactions with a celebration modal
- **Dashboard** — stats overview and navigation, plus a Learn More screen on Wealth Circle's principles
- **Mocked service layer** — services (circle, notifications, local db) + Zustand store that behave like an API, no backend required

## Monorepo structure

Bun workspaces + Turborepo.

- `apps/mobile` — the Expo app (`@blink/mobile`), Expo Router + NativeWind, design tokens from `@blink/theme`
- `packages/theme` — consolidated design tokens (colors, fonts, radii, spacing, type, shadows)

## Getting started

```sh
bun install
bun run dev:mobile   # start the Expo app
```

Web preview (works for a public link):

```sh
bunx expo export --platform web   # from apps/mobile → static output in dist/
```

## Commands (root)

```sh
bun run dev        # run all dev servers
bun run typecheck  # typecheck all packages
bun run lint       # lint all packages
```
