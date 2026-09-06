# Luke Brannagan

Personal site: selected work, writing, and a small Lit design system.

Stack: Astro 6 + Nx + Bun. Tokens and primitives in `libs/design-system`. Typed copy and helpers in `libs/content`.

## Structure

```text
apps/site/                 # Astro application
libs/design-system/        # Tokens + Lit custom elements (ds-*)
libs/content/              # Site copy, projects, series, helpers + Vitest
```

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Dev server (`nx dev site`) |
| `bun run build` | Production build → `dist/apps/site` |
| `bun run preview` | Preview the production build |
| `bun run test` | Vitest |
| `bun run lint` | Biome check |
| `bun run check` | Lint + test + typecheck + build |
| `bun run storybook:site` | Site Storybook |
| `bun run storybook:design-system` | Design-system Storybook |

## Deploy

Static output lives in `dist/apps/site`. Point any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, …) at that directory after `bun run build`.

Optional build-time env (see `.env.example`):

- `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` — analytics (off when the key is empty)
- `PUBLIC_AMAZON_ASSOCIATE_TAG` — overrides the default Associates tag for book links

## Design system

Tokens live in `libs/design-system/src/tokens` (Mist neutrals, Tide accent, light default + dark theme). Lit elements (`ds-*`) are registered from `@lukebrannagan/design-system`.

## Content

Writing is an Astro content collection under `apps/site/src/content/writing`. Work case studies and site chrome copy live in `libs/content`. Helpers such as reading time, related posts, and topic labels are covered by Vitest.

Unfinished book-review stubs stay `listed: false` / `to-be-reviewed` and are omitted from the public site until published.
