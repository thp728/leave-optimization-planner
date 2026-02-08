# Design Tokens

All tokens are defined in `apps/web/src/routes/layout.css` using Tailwind v4's `@theme` directive. Each token automatically generates Tailwind utility classes.

---

## Colors

### Primary (Deep Blue)

Used for primary actions, links, focus rings, and active states.

| Token | oklch Value | Hex Approx. | Tailwind Utilities | Usage |
|---|---|---|---|---|
| `--color-primary-50` | `oklch(0.97 0.01 250)` | #EFF6FF | `bg-primary-50` | Hover backgrounds, selected row |
| `--color-primary-100` | `oklch(0.93 0.03 250)` | #DBEAFE | `bg-primary-100` | Active backgrounds, selection highlight |
| `--color-primary-200` | `oklch(0.87 0.06 250)` | #BFDBFE | `bg-primary-200` | Light accent areas |
| `--color-primary-300` | `oklch(0.78 0.10 250)` | #93C5FD | `bg-primary-300` | — |
| `--color-primary-400` | `oklch(0.68 0.15 250)` | #60A5FA | `bg-primary-400` | — |
| `--color-primary-500` | `oklch(0.55 0.20 250)` | #2563EB | `bg-primary-500` | **Primary buttons, links, focus rings** |
| `--color-primary-600` | `oklch(0.48 0.20 250)` | #2556D1 | `bg-primary-600` | Button hover |
| `--color-primary-700` | `oklch(0.42 0.18 250)` | #1D4ED8 | `bg-primary-700` | Button active/pressed |
| `--color-primary-800` | `oklch(0.35 0.15 250)` | #1E3A8A | `bg-primary-800` | — |
| `--color-primary-900` | `oklch(0.28 0.12 250)` | #1E3A5F | `bg-primary-900` | — |
| `--color-primary-950` | `oklch(0.20 0.08 250)` | #172554 | `bg-primary-950` | — |

### Accent (Teal)

Used for secondary actions, highlights, accents, and visual interest.

| Token | oklch Value | Hex Approx. | Tailwind Utilities | Usage |
|---|---|---|---|---|
| `--color-accent-50` | `oklch(0.97 0.02 175)` | #F0FDFA | `bg-accent-50` | Light teal backgrounds |
| `--color-accent-100` | `oklch(0.93 0.04 175)` | #CCFBF1 | `bg-accent-100` | Accent highlights |
| `--color-accent-200` | `oklch(0.87 0.08 175)` | #99F6E4 | `bg-accent-200` | — |
| `--color-accent-300` | `oklch(0.78 0.12 175)` | #5EEAD4 | `bg-accent-300` | — |
| `--color-accent-400` | `oklch(0.70 0.14 175)` | #2DD4BF | `bg-accent-400` | — |
| `--color-accent-500` | `oklch(0.60 0.15 175)` | #0D9488 | `bg-accent-500` | **Accent buttons, highlights** |
| `--color-accent-600` | `oklch(0.53 0.13 175)` | #0F766E | `bg-accent-600` | Accent hover |
| `--color-accent-700` | `oklch(0.47 0.11 175)` | #115E59 | `bg-accent-700` | Accent active |
| `--color-accent-800` | `oklch(0.40 0.09 175)` | #134E4A | `bg-accent-800` | — |
| `--color-accent-900` | `oklch(0.33 0.07 175)` | #042F2E | `bg-accent-900` | — |
| `--color-accent-950` | `oklch(0.25 0.05 175)` | #021716 | `bg-accent-950` | — |

### Semantic Status Colors

Shades 50, 100, 500, and 700 are defined for each. Extend as needed.

| Color | Token (500) | oklch | Hex Approx. | Usage |
|---|---|---|---|---|
| **Success** | `--color-success-500` | `oklch(0.72 0.17 160)` | #10B981 | Valid inputs, confirmations |
| **Warning** | `--color-warning-500` | `oklch(0.80 0.16 85)` | #F59E0B | Caution states, expiry warnings |
| **Error** | `--color-error-500` | `oklch(0.64 0.22 25)` | #EF4444 | Validation errors, destructive actions |

