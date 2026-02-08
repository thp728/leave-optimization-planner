# OffSeason Design System

The design system for OffSeason — a leave optimization planner that helps employees maximize time off while minimizing paid leave usage.

---

## Design Principles

1. **Clean & Professional** — This is a productivity tool, not a content site. Keep the UI minimal and functional.
2. **Card-Based Layout** — Use cards to group related information with generous whitespace between sections.
3. **Progressive Disclosure** — Don't overwhelm. Show essential options first, advanced settings on demand.
4. **Transparent & Explainable** — Every recommendation should be accompanied by clear rationale.
5. **Accessible by Default** — WCAG AA compliance is mandatory, not optional. See [accessibility.md](accessibility.md).

---

## Architecture

```
Design Tokens (layout.css @theme)
        ↓
  Tailwind Utility Classes (auto-generated)
        ↓
  Svelte 5 Components (use utilities in class= attributes)
        ↓
  Page Compositions (routes)
```

### Token → Utility → Component Flow

Tokens are defined in `layout.css` using Tailwind v4's `@theme` directive. Each token in a recognized namespace (e.g., `--color-*`) automatically generates utility classes (e.g., `bg-primary-500`, `text-primary-500`).

Components consume tokens in two ways:
- **Tailwind utilities** in `class=""` attributes (preferred)
- **CSS custom properties** via `var(--color-primary-500)` in inline styles (for dynamic values)

Scoped `<style>` blocks are avoided. The only exception is `CalendarGrid`, which needs complex CSS Grid layout.

---

## Conventions

### Color Space

All color values use **oklch** for perceptual uniformity. The hex values in the design brief are converted to oklch equivalents. See [tokens.md](tokens.md) for the full mapping.

### Component Patterns (Svelte 5)

- **Props**: Define a `Props` interface, destructure with `$props()`
- **Content projection**: Use `Snippet` type and `{@render children()}` (not legacy slots)
- **Two-way binding**: Use `$bindable()` rune for form input values
- **Internal state**: Use `$state()` rune
- **Computed values**: Use `$derived()` rune
- **Event handlers**: Pass as props (`onclick`, `onchange`), not `createEventDispatcher`

### Icons

Using [Lucide](https://lucide.dev/) via `lucide-svelte`. Import icons individually for tree-shaking:

```svelte
<script lang="ts">
  import { ChevronLeft, ChevronRight, Calendar } from 'lucide-svelte';
</script>
```

### Typography

Font: Inter (self-hosted, woff2). Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

---

## File Map

| Purpose | Location |
|---|---|
| Design tokens | `apps/web/src/routes/layout.css` (`@theme` block) |
| Shared types | `apps/web/src/lib/types/components.ts` |
| UI primitives | `apps/web/src/lib/components/ui/` |
| Form components | `apps/web/src/lib/components/forms/` |
| Calendar components | `apps/web/src/lib/components/calendar/` |
| Data display | `apps/web/src/lib/components/data-display/` |
| Feedback components | `apps/web/src/lib/components/feedback/` |
| Barrel exports | `apps/web/src/lib/components/index.ts` |
| Font files | `apps/web/static/fonts/` |
| Showcase page | `apps/web/src/routes/design-system/+page.svelte` |

---

## How to Add a New Component

1. **Create the `.svelte` file** in the appropriate directory under `src/lib/components/`
2. **Define the `Props` interface** with TypeScript types and JSDoc comments
3. **Use `$props()`** to destructure props with sensible defaults
4. **Write semantic HTML** with Tailwind utility classes referencing `@theme` tokens
5. **Add ARIA attributes** — see [accessibility.md](accessibility.md) for patterns
6. **Add `// TODO:` comments** for any logic that needs implementation
7. **Export from the barrel** — add to the subdirectory's `index.ts` and to `components/index.ts`
8. **Add to the showcase page** — render the component in `/design-system` with all variants

---

## Related Documents

- [tokens.md](tokens.md) — Complete token reference (colors, typography, spacing, etc.)
- [components.md](components.md) — Component API reference (props, variants, usage examples)
- [accessibility.md](accessibility.md) — WCAG guidelines, ARIA patterns, keyboard navigation
- [../design-brief.md](../design-brief.md) — Original design brief with user flows and screen specs
- [../prd.md](../prd.md) — Product requirements document
