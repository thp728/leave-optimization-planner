# Component API Reference

All components live in `apps/web/src/lib/components/` and follow Svelte 5 patterns. Import via the barrel export:

```svelte
<script lang="ts">
  import { Button, Card, Badge } from '$lib/components';
</script>
```

---

## UI Primitives (`components/ui/`)

### Button

Primary interactive element for actions.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Variant` | `'primary'` | Visual style |
| `size` | `Size` | `'md'` | Dimensions and text size |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onclick` | `(e: MouseEvent) => void` | — | Click handler |
| `children` | `Snippet` | — | Button label content |

**Variants:**
- `primary` — `bg-primary-500 hover:bg-primary-600 text-text-inverse` — Main actions (Optimize, Save)
- `secondary` — `border border-border text-text-primary hover:bg-surface-overlay` — Secondary actions (Cancel, Export)
- `accent` — `bg-accent-500 hover:bg-accent-600 text-text-inverse` — Accent actions (highlights)
- `ghost` — `text-text-secondary hover:bg-surface-overlay` — Minimal actions (icon buttons, inline links)
- `success` / `warning` / `error` — Semantic status actions

**Sizes:**
- `sm` — `text-sm px-3 py-1.5` — Compact buttons in tables, cards
- `md` — `text-base px-4 py-2` — Standard buttons
- `lg` — `text-lg px-6 py-3` — Primary CTAs

**Usage:**
```svelte
<Button variant="primary" size="lg" onclick={handleOptimize}>
  Optimize Leave Plan
</Button>

<Button variant="secondary" loading={isSaving}>
  Save Configuration
</Button>
```

**Accessibility:** `aria-busy` when loading, `aria-disabled` when disabled, focus ring on focus-visible.

---

### Card

Container for grouping related content.

| Prop | Type | Default | Description |
|---|---|---|---|
| `padding` | `Size` | `'md'` | Inner padding scale |
| `shadow` | `boolean` | `true` | Whether to show shadow |
| `children` | `Snippet` | — | Card body content |
| `header` | `Snippet` | — | Optional header section |
| `footer` | `Snippet` | — | Optional footer section |

**Token usage:** `bg-surface-raised rounded-lg border border-border shadow-sm`

**Usage:**
```svelte
<Card>
  {#snippet header()}<h3>Leave Balance</h3>{/snippet}
  <p>You have 15 days remaining.</p>
  {#snippet footer()}<Button size="sm">View Details</Button>{/snippet}
</Card>
```

---

### Badge

Small label for status, categories, or counts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Variant` | `'primary'` | Color variant |
| `size` | `Size` | `'sm'` | Badge size |
| `children` | `Snippet` | — | Badge text |

**Usage:** `<Badge variant="success">Recommended</Badge>`

---

### Tooltip

Contextual information shown on hover/focus.

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | — | Tooltip content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Placement |
| `children` | `Snippet` | — | Trigger element |

**Accessibility:** Shows on focus (keyboard), hides on Escape. Uses `role="tooltip"` + `aria-describedby`.

---

### Tabs / Tab

Tabbed navigation for switching between views.

**Tabs Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `activeTab` | `string` | — | ID of active tab |
| `onchange` | `(tabId: string) => void` | — | Tab change handler |
| `children` | `Snippet` | — | Tab components |

**Tab Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique tab identifier |
| `label` | `string` | — | Tab button text |
| `children` | `Snippet` | — | Tab panel content |

**Usage:**
```svelte
<Tabs activeTab="plan1" onchange={setActivePlan}>
  <Tab id="plan1" label="Plan #1">Plan 1 details...</Tab>
  <Tab id="plan2" label="Plan #2">Plan 2 details...</Tab>
</Tabs>
```

**Accessibility:** `role="tablist"`, `role="tab"`, `role="tabpanel"`. Arrow keys to navigate tabs.

---

## Form Components (`components/forms/`)

### FormField

Wrapper that pairs a label with any input and handles error/hint display.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text |
| `id` | `string` | — | Links label to input via `for` attribute |
| `required` | `boolean` | `false` | Shows required indicator |
| `error` | `string` | — | Validation error message |
| `hint` | `string` | — | Helper text below input |
| `children` | `Snippet` | — | The input element |

**Usage:**
```svelte
<FormField label="Leave Type Name" id="leave-name" required error={nameError}>
  <TextInput id="leave-name" bind:value={name} />
