# SkeletonLoader

Skeleton loading placeholders for dashboard components that prevent Cumulative Layout Shift (CLS) while data loads.

## Features

- 🎯 **Exact dimension matching** - Prevents CLS by matching final component sizes
- ✨ **Smooth pulse animation** - Opacity transitions from 1 → 0.5 → 1
- ♿ **Accessible** - ARIA labels and respects `prefers-reduced-motion`
- 🧩 **Composable** - Use individual skeletons or full dashboard layout
- 🎨 **Theme-aware** - Uses CSS variables for consistent styling
- 📦 **TypeScript** - Full type definitions included

## Components

### DashboardSkeleton

Complete skeleton layout for entire dashboard.

```tsx
import { DashboardSkeleton } from '@/components/dashboard';

function Dashboard() {
  const { isLoading, data } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return <DashboardLayout data={data} />;
}
```

### GreetingSkeleton

Skeleton for greeting section with icon, title, subtitle, and date.

```tsx
import { GreetingSkeleton } from '@/components/dashboard';

<GreetingSkeleton />
```

**Dimensions:**
- Icon: 2rem circle
- Title: 2rem height × 300px width
- Subtitle: 1rem height × 400px width
- Date: 0.875rem height × 200px width

### WorkflowCardSkeleton

Skeleton for workflow cards showing count and status.

```tsx
import { WorkflowCardSkeleton } from '@/components/dashboard';

<div className="grid gap-4">
  <WorkflowCardSkeleton />
  <WorkflowCardSkeleton />
  <WorkflowCardSkeleton />
  <WorkflowCardSkeleton />
</div>
```

**Dimensions:**
- Container: 200px height, 24px border-radius
- Icon: 2rem circle
- Number: 3rem height × 80px width
- Label: 0.75rem height × 120px width
- Sublabel: 0.875rem height × 100px width

### ChecklistItemSkeleton

Skeleton for individual checklist items.

```tsx
import { ChecklistItemSkeleton } from '@/components/dashboard';

<div className="flex flex-col gap-3">
  <ChecklistItemSkeleton width="75%" />
  <ChecklistItemSkeleton width="60%" />
  <ChecklistItemSkeleton width="80%" />
  <ChecklistItemSkeleton width="70%" />
  <ChecklistItemSkeleton width="65%" />
</div>
```

**Props:**
- `width?: string` - Text width (default: "70%")

**Dimensions:**
- Checkbox: 20px × 20px
- Text: 0.875rem height, variable width

### JobCardSkeleton

Skeleton for job cards with title, client, deadline, progress, and buttons.

```tsx
import { JobCardSkeleton } from '@/components/dashboard';

<div className="flex flex-col gap-4">
  <JobCardSkeleton />
  <JobCardSkeleton />
  <JobCardSkeleton />
</div>
```

**Dimensions:**
- Container: 240px min-height, 16px border-radius
- Title: 1.5rem height × 200px width
- Client: 0.875rem height × 150px width
- Deadline: 0.875rem height × 180px width
- Progress bar: 8px height × 100% width
- Buttons: 3 × (32px height × 80px width)

### FinanceStripSkeleton

Skeleton for finance summary strip.

```tsx
import { FinanceStripSkeleton } from '@/components/dashboard';

<FinanceStripSkeleton />
```

**Dimensions:**
- Container: 60px min-height, full width
- Icon: 1.5rem circle
- Text blocks: 0.875rem height, various widths

## Props

### SkeletonLoaderProps

```typescript
interface SkeletonLoaderProps {
  className?: string;
}
```

All individual skeleton components accept `className` prop for custom styling.

### DashboardSkeletonProps

```typescript
interface DashboardSkeletonProps {
  // No props needed - displays full skeleton layout
}
```

## Partial Loading Example

Load individual sections independently:

```tsx
function Dashboard() {
  const { greeting, workflow, checklist, jobs, finance } = useDashboard();

  return (
    <>
      {greeting.isLoading ? (
        <GreetingSkeleton />
      ) : (
        <GreetingSection {...greeting.data} />
      )}

      {workflow.isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <WorkflowCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <WorkflowCardsRow stats={workflow.data} />
      )}

      <div className="grid gap-6">
        {checklist.isLoading ? (
          <div>
            <div className="p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <ChecklistItemSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <ChecklistColumn tasks={checklist.data} />
        )}

        {jobs.isLoading ? (
          <div className="flex flex-col gap-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : (
          <ActiveJobsColumn jobs={jobs.data} />
        )}
      </div>

      {finance.isLoading ? (
        <FinanceStripSkeleton />
      ) : (
        <FinanceStrip {...finance.data} />
      )}
    </>
  );
}
```

## Animation

The skeleton uses a pulse animation defined in `index.css`:

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Reduced Motion

Respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton-pulse {
    animation: none;
    opacity: 0.7;
  }
}
```

## Styling

### Background Color

Uses CSS variable with fallback:

```tsx
backgroundColor: "var(--bg-tertiary, #e5e7eb)"
```

### Border Radius

Matches final components:
- Greeting: `rounded-2xl`
- Workflow cards: `rounded-[24px]`
- Job cards: `rounded-[16px]`
- Finance strip: `rounded-2xl`

### Custom Styling

Add custom className for additional styling:

```tsx
<GreetingSkeleton className="my-custom-class" />
```

## Accessibility

### ARIA Labels

All skeleton elements include descriptive labels:

```tsx
<div aria-label="Loading greeting section" role="status">
  {/* skeleton content */}
</div>
```

### Screen Reader Announcements

The `role="status"` attribute ensures screen readers announce loading states appropriately.

## CLS Prevention

Each skeleton component matches the **exact** dimensions of its corresponding real component:

| Component | Key Dimensions |
|-----------|----------------|
| GreetingSkeleton | Icon: 2rem, Title: 2rem, Subtitle: 1rem, Date: 0.875rem |
| WorkflowCardSkeleton | Height: 200px, Border-radius: 24px |
| ChecklistItemSkeleton | Checkbox: 20px × 20px, Text: 0.875rem |
| JobCardSkeleton | Min-height: 240px, Border-radius: 16px |
| FinanceStripSkeleton | Min-height: 60px, Width: 100% |

**Target CLS:** < 0.1 (excellent)

## Testing

Run tests:

```bash
npm test -- SkeletonLoader.test.tsx
```

**Test Coverage:**
- ✅ 60+ test cases
- ✅ 11 test suites
- ✅ Rendering tests
- ✅ Dimension verification
- ✅ Accessibility tests
- ✅ Animation tests
- ✅ CLS prevention tests

## Examples

See `SkeletonLoader.examples.tsx` for 10 comprehensive examples:

1. Full dashboard skeleton
2. Individual greeting skeleton
3. Workflow cards grid
4. Checklist items with varied widths
5. Job cards column
6. Finance strip
7. Conditional loading with toggle
8. Partial loading state
9. Custom styled skeleton
10. Responsive skeleton layout

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## Performance

- **Animation:** GPU-accelerated (opacity only)
- **Memory:** Lightweight CSS-only animation
- **FPS:** Consistent 60fps
- **CLS:** < 0.1 (when dimensions match)

## Related Components

- `GreetingSection` - Real greeting component
- `WorkflowCard` - Real workflow card
- `ChecklistItem` - Real checklist item
- `JobCard` - Real job card
- `FinanceStrip` - Real finance strip

## License

MIT
