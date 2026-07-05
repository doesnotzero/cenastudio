# ActiveJobsColumn Component

## Overview
The `ActiveJobsColumn` component displays a scrollable list of active job cards for the HOME dashboard. It shows jobs sorted by urgency (deadline), provides quick actions, and includes an empty state with job creation flow.

## Features

### Visual Design
- **Title:** "🎬 JOBS ATIVOS" (uppercase, 0.875rem)
- **Layout:** Vertical column with scroll container
- **Scroll Behavior:** Max-height 600px with custom orange scrollbar
- **Responsive:** Full width mobile, 70% width desktop (768px+)
- **Spacing:** 16px gap between job cards

### Functionality
- **Job Sorting:** Automatically sorts by deadline (soonest first using `daysLeft`)
- **Quick Actions:** Briefing, Review, and Hub buttons on each card
- **Card Navigation:** Click any job card to view details
- **Create New:** "+ NOVO JOB" button at bottom (full width, orange)
- **Empty State:** Helpful message with "+ Criar Job" button

### Job Card Features
- **Status Border:** Color-coded left border (2px solid)
  - Briefing: `#f59e0b` (amber)
  - Production: `#FF6B00` (orange)
  - Review: `#3b82f6` (blue)
  - Delivered: `#10b981` (green)
- **Urgency Indicator:** Red 🔴 dot when daysLeft < 3
- **Progress Bar:** Visual progress with status-matched color
- **Glass Effect:** Semi-transparent background with blur
- **Hover Animation:** Lift effect on hover

## Usage

### Basic Example
```tsx
import { ActiveJobsColumn } from '@/components/dashboard';

function Dashboard() {
  const jobs = [
    {
      id: '1',
      title: 'Product Launch Video',
      client: 'Acme Corp',
      status: 'production',
      deadline: '2024-12-31',
      daysLeft: 5,
      progress: 65,
      urgent: false,
    },
  ];

  return (
    <ActiveJobsColumn
      jobs={jobs}
      onView={(id) => console.log('View job:', id)}
      onEdit={(id) => console.log('Edit job:', id)}
      onCreateNew={() => console.log('Create new job')}
    />
  );
}
```

### With Wouter Router
```tsx
import { useLocation } from 'wouter';
import { ActiveJobsColumn } from '@/components/dashboard';

function Dashboard() {
  const [, navigate] = useLocation();
  const [jobs, setJobs] = useState([]);

  return (
    <ActiveJobsColumn
      jobs={jobs}
      onView={(id) => navigate(`/jobs/${id}`)}
      onEdit={(id) => navigate(`/jobs/${id}/edit`)}
      onCreateNew={() => navigate('/jobs/new')}
    />
  );
}
```

### Empty State
```tsx
<ActiveJobsColumn
  jobs={[]}
  onCreateNew={() => navigate('/jobs/new')}
/>
```

## Props

### ActiveJobsColumnProps
```typescript
interface ActiveJobsColumnProps {
  /** Array of active jobs to display */
  jobs: Job[];

  /** Handler for play action (optional, for future use) */
  onPlay?: (id: string) => void;

  /** Handler for edit action (maps to 'briefing' quick action) */
  onEdit?: (id: string) => void;

  /** Handler for view action (clicking card or 'hub'/'review' actions) */
  onView?: (id: string) => void;

  /** Handler for creating new job (required) */
  onCreateNew: () => void;

  /** Additional CSS classes */
  className?: string;
}
```

### Job Interface
```typescript
interface Job {
  id: string;
  title: string;
  client: string;
  status: 'briefing' | 'production' | 'review' | 'delivered';
  deadline: string; // Formatted date string (e.g., "2024-12-31")
  daysLeft: number; // Used for sorting (soonest first)
  progress: number; // 0-100
  urgent?: boolean; // Automatically true when daysLeft < 3
}
```

## Action Mapping

The component maps quick actions to the appropriate handlers:

| Quick Action | Handler Called | Description |
|--------------|---------------|-------------|
| **Briefing** button | `onEdit(jobId)` | Opens job editing/briefing interface |
| **Review** button | `onView(jobId)` | Navigates to job review page |
| **Hub** button | `onView(jobId)` | Navigates to job hub/details page |
| **Card click** | `onView(jobId)` | Navigates to job details page |
| **+ NOVO JOB** | `onCreateNew()` | Opens job creation flow |

## Sorting Behavior

