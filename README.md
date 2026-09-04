# Luke Brannagan

Ultra-minimal personal site — Astro + Nx, with a shared design system and content library.

Inspired by sparse, typography-first portfolios (e.g. [kshv.me](https://www.kshv.me/), [marcelochaman.com](https://marcelochaman.com/)).

## Structure

```text
apps/site/                 # Astro application
libs/design-system/        # Tokens + Lit custom elements (ds-*)
libs/content/              # Site copy, projects, experience, helpers + Vitest
```

## Commands

| Command | Action |
| --- | --- |
| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Dev server (`nx dev site`) |
| `bun run build` | Production build |
| `bun run test` | Vitest |
| `bun run lint` | Biome check |
| `bun run lint:fix` | Biome autofix |
| `bun run check` | Lint + test + typecheck + build |

## Design system

Tokens live in `libs/design-system/src/tokens`. Lit custom elements (`ds-*`) are registered from `@lukebrannagan/design-system`.

## Content

Copy is in `libs/content` (ported from the previous portfolio). Pure helpers like `formatTenure` and `readingTimeLabel` are covered by Vitest.