Each also includes:
- `*-50`: Light background tint (for banners, toast backgrounds)
- `*-100`: Slightly stronger tint
- `*-700`: Dark variant (for text on light tint backgrounds)

### Surface & Neutral Colors

| Token | oklch Value | Hex Approx. | Usage |
|---|---|---|---|
| `--color-surface` | `oklch(0.985 0 0)` | #FAFAFA | App background |
| `--color-surface-raised` | `oklch(1 0 0)` | #FFFFFF | Cards, raised surfaces |
| `--color-surface-overlay` | `oklch(0.97 0 0)` | #F5F5F5 | Table headers, hover backgrounds |
| `--color-border` | `oklch(0.91 0 0)` | #E5E7EB | Default borders |
| `--color-border-strong` | `oklch(0.82 0 0)` | #D1D5DB | Emphasized borders |
| `--color-text-primary` | `oklch(0.15 0 0)` | #111827 | Main body text |
| `--color-text-secondary` | `oklch(0.45 0 0)` | #6B7280 | Secondary/muted text |
| `--color-text-tertiary` | `oklch(0.62 0 0)` | #9CA3AF | Placeholders, hints |
| `--color-text-inverse` | `oklch(1 0 0)` | #FFFFFF | Text on dark backgrounds |

### Calendar Day Type Colors

Each day type has a background and foreground text pair.

| Day Type | Background Token | Text Token | Bg Hex Approx. | Text Hex Approx. |
|---|---|---|---|---|
| **Workday** | `--color-cal-workday` | `--color-cal-workday-text` | #FFFFFF | #111827 |
| **Weekend** | `--color-cal-weekend` | `--color-cal-weekend-text` | #F3F4F6 | #6B7280 |
| **Holiday** | `--color-cal-holiday` | `--color-cal-holiday-text` | #DBEAFE | #2563EB |
| **PTO** | `--color-cal-pto` | `--color-cal-pto-text` | #FEE2E2 | #DC2626 |
| **Casual** | `--color-cal-casual` | `--color-cal-casual-text` | #FEF3C7 | #A16207 |
| **Sick** | `--color-cal-sick` | `--color-cal-sick-text` | #D1FAE5 | #15803D |

**Usage in components**: `class="bg-cal-pto text-cal-pto-text"`

---

## Typography

### Font Family

| Token | Value | Tailwind Utility |
|---|---|---|
| `--font-sans` | `'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif` | `font-sans` |
| `--font-mono` | `ui-monospace, 'Cascadia Code', 'Fira Code', monospace` | `font-mono` |

### Font Weights

Inter is self-hosted at these weights:

| Weight | Name | Usage |
|---|---|---|
| 400 | Regular | Body text, descriptions |
| 500 | Medium | Labels, captions, subtle emphasis |
| 600 | Semibold | Section headers, page titles, button text |
| 700 | Bold | Strong emphasis, large numbers in stats |

### Font Size Scale

| Token | Size | Line Height | Tailwind Utility | Usage |
|---|---|---|---|---|
| `--text-xs` | 0.75rem (12px) | 1rem | `text-xs` | Labels, captions, fine print |
| `--text-sm` | 0.875rem (14px) | 1.25rem | `text-sm` | Form labels, secondary body text |
| `--text-base` | 1rem (16px) | 1.5rem | `text-base` | Primary body text |
| `--text-lg` | 1.125rem (18px) | 1.75rem | `text-lg` | Section headers (small) |
| `--text-xl` | 1.25rem (20px) | 1.75rem | `text-xl` | Section headers |
| `--text-2xl` | 1.5rem (24px) | 2rem | `text-2xl` | Page titles (mobile), stat values |
| `--text-3xl` | 1.875rem (30px) | 2.25rem | `text-3xl` | Page titles (desktop) |
| `--text-4xl` | 2rem (32px) | 2.5rem | `text-4xl` | Hero/display titles |

### Heading Hierarchy

