# Site (`apps/site`)

Astro app for lukebrannagan.com.

## Layout

```text
src/
├── components/     # one folder per UI unit
│   ├── SeriesStack/
│   │   ├── SeriesStack.astro
│   │   ├── SeriesStack.stories.ts
│   │   └── series-stack.ts      # Storybook helper
│   ├── Shell/                   # chrome stories + mirrored CSS
│   └── …
├── sections/       # page-section Storybook compositions
│   └── Home/
├── layouts/
├── pages/
├── scripts/        # client islands (filters, 3D, analytics)
├── styles/
└── content/        # writing collection
```

New UI: add a folder under `components/` (or `sections/` for page-only compositions). Colocate stories and any Storybook-only helpers with that folder. See the root README **Component layout** section.
