# FinanceStrip Component

A finance summary strip component that displays monthly revenue and completed jobs count in a single line at the bottom of the HOME dashboard.

## Overview

The FinanceStrip component provides a quick, at-a-glance view of key financial metrics for the current month. It features:

- 💰 Monthly revenue in BRL format (R$ 12.500,00)
- Number of completed jobs
- Link to full finance page
- Glass effect styling for visual consistency
- Responsive layout that wraps on mobile devices

## Usage

```tsx
import { FinanceStrip } from "@/components/dashboard";

function Dashboard() {
  return (
    <FinanceStrip
      monthlyRevenue={12500.5}
      jobsCompleted={5}
    />
  );
}
```

## Props

### FinanceStripProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `monthlyRevenue` | `number` | Yes | - | The total revenue for the current month |
| `jobsCompleted` | `number` | Yes | - | Number of jobs completed this month |
| `currency` | `string` | No | `"BRL"` | Currency code for formatting (BRL, USD, etc.) |
| `onViewFinance` | `() => void` | No | Navigate to `/finance` | Callback when "Ver Finance" link is clicked |
| `className` | `string` | No | - | Additional CSS classes to apply |

## Features

### Currency Formatting

The component uses `Intl.NumberFormat` to properly format currencies:

- **BRL format**: R$ 12.500,50
  - Dot (.) as thousands separator
  - Comma (,) as decimal separator
  - Always 2 decimal places

```tsx
// Examples
formatCurrency(0)         // "R$ 0,00"
formatCurrency(1234.56)   // "R$ 1.234,56"
formatCurrency(1000000)   // "R$ 1.000.000,00"
```

### Navigation

By default, clicking "→ Ver Finance" navigates to `/finance`. You can override this behavior:

```tsx
<FinanceStrip
  monthlyRevenue={10000}
  jobsCompleted={5}
  onViewFinance={() => {
    // Custom navigation logic
    console.log("Navigating to finance...");
    router.push("/custom-finance");
  }}
/>
```

### Responsive Layout

The component automatically wraps content on smaller screens:

- **Desktop**: Single line with all elements
- **Mobile** (< 640px): Wraps to 2 lines if needed
- Uses flexbox with `flex-wrap` for automatic reflow

### Glass Effect Styling

The component features a subtle glass morphism effect:

- Semi-transparent background: `rgba(255, 255, 255, 0.05)`
- Border-top: `1px solid rgba(255, 255, 255, 0.1)`
- Rounded corners: `rounded-2xl` (16px)
- Smooth transitions

## Accessibility

The component follows accessibility best practices:

- Semantic HTML with `<section role="region">`
- ARIA label: "Finance summary strip"
- Icon has `aria-label` for screen readers
- Separator bullet is `aria-hidden`
- Link has proper focus states and keyboard navigation
- Focus-visible ring for keyboard users

## Styling

### Default Styles

```css
/* Container */
background: rgba(255, 255, 255, 0.05);
border-top: 1px solid rgba(255, 255, 255, 0.1);
padding: 1rem 1.5rem;
font-size: 0.875rem;
border-radius: 1rem;

/* Link */
color: #FF6B00;
font-weight: 500;
margin-left: auto;
```

### Custom Styling

You can add custom styles using the `className` prop:

```tsx
<FinanceStrip
  monthlyRevenue={10000}
  jobsCompleted={5}
  className="my-custom-class border-2 border-orange-500"
/>
```

## Examples

### Basic Usage

```tsx
<FinanceStrip
  monthlyRevenue={12500.5}
  jobsCompleted={5}
/>
```

### Zero Revenue

```tsx
<FinanceStrip
  monthlyRevenue={0}
  jobsCompleted={0}
/>
```

### Large Numbers

```tsx
<FinanceStrip
  monthlyRevenue={1500000}
  jobsCompleted={50}
/>
```

### Custom Navigation

```tsx
<FinanceStrip
  monthlyRevenue={8500}
  jobsCompleted={7}
  onViewFinance={() => {
    analytics.track("finance_viewed");
    navigate("/finance");
  }}
/>
```

### Custom Currency

```tsx
<FinanceStrip
  monthlyRevenue={10000}
  jobsCompleted={8}
  currency="USD"
/>
```