Jobs are automatically sorted by `daysLeft` in ascending order (most urgent first):
- Jobs with fewer days remaining appear at the top
- Negative values (overdue) appear first
- Original array is never mutated (immutable sorting)
- Re-sorts automatically when `jobs` prop changes

### Example Sort Order
```
Job A: daysLeft = 1   (🔴 urgent)
Job B: daysLeft = 2   (🔴 urgent)
Job C: daysLeft = 5
Job D: daysLeft = 10
```

## Responsive Breakpoints

### Mobile (< 768px)
- Full width (100%)
- Stack vertically
- Touch-optimized interactions

### Desktop (≥ 768px)
- 70% width
- Custom scrollbar styling
- Hover effects enabled

## Accessibility

- **Semantic HTML:** Proper use of h2, button elements
- **ARIA Labels:** Descriptive labels on buttons
- **Keyboard Navigation:** Full keyboard support via GlassCard
- **Focus States:** Visible focus indicators
- **Screen Readers:** Proper text alternatives for icons

## Styling Customization

### Custom Scrollbar
```css
/* Webkit browsers (Chrome, Safari, Edge) */
.jobs-list-container::-webkit-scrollbar {
  width: 6px;
}

.jobs-list-container::-webkit-scrollbar-thumb {
  background: var(--color-orange-primary, #FF6B00);
  border-radius: 3px;
}
```

### Custom Styling Example
```tsx
<ActiveJobsColumn
  jobs={jobs}
  onCreateNew={handleCreate}
  className="my-custom-column"
  style={{
    maxWidth: '800px',
    margin: '0 auto',
  }}
/>
```

## States

### With Jobs
- Title displayed
- Jobs list scrollable
- "+ NOVO JOB" button at bottom

### Empty State
- Title displayed
- Message: "Nenhum job ativo. Crie seu primeiro job!"
- "+ Criar Job" button (centered)
- No "+ NOVO JOB" button

### Loading (Recommended Pattern)
```tsx
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then((data) => {
      setJobs(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading active jobs...</div>;
  }

  return <ActiveJobsColumn jobs={jobs} onCreateNew={handleCreate} />;
}
```

## Dependencies

### Internal
- `JobCard` - Individual job card component
- `Button` - Primary CTA button from design system

### Base Components
- `GlassCard` - Glass effect wrapper
- `ProgressBar` - Progress visualization
- `QuickActionButton` - Action buttons

### External
- `react` - Core React
- `@/design-system/primitives/Button` - Button component

## Performance

### Optimizations
- `useMemo` for job sorting (only re-sorts when jobs change)
- Immutable operations (doesn't mutate props)
- Event handler memoization

### Rendering
- Efficient re-renders on job updates
- Key prop on mapped JobCard components
- No unnecessary re-renders of child components

## Examples File

See `ActiveJobsColumn.examples.tsx` for more usage examples:
1. Basic usage with active jobs
2. Empty state
3. Many jobs (scroll behavior)
4. Urgent jobs only
5. Integration with router
6. Custom styling
7. Loading state pattern

## Testing

Comprehensive test suite with 90+ tests covering:
- Component rendering
- Job sorting
- Action handlers
- Empty state
- Responsive behavior
- Edge cases

Run tests:
```bash
npm run test -- ActiveJobsColumn.test.tsx
npm run test -- JobCard.test.tsx
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Custom scrollbar: Webkit browsers only (degrades gracefully)
- Glass effect: Modern browsers with backdrop-filter support

## Common Issues

### Jobs Not Sorting
**Problem:** Jobs appear in wrong order
**Solution:** Ensure each job has a valid `daysLeft` number property

### Button Not Working
**Problem:** `onCreateNew` not called
**Solution:** Verify handler is passed as prop (required)

### Scrollbar Not Visible
**Problem:** Custom scrollbar not showing
**Solution:** Only visible in Webkit browsers; Firefox/Edge use default scrollbar

### Card Not Clickable
**Problem:** Card clicks not working
**Solution:** Ensure `onView` handler is provided

## Related Components

- **JobCard** - Individual job card (used internally)
- **WorkflowCardsRow** - Workflow summary cards
- **GreetingSection** - Dashboard greeting
- **ChecklistItem** - Checklist items

## Future Enhancements

Potential future features (not currently implemented):
- Drag and drop reordering
- Inline editing
- Job filtering by status
- Infinite scroll / pagination
- Job search
- Bulk actions

---

**Status:** ✅ Production Ready
**Version:** 1.0
**Last Updated:** 2024