| Element | Size | Weight | Utility Classes |
|---|---|---|---|
| `h1` | `text-3xl` | `font-semibold` | `text-3xl font-semibold text-text-primary` |
| `h2` | `text-xl` | `font-semibold` | `text-xl font-semibold text-text-primary` |
| `h3` | `text-lg` | `font-semibold` | `text-lg font-semibold text-text-primary` |

---

## Spacing

**Base unit**: `--spacing: 0.25rem` (4px)

All spacing utilities are multiples of this base. The design follows an 8px grid system, achieved at every even step.

| Utility | Value | Pixels | Common Usage |
|---|---|---|---|
| `p-1` / `m-1` / `gap-1` | 0.25rem | 4px | Tight spacing (icon padding) |
| `p-2` / `m-2` / `gap-2` | 0.5rem | 8px | Base grid unit, compact spacing |
| `p-3` / `m-3` / `gap-3` | 0.75rem | 12px | Form input padding |
| `p-4` / `m-4` / `gap-4` | 1rem | 16px | Standard card padding, section gaps |
| `p-6` / `m-6` / `gap-6` | 1.5rem | 24px | Generous card padding |
| `p-8` / `m-8` / `gap-8` | 2rem | 32px | Section spacing |
| `p-12` / `m-12` / `gap-12` | 3rem | 48px | Large section gaps |
| `p-16` / `m-16` / `gap-16` | 4rem | 64px | Page-level spacing |

**Max content width**: `max-w-7xl` (1280px) — close to the 1200px target from design brief.

---

## Border Radius

| Token | Value | Pixels | Tailwind Utility | Usage |
|---|---|---|---|---|
| `--radius-xs` | 0.125rem | 2px | `rounded-xs` | Subtle rounding |
| `--radius-sm` | 0.25rem | 4px | `rounded-sm` | Inputs, small elements |
| `--radius-md` | 0.375rem | 6px | `rounded-md` | Buttons, dropdowns |
| `--radius-lg` | 0.5rem | 8px | `rounded-lg` | Cards, modals |
| `--radius-xl` | 0.75rem | 12px | `rounded-xl` | Large containers |
| `--radius-2xl` | 1rem | 16px | `rounded-2xl` | Hero elements |
| `--radius-full` | 9999px | — | `rounded-full` | Pills, avatars, circles |

---

## Shadows

Elevation hierarchy for layered UI:

| Token | Tailwind Utility | Usage |
|---|---|---|
| `--shadow-xs` | `shadow-xs` | Inputs, subtle depth |
| `--shadow-sm` | `shadow-sm` | Cards at rest, badges |
| `--shadow-md` | `shadow-md` | Cards on hover, dropdowns |
| `--shadow-lg` | `shadow-lg` | Tooltips, popovers |
| `--shadow-xl` | `shadow-xl` | Modals, dialogs |

Values use `oklch(0 0 0 / opacity)` for consistent shadow color:

```css
--shadow-xs: 0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.06);
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.06);
--shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.05);
--shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.04);
```

---

## Animations & Transitions

### Easing Curves

| Token | Value | Tailwind Utility | Usage |
|---|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-smooth` | General transitions (hover, color changes) |
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | `ease-snappy` | Entrances, scale changes, emphasis |

### Keyframe Animations

| Animation | Token | Duration | Usage |
|---|---|---|---|
| `fade-in` | `--animate-fade-in` | 200ms | Tooltips, toasts appearing |
| `slide-up` | `--animate-slide-up` | 300ms | Modals, panels entering |
| `spin` | `--animate-spin` | 1000ms (loop) | Loading spinners |
| `pulse` | `--animate-pulse` | 2000ms (loop) | Skeleton loaders |

### Transition Durations

For micro-interactions, use `duration-150` (fast hover) to `duration-300` (smooth transitions). The design brief specifies 300-400ms for plan transitions.

---

## Responsive Breakpoints

Using Tailwind's default breakpoints:

| Breakpoint | Min Width | Design Brief | Layout |
|---|---|---|---|
| (default) | 0px | Mobile (<768px) | Single column, simplified calendar |
| `md:` | 768px | Tablet (768-1024px) | Calendar stacks above summary |
| `lg:` | 1024px | Desktop (>1024px) | Full split view (60/40) |
