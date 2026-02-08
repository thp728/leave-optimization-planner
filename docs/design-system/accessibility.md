# Accessibility Guidelines

WCAG AA compliance is the minimum standard for OffSeason. This document defines the accessibility requirements for every component in the design system.

---

## Core Requirements

### Color Contrast (WCAG 1.4.3 / 1.4.11)

| Requirement | Ratio | Applies To |
|---|---|---|
| Normal text (<18px regular, <14px bold) | 4.5:1 | Body text, labels, links |
| Large text (>=18px regular, >=14px bold) | 3:1 | Headings, large buttons |
| UI components & graphical objects | 3:1 | Borders, icons, focus indicators |

### Verified Color Pairs

| Foreground Token | Background Token | Contrast Ratio | Pass? |
|---|---|---|---|
| `--color-text-primary` | `--color-surface` | ~16:1 | AA |
| `--color-text-primary` | `--color-surface-raised` | ~18:1 | AA |
| `--color-text-secondary` | `--color-surface-raised` | ~5.5:1 | AA |
| `--color-text-tertiary` | `--color-surface-raised` | ~3.5:1 | AA large only |
| `--color-text-inverse` | `--color-primary-500` | ~5.5:1 | AA |
| `--color-cal-holiday-text` | `--color-cal-holiday` | >=4.5:1 | AA |
| `--color-cal-pto-text` | `--color-cal-pto` | >=4.5:1 | AA |
| `--color-cal-casual-text` | `--color-cal-casual` | >=4.5:1 | AA |
| `--color-cal-sick-text` | `--color-cal-sick` | >=4.5:1 | AA |

> **Note**: oklch values should be verified in-browser after implementation. Use the DevTools accessibility panel or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

---

## Keyboard Navigation

### General Principles

1. **All interactive elements must be focusable** via Tab key
2. **Focus order follows visual order** (left-to-right, top-to-bottom)
3. **Visible focus indicator** on every focusable element:
   ```
   focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2
   ```
4. **Skip link** as the first focusable element on every page, jumping to `#main-content`
5. **No keyboard traps** — users can always Tab away from any component

### Component-Specific Keyboard Patterns

| Component | Keys | Behavior |
|---|---|---|
| **Button** | `Enter`, `Space` | Activate |
| **Toggle** | `Enter`, `Space` | Toggle on/off |
| **Tabs** | `Arrow Left/Right` | Switch between tabs |
| **Tabs** | `Home`, `End` | Jump to first/last tab |
| **RadioGroup** | `Arrow Up/Down` | Move selection between options |
| **Select** | `Arrow Up/Down` | Navigate options |
| **Select** | `Enter` | Select highlighted option |
| **Select** | `Escape` | Close dropdown |
| **MultiSelect** | `Arrow Up/Down` | Navigate options |
| **MultiSelect** | `Space` | Toggle option selection |
| **MultiSelect** | `Escape` | Close dropdown |
| **Tooltip** | Focus trigger | Show tooltip |
| **Tooltip** | `Escape` | Hide tooltip |
| **Toast** | Tab to dismiss button | Focus dismiss action |
| **CalendarGrid** | `Arrow keys` | Navigate between days |
| **CalendarGrid** | `Enter`, `Space` | Select a day |
| **DatePicker** | Inherits from native `<input type="date">` | Browser-native behavior |
| **Stepper** | `Tab` | Move between completed steps |

---

## ARIA Patterns by Component

### Buttons

```html
<button type="button" aria-disabled="true">  <!-- use aria-disabled, not disabled, when you want focus -->
<button type="button" aria-busy="true">       <!-- loading state -->
```

### Toggle Switch

```html
<button role="switch" aria-checked="false" aria-label="Enable dark mode">
```
Reference: [WAI-ARIA Switch Pattern](https://www.w3.org/WAI/ARIA/apd/patterns/switch/)

### Tabs

```html
<div role="tablist" aria-label="Plan options">
  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">Plan 1</button>
  <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2">Plan 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>...</div>
```
Reference: [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apd/patterns/tabs/)

### Form Fields

```html
<label for="leave-name">Leave type name <span aria-hidden="true">*</span></label>
<input id="leave-name" type="text" required aria-describedby="leave-name-error" aria-invalid="true" />
<p id="leave-name-error" role="alert">Name is required</p>
```

### Progress Bar

```html
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="PTO usage">
```

### Calendar Day Cells

```html
<button aria-label="March 15, 2026 - PTO day" aria-pressed="false">15</button>
```

### Tooltip

```html
<div aria-describedby="tooltip-1">Trigger element</div>
<div id="tooltip-1" role="tooltip">Tooltip content</div>
```

### Toast Notifications

```html
<div aria-live="polite">  <!-- Container -->
  <div role="alert">Successfully saved plan.</div>
</div>
```

### Empty State

No special ARIA needed — use semantic HTML (`<h2>`, `<p>`). Ensure CTA buttons are properly labeled.

### Loading Spinner

```html
<div role="status" aria-label="Loading optimization results">
  <span class="sr-only">Loading optimization results</span>
  <!-- spinner visual -->
</div>
```

---

## Screen Reader Considerations

### Dynamic Content Announcements

Use `aria-live` regions for content that changes without page navigation:
- **Toast notifications**: `aria-live="polite"` on the container
- **Form validation errors**: `role="alert"` (implicitly `aria-live="assertive"`)
- **Optimization progress**: `aria-live="polite"` with status updates
- **Plan switching**: announce the new plan summary when tabs change

### Hidden Decorative Content

- Skeleton loaders: `aria-hidden="true"` (purely visual placeholders)
- Decorative icons: `aria-hidden="true"` on the SVG
- Informational icons: provide `aria-label` or pair with visible text

### Screen Reader Only Text

Use `sr-only` (Tailwind utility) for text that should only be read by screen readers:

```html
<button>
  <ChevronLeft aria-hidden="true" />
  <span class="sr-only">Previous month</span>
</button>
```

---

## Focus Management

### Skip Link

Every page must have a skip link as the first focusable element:

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 ...">
  Skip to main content
</a>
```

### Focus Restoration

When a modal/tooltip/dropdown closes, return focus to the trigger element.

### Focus Trapping (Modals)

If a modal is added in the future, trap focus within it while open. Use `inert` attribute on background content.

---

## Testing Checklist

Before shipping any component:

- [ ] Tab through the entire page — can you reach every interactive element?
- [ ] Is focus visible on every focusable element?
- [ ] Can you operate every control with keyboard only?
- [ ] Run axe DevTools or Lighthouse accessibility audit
- [ ] Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Verify color contrast with browser DevTools
- [ ] Check that all images/icons have text alternatives
- [ ] Ensure no content is conveyed by color alone
