# Design system (Lit)

Ultra-minimal tokens and Lit custom elements for the site.

## Structure

```text
src/
├── tokens/       # colors, typography, spacing
├── styles/       # reset + global
├── components/   # Lit elements (ds-*)
├── types.ts
└── index.ts      # registers all custom elements
```

## Usage

```astro
---
import "@lukebrannagan/design-system/styles/global.css";
---

<script>
  import "@lukebrannagan/design-system";
</script>

<ds-container>
  <ds-stack gap="lg">
    <ds-text as="h1" variant="display">Title</ds-text>
    <ds-link href="/work">Work</ds-link>
  </ds-stack>
</ds-container>
```

## Elements

| Tag | Role |
| --- | --- |
| `ds-container` | Page measure / gutters |
| `ds-stack` | Vertical stack (`gap`) |
| `ds-text` | Typed text (`as`, `variant`) |
| `ds-link` | Link (`href`, `external`, `current`) |
| `ds-rule` | Horizontal rule |
| `ds-skip-links` | Skip navigation |