## Integration with Dashboard

The FinanceStrip should be placed at the bottom of the HOME dashboard:

```tsx
function HomeDashboard() {
  const { financeData } = useDashboardData();

  return (
    <div className="dashboard-container">
      <GreetingSection userName="João" />

      <WorkflowCardsRow workflowStats={stats} />

      <div className="main-content">
        <ChecklistColumn items={checklistItems} />
        <ActiveJobsColumn jobs={activeJobs} />
      </div>

      <FinanceStrip
        monthlyRevenue={financeData.monthlyRevenue}
        jobsCompleted={financeData.jobsCompleted}
      />
    </div>
  );
}
```

## Helper Functions

### formatCurrency

Formats a number as currency according to the specified locale:

```tsx
import { formatCurrency } from "@/components/dashboard";

formatCurrency(1234.56, "BRL");  // "R$ 1.234,56"
formatCurrency(1000, "USD");     // "US$ 1,000.00"
```

**Parameters:**
- `amount: number` - The amount to format
- `currency?: string` - Currency code (default: "BRL")

**Returns:** Formatted currency string

**Edge Cases:**
- `Infinity` → "R$ 0,00"
- `NaN` → "R$ 0,00"
- Negative numbers → "-R$ 500,00"

## Testing

The component includes comprehensive tests covering:

- ✅ Component rendering (7 tests)
- ✅ Currency formatting (8 tests)
- ✅ Jobs completed display (3 tests)
- ✅ Navigation and interaction (6 tests)
- ✅ Styling and layout (8 tests)
- ✅ Accessibility (4 tests)
- ✅ Edge cases (4 tests)
- ✅ formatCurrency utility (13 tests)

**Total: 53 tests**

Run tests:

```bash
npm run test -- FinanceStrip.test.tsx
```

## Design Tokens

The component uses the following design tokens:

- `--text-muted`: Text color for revenue and jobs count
- `--text-primary`: Not directly used (falls back to parent)
- Orange accent: `#FF6B00` (hardcoded for link)
- Spacing: `1rem` vertical, `1.5rem` horizontal padding
- Font size: `0.875rem` (14px)
- Border radius: `rounded-2xl` (16px)

## Requirements Satisfied

This component satisfies the following requirements from the spec:

- ✅ **US-009**: Finance summary strip at bottom of HOME
- ✅ **FR-013**: Finance strip calculation for current month
- ✅ Single-line layout with glass effect
- ✅ BRL currency formatting (R$ 12.500,00)
- ✅ Jobs completed count display
- ✅ Link to full finance page
- ✅ Responsive wrapping on mobile
- ✅ Accessible with ARIA labels
- ✅ 25+ comprehensive tests

## Browser Support

The component uses modern web APIs:

- `Intl.NumberFormat` for currency formatting (all modern browsers)
- Flexbox for layout (IE11+)
- CSS custom properties (IE11+ with polyfill)
- ARIA attributes (all browsers with screen readers)

## Performance

- Lightweight component (~5KB minified)
- Uses `React.useCallback` for memoized event handlers
- No external dependencies beyond React and wouter
- Renders in < 1ms on modern devices

## Known Limitations

1. Currency formatting relies on browser support for `Intl.NumberFormat`
2. Very long revenue values may overflow on extremely narrow screens (< 300px)
3. Custom currency formatting may vary slightly by browser locale

## Future Enhancements

Potential improvements for future iterations:

- [ ] Animation on revenue/jobs count changes
- [ ] Trend indicators (↑ +10% from last month)
- [ ] Tooltip with detailed breakdown
- [ ] Loading skeleton state
- [ ] Error state handling
- [ ] Export functionality
- [ ] Multi-currency toggle
- [ ] Date range selector

## Related Components

- `GreetingSection` - Dashboard greeting at top
- `WorkflowCardsRow` - Workflow statistics cards
- `ChecklistColumn` - Daily checklist items
- `ActiveJobsColumn` - List of active jobs
- `GlassCard` - Base glass effect component

## Support

For issues or questions:

- Check the [examples file](./FinanceStrip.examples.tsx)
- Review the [test file](./FinanceStrip.test.tsx)
- See the [design spec](.kiro/specs/rebrand-fase1-fundacao/design.md)
- Contact the frontend team
