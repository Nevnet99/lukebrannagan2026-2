# Design system (Lit)

Ultra-minimal tokens and Lit custom elements for the site.

## Structure

```text
src/
├── tokens/       # colors (light/dark), typography, spacing
├── styles/       # fonts, reset, global
├── components/   # Lit elements (ds-*)
├── theme.ts      # light/dark helpers + boot script
├── types.ts
└── index.ts      # registers all custom elements
```

## Theme

Set `data-theme="light|dark"` on `<html>`. Persist with `localStorage` key `theme`.
Boot early via `themeBootScript` to avoid a flash. Toggle with `<ds-theme-toggle>`.
Theme changes suppress color transitions for one paint so the flip does not smear.

## Storybook

```sh
bun run storybook:design-system   # http://localhost:6006
bun run storybook:site            # http://localhost:6007
bun run build-storybook           # both static builds → dist/storybook/*
```

Design-system Storybook documents Lit primitives. Site Storybook documents shell and page sections with real content.

## Usage

```astro
---
import "@lukebrannagan/design-system/styles/global.css";
import { themeBootScript } from "@lukebrannagan/design-system/theme";
---

<html lang="en">
  <head>
    <script is:inline set:html={themeBootScript}></script>
  </head>
  <body>
    <script>
      import "@lukebrannagan/design-system";
    </script>

    <ds-container>
      <ds-stack gap="lg">
        <ds-text as="h1" variant="display">Title</ds-text>
        <ds-link href="/work">Work</ds-link>
        <ds-theme-toggle></ds-theme-toggle>
      </ds-stack>
    </ds-container>
  </body>
</html>
```

## Elements

| Tag | Role |
| --- | --- |
| `ds-container` | Page measure / gutters |
| `ds-stack` | Vertical stack (`gap`) |
| `ds-text` | Typed text (`as`, `variant`) |
| `ds-link` | Link (`href`, `external`, `current`) |
| `ds-rule` | Horizontal rule |
| `ds-icon` | Material Symbols glyph (`name`, optional `label`) |
| `ds-breadcrumb` | Trail for nested pages (`items` JSON / `.items`) |
| `ds-skip-links` | Skip navigation |
| `ds-switch` | Labeled checkbox switch (optional `icon` in the thumb) |
| `ds-theme-toggle` | Theme preference (`ds-switch` labeled Theme) |

## Icons

`<ds-icon>` uses Material Symbols Outlined (weight 400) as inline SVG — no icon font download.
Add glyphs in `src/icons.ts` from the [Material Symbols](https://fonts.google.com/icons) outlined set when you need a new name.

```html
<ds-icon name="dark_mode"></ds-icon>
<ds-icon name="light_mode" label="Light mode"></ds-icon>
```

Size with `--icon-size` (default `1.25rem`).

## Motion

Tokens in `tokens/motion.css`; keyframes in `styles/motion.css`. Motion is
opt-in via `prefers-reduced-motion: no-preference`.

| Token | Use |
| --- | --- |
| `--ease-out` | High-frequency interactive (color, opacity) |
| `--ease-emphasized` / `--ease-lift` | Surface lift + shadow settle |
| `--ease-enter` | Page / staged entrances (`ds-enter`) |
| `--ease-exit` | Soft exits |
| `--duration-fast` | ≤150ms color / opacity feedback |
| `--duration-lift` | Card raise |
| `--duration-enter` + `--stagger` | Page enter sequence |

Staggered page enter runs on main sections. Theme toggle uses icon cross-fade
and press scale (`0.96`). Links use named property transitions (≤150ms).
