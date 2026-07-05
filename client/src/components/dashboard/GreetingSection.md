# GreetingSection Component

## Overview

The `GreetingSection` component provides a personalized greeting experience for the HOME dashboard, displaying time-based greetings in Portuguese (Bom dia/Boa tarde/Boa noite), user's first name, motivational messages, and formatted date information.

## Features

- **Time-Based Greetings**: Automatically displays appropriate greeting based on time of day
  - 5:00-11:59 → "Bom dia" ☀️
  - 12:00-17:59 → "Boa tarde" ☁️
  - 18:00-4:59 → "Boa noite" 🌙
- **Name Personalization**: Extracts and displays user's first name
- **Motivational Messages**: Rotating daily motivational messages
- **Portuguese Date Formatting**: Full date display in Portuguese format
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Glass Effect Option**: Optional glassmorphism styling
- **Accessible**: Proper ARIA labels and semantic HTML

## Installation

```typescript
import { GreetingSection } from "@/components/dashboard/GreetingSection";
```

## Basic Usage

```tsx
import { GreetingSection } from "@/components/dashboard";

function Dashboard() {
  return (
    <GreetingSection
      userName="João Silva Santos"
      currentDate={new Date()}
    />
  );
}
```

## Props

### GreetingSectionProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | `string` | **required** | User's full name. First name will be extracted. |
| `currentDate` | `Date` | `new Date()` | Date object for time-based greeting and date display |
| `className` | `string` | `undefined` | Additional CSS classes |
| `align` | `"left" \| "center"` | `"left"` | Text alignment |
| `showGlassEffect` | `boolean` | `false` | Enable glassmorphism background effect |

## Examples

### Morning Greeting

```tsx
<GreetingSection
  userName="Maria Santos"
  currentDate={new Date(2024, 0, 15, 8, 30)}
/>
// Displays: "Bom dia, Maria!"
```

### Afternoon Greeting

```tsx
<GreetingSection
  userName="Pedro Oliveira"
  currentDate={new Date(2024, 0, 15, 14, 30)}
/>
// Displays: "Boa tarde, Pedro!"
```

### Evening Greeting

```tsx
<GreetingSection
  userName="Ana Costa"
  currentDate={new Date(2024, 0, 15, 20, 30)}
/>
// Displays: "Boa noite, Ana!"
```

### Center Aligned

```tsx
<GreetingSection
  userName="Carlos Lima"
  currentDate={new Date()}
  align="center"
/>
```

### With Glass Effect

```tsx
<GreetingSection
  userName="Sofia Almeida"
  currentDate={new Date()}
  showGlassEffect={true}
/>
```

### Custom Styling

```tsx
<GreetingSection
  userName="Lucas Costa"
  currentDate={new Date()}
  className="border-2 border-orange-500 shadow-xl"
/>
```

## Utility Functions

The component exports several utility functions that can be used independently:

### getTimeBasedGreeting(hour: number): string

Returns the appropriate greeting based on the hour of day (0-23).

```typescript
import { getTimeBasedGreeting } from "@/components/dashboard";

getTimeBasedGreeting(8);  // "Bom dia"
getTimeBasedGreeting(14); // "Boa tarde"
getTimeBasedGreeting(20); // "Boa noite"
```

### getTimeIcon(hour: number): string

Returns the emoji icon for the time of day.

```typescript
import { getTimeIcon } from "@/components/dashboard";

getTimeIcon(8);  // "☀️"
getTimeIcon(14); // "☁️"
getTimeIcon(20); // "🌙"
```

### extractFirstName(fullName: string): string

Extracts the first name from a full name string.

```typescript
import { extractFirstName } from "@/components/dashboard";

extractFirstName("João Silva Santos"); // "João"
extractFirstName("Maria");            // "Maria"
extractFirstName("  Pedro  Santos  "); // "Pedro"
```

### getMotivationalMessage(date: Date): string

Returns a deterministic motivational message based on the day of year.

```typescript
import { getMotivationalMessage } from "@/components/dashboard";

const message = getMotivationalMessage(new Date());
// Returns one of:
// - "Vamos criar algo incrível hoje!"
// - "Pronto para transformar ideias em realidade?"
// - "Seus projetos aguardam. Vamos nessa!"
// - "Hora de fazer acontecer! 🚀"
```

