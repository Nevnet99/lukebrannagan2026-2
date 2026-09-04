# Design system

Ultra-minimal tokens and primitives for the site.

## Structure

```text
src/
├── tokens/       # colors, typography, spacing
├── styles/       # reset + global
└── components/   # Container, Stack, Text, Link, Rule, SkipLinks
```

Import global styles from the Astro layout:

```astro
import "@lukebrannagan/design-system/styles/global.css";
```

Import components by path (Astro):

```astro
import Text from "@lukebrannagan/design-system/components/Text.astro";
```