</FormField>
```

---

### TextInput

Standard text input field.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Input ID (matches FormField) |
| `value` | `string` | `''` | Input value (`$bindable`) |
| `placeholder` | `string` | — | Placeholder text |
| `type` | `'text' \| 'email' \| 'url' \| 'search'` | `'text'` | Input type |
| `disabled` | `boolean` | `false` | Disabled state |
| `validation` | `ValidationState` | `'idle'` | Visual validation state |
| `oninput` | `(e: Event) => void` | — | Input handler |
| `onblur` | `(e: FocusEvent) => void` | — | Blur handler |

**Token usage:** `border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500`

---

### NumberInput

Numeric input with increment/decrement buttons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Input ID |
| `value` | `number` | `0` | Current value (`$bindable`) |
| `min` | `number` | — | Minimum allowed value |
| `max` | `number` | — | Maximum allowed value |
| `step` | `number` | `1` | Increment step |
| `disabled` | `boolean` | `false` | Disabled state |
| `onchange` | `(value: number) => void` | — | Change handler |

**Accessibility:** `aria-valuemin`, `aria-valuemax`, `aria-valuenow` on the input.

---

### Select

Dropdown selection from a list of options.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Select ID |
| `value` | `string` | — | Selected value (`$bindable`) |
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | — | Available options |
| `placeholder` | `string` | — | Placeholder when no selection |
| `disabled` | `boolean` | `false` | Disabled state |
| `onchange` | `(value: string) => void` | — | Change handler |

**Implementation note:** Uses native `<select>` for maximum accessibility. Custom chevron icon overlay.

---

### Toggle

On/off switch for boolean settings.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Toggle ID |
| `checked` | `boolean` | `false` | Toggle state (`$bindable`) |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Accessible label (required) |
| `onchange` | `(checked: boolean) => void` | — | Change handler |

**Accessibility:** Uses `role="switch"` with `aria-checked`. NOT a checkbox.

---

### RadioGroup

Mutually exclusive selection from a set of options.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Radio group name |
| `value` | `string` | — | Selected value (`$bindable`) |
| `options` | `Array<{ value: string; label: string; description?: string }>` | — | Options |
| `onchange` | `(value: string) => void` | — | Change handler |

**Accessibility:** `<fieldset>` + `<legend>`. Arrow keys to navigate options.

---

### DatePicker

Date selection input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Input ID |
| `value` | `string` | — | ISO date string (`$bindable`) |
| `min` | `string` | — | Minimum date (ISO) |
| `max` | `string` | — | Maximum date (ISO) |
| `disabled` | `boolean` | `false` | Disabled state |
| `onchange` | `(date: string) => void` | — | Change handler |

**Implementation note:** Starts with native `<input type="date">`. Can be replaced with a custom calendar picker later.

---

### MultiSelect

Select multiple items from a list.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Component ID |
| `selected` | `string[]` | `[]` | Selected values (`$bindable`) |
| `options` | `Array<{ value: string; label: string }>` | — | Available options |
| `placeholder` | `string` | — | Placeholder text |
| `onchange` | `(selected: string[]) => void` | — | Change handler |

**Accessibility:** `aria-expanded`, `aria-haspopup="listbox"`, `role="listbox"` on dropdown. Escape to close.

---

### Stepper

Multi-step wizard navigation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `Array<{ id: string; label: string; description?: string }>` | — | Step definitions |
| `currentStep` | `number` | `0` | Active step index |
| `onStepClick` | `(stepIndex: number) => void` | — | Step click handler |

**Accessibility:** `aria-current="step"` on current step. Only completed steps are clickable.

---

## Calendar Components (`components/calendar/`)

### CalendarGrid

Month view calendar displaying day types.

| Prop | Type | Default | Description |
|---|---|---|---|
| `year` | `number` | — | Year to display |
| `month` | `number` | — | Month (0-11, JavaScript convention) |
| `dayTypes` | `Map<string, DayType>` | — | ISO date → DayType mapping |
| `selectedDate` | `string` | — | Currently selected date (ISO) |
| `onDayClick` | `(date: string) => void` | — | Day click handler |
| `onDayHover` | `(date: string \| null) => void` | — | Day hover handler |

**Layout:** 7-column CSS grid with day-of-week headers. Renders `DayCell` for each day.

---

### DayCell

Individual day in the calendar grid.

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `string` | — | ISO date string |
| `dayOfMonth` | `number` | — | Day number (1-31) |
| `dayType` | `DayType` | — | Visual type |
| `isToday` | `boolean` | `false` | Today indicator |
| `isSelected` | `boolean` | `false` | Selected state |
| `isInRange` | `boolean` | `false` | Part of contiguous block |
| `rangePosition` | `'start' \| 'middle' \| 'end' \| 'single'` | — | Position in range |
| `onclick` | `() => void` | — | Click handler |

**Token mapping:** `DayType` maps directly to `bg-cal-*` / `text-cal-*` utility classes.

**Accessibility:** `aria-label="March 15, 2026 - PTO day"` describing date and type.

---

### CalendarNav

Month/year navigation controls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `year` | `number` | — | Current year |
| `month` | `number` | — | Current month (0-11) |
| `onNavigate` | `(year: number, month: number) => void` | — | Navigation callback |

---

### CalendarLegend

Color key explaining calendar day types.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{ type: DayType; label: string }>` | (all types) | Legend entries |