### formatDateInPortuguese(date: Date): string

Formats a date in Portuguese format: "Hoje é {dayOfWeek}, {day} de {month}".

```typescript
import { formatDateInPortuguese } from "@/components/dashboard";

formatDateInPortuguese(new Date(2024, 0, 15));
// "Hoje é Segunda, 15 de janeiro"
```

## Styling

The component uses design tokens from the global token system:

### Font Sizes
- **Greeting**: 2rem (32px) - Bold
- **Subtitle**: 1rem (16px) - Muted color
- **Date**: 0.875rem (14px) - Secondary color

### Spacing
- **Bottom margin**: 24px (`var(--space-lg)`)
- **Internal spacing**: Uses token-based spacing

### Colors
- **Primary text**: `var(--text-primary)`
- **Muted text**: `var(--text-muted)`
- **Secondary text**: `var(--text-secondary)`

### Glass Effect
When `showGlassEffect={true}`, applies the `.glass-card-standard` class with:
- Backdrop blur filter
- Semi-transparent background
- Border and shadow

## Responsive Behavior

The component is responsive by default:

- **Mobile**: Consider using `align="center"` for better appearance
- **Desktop**: Default `align="left"` works well
- Font sizes are fixed but the layout adapts

## Accessibility

- Semantic HTML with `<section>`, `<h1>`, `<p>` elements
- ARIA label on section: `aria-label="Greeting section"`
- Icon has proper `role="img"` and `aria-label`
- Proper heading hierarchy (h1)

## Testing

The component includes comprehensive test coverage (53 tests):

```bash
npm run test -- GreetingSection.test.tsx
```

### Test Coverage

- Component rendering
- Time-based greeting logic (all hours)
- Name extraction (single/multiple names, whitespace)
- Date formatting (all days, all months)
- Motivational messages
- Visual design and styling
- Utility functions
- Accessibility
- Edge cases (midnight, noon, etc.)

## Time Periods

### Morning (Bom dia) ☀️
- **Hours**: 5:00 - 11:59
- **Icon**: Sun ☀️

### Afternoon (Boa tarde) ☁️
- **Hours**: 12:00 - 17:59
- **Icon**: Cloud ☁️

### Evening (Boa noite) 🌙
- **Hours**: 18:00 - 4:59
- **Icon**: Moon 🌙

## Motivational Messages

The component rotates through 4 motivational messages based on the day of year:

1. "Vamos criar algo incrível hoje!"
2. "Pronto para transformar ideias em realidade?"
3. "Seus projetos aguardam. Vamos nessa!"
4. "Hora de fazer acontecer! 🚀"

Messages are deterministic - the same date will always show the same message.

## Portuguese Date Format

### Days of Week
- Domingo, Segunda, Terça, Quarta, Quinta, Sexta, Sábado

### Months
- janeiro, fevereiro, março, abril, maio, junho
- julho, agosto, setembro, outubro, novembro, dezembro

### Format
"Hoje é {dayOfWeek}, {day} de {month}"

Example: "Hoje é Segunda, 15 de janeiro"

## Browser Support

- Modern browsers with ES6+ support
- Backdrop filter support for glass effect (fallback available)
- Responsive design with CSS Grid/Flexbox

## Design Tokens Integration

The component integrates with the Phase 1 Foundation design tokens:

- Uses `var(--font-display)` for headings
- Uses spacing tokens (`--space-lg`, `--space-sm`)
- Uses color tokens (`--text-primary`, `--text-muted`, `--text-secondary`)
- Supports glass effect via `.glass-card-standard`

## Related Components

- `ChecklistItem` - Task list item component
- `GlassCard` - Base glass effect card component

## Task Reference

- **Task**: 1.3.5 Implement Greeting Section
- **Priority**: P0
- **Dependencies**: 1.1.1 (Design Tokens)
- **File**: `client/src/components/dashboard/GreetingSection.tsx`

## License

Part of the Cena Studio Platform - Phase 1: Foundation
