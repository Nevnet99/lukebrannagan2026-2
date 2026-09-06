# Luke Brannagan

Personal site: selected work, writing, and a small Lit design system.

Stack: Astro 6 + Nx + Bun. Tokens and primitives in `libs/design-system`. Typed copy and helpers in `libs/content`.

## Structure

```text
apps/site/                 # Astro application
libs/design-system/        # Tokens + Lit custom elements (ds-*)
libs/content/              # Site copy, projects, series, helpers + Vitest
```

## Component layout

UI units live in a **folder per component**. Keep the implementation, Storybook stories, Storybook helpers, and tests together.

```text
NameOfComponent/
  NameOfComponent.astro   # or name.ts for Lit
  NameOfComponent.stories.ts
  NameOfComponent.test.ts # when there are unit tests
  helper.ts               # optional Storybook / shared render helpers
  index.ts                # Lit barrels only
```

Examples:

- Design system: `libs/design-system/src/components/BreadCrumb/`
- Site: `apps/site/src/components/SeriesStack/`
- Foundations (tokens, not components): `libs/design-system/src/foundations/`
- Page sections (composition stories): `apps/site/src/sections/Home/`

Do not leave root-level `*.stories.ts` or `*.test.ts` next to a component that already has a folder. Helpers that only exist for Storybook should sit in that component folder, not a shared `storybook/` dump.

More detail: `apps/site/README.md` and `libs/design-system/README.md`.

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Dev server (`nx dev site`) |
| `bun run build` | Fill missing book covers (skip existing), then production build |
| `bun run preview` | Preview the production build |
| `bun run test` | Vitest |
| `bun run lint` | Biome check |
| `bun run check` | Lint + test + typecheck + build |
| `bun run fetch-book-covers` | Download only missing covers (`-- --force` to refresh all) |
| `bun run storybook:site` | Site Storybook |
| `bun run storybook:design-system` | Design-system Storybook |

## Deploy

Static output lives in `dist/apps/site`. Point any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, …) at that directory after `bun run build`.

Optional build-time env (see `.env.example`):

- `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` — analytics (off when the key is empty)
- `PUBLIC_AMAZON_ASSOCIATE_TAG` — overrides the default Associates tag for book links

## Design system

Tokens live in `libs/design-system/src/tokens` (Mist neutrals, Tide accent, light default + dark theme). Lit elements (`ds-*`) are registered from `@lukebrannagan/design-system`. See `libs/design-system/README.md` for element docs and the same folder convention.

## Content

Writing is an Astro content collection under `apps/site/src/content/writing`. Work case studies and site chrome copy live in `libs/content`. Helpers such as reading time, related posts, and topic labels are covered by Vitest (tests sit next to the module under `libs/content/src/`).

Unfinished book-review stubs stay `listed: false` / `to-be-reviewed` and are omitted from the public site until published.