**Default items:** Workday, Weekend, Holiday, PTO, Casual Leave, Sick Leave.

---

## Data Display Components (`components/data-display/`)

### SummaryCard

Statistics card for key metrics.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Metric name (e.g., "Total Days Off") |
| `value` | `string \| number` | — | Metric value (e.g., 42) |
| `subtitle` | `string` | — | Additional context |
| `trend` | `'up' \| 'down' \| 'neutral'` | — | Trend direction |
| `icon` | `Snippet` | — | Optional icon |

---

### ProgressBar

Visual representation of a value within a range.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current value (0-100) |
| `max` | `number` | `100` | Maximum value |
| `label` | `string` | — | Accessible label |
| `showValue` | `boolean` | `false` | Show percentage text |
| `variant` | `Variant` | `'primary'` | Fill color |
| `size` | `Size` | `'md'` | Bar height |

**Accessibility:** `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

---

### DataTable

Sortable data table.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `Array<{ key: string; label: string; sortable?: boolean; align?: 'left' \| 'center' \| 'right' }>` | — | Column definitions |
| `rows` | `Array<Record<string, unknown>>` | — | Row data |
| `sortKey` | `string` | — | Currently sorted column |
| `sortDirection` | `'asc' \| 'desc'` | — | Sort direction |
| `onSort` | `(key: string) => void` | — | Sort handler |

**Accessibility:** `aria-sort="ascending"` or `"descending"` on sorted column header.

---

### RankingCard

Card displaying a ranked plan option.

| Prop | Type | Default | Description |
|---|---|---|---|
| `rank` | `number` | — | Plan rank (1, 2, 3...) |
| `title` | `string` | — | Plan name (e.g., "Most Balanced") |
| `stats` | `Array<{ label: string; value: string \| number }>` | — | Key metrics |
| `isSelected` | `boolean` | `false` | Selected state |
| `badge` | `string` | — | Recommendation badge text |
| `onclick` | `() => void` | — | Selection handler |

---

## Feedback Components (`components/feedback/`)

### Spinner

Loading indicator.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `Size` | `'md'` | Spinner diameter |
| `label` | `string` | `'Loading'` | Accessible label |

**Sizes:** sm=16px, md=24px, lg=32px. **Accessibility:** `role="status"` + `sr-only` label.

---

### Toast / ToastContainer

Notification messages.

**Toast Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `ToastType` | — | info, success, warning, error |
| `message` | `string` | — | Toast message |
| `description` | `string` | — | Additional detail |
| `dismissible` | `boolean` | `true` | Show close button |
| `onclose` | `() => void` | — | Close handler |

**ToastContainer Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `'top-right' \| 'top-center' \| 'bottom-right' \| 'bottom-center'` | `'top-right'` | Stack position |

**Accessibility:** Container uses `aria-live="polite"`. Individual toasts use `role="alert"`.

---

### EmptyState

Placeholder for content that doesn't exist yet.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Empty state heading |
| `description` | `string` | — | Explanation text |
| `icon` | `Snippet` | — | Illustration or icon |
| `action` | `Snippet` | — | CTA button |

---

### Skeleton

Loading placeholder that mimics content shape.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Shape variant |
| `width` | `string` | — | CSS width |
| `height` | `string` | — | CSS height |
| `lines` | `number` | `1` | Number of text lines |

**Accessibility:** `aria-hidden="true"` — purely decorative.

---

### ValidationMessage

Inline validation feedback.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'error' \| 'warning' \| 'success'` | — | Message type |
| `message` | `string` | — | Validation message |

**Accessibility:** `role="alert"` for errors (assertive announcement).
