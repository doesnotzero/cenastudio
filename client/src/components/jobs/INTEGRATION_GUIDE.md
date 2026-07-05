# CreateJobModal Integration Guide

## Quick Start

### Step 1: Import Components

```tsx
import { useState, useEffect } from 'react';
import { ActiveJobsColumn } from '@/components/dashboard/ActiveJobsColumn';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { Job } from '@/components/dashboard/JobCard';
import { Client, api } from '@/lib/api';
```

### Step 2: Add State

```tsx
function YourDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients on mount
  useEffect(() => {
    api.clients.list()
      .then(setClients)
      .catch(console.error);
  }, []);

  // ... rest of component
}
```

### Step 3: Add Handlers

```tsx
const handleCreateNew = () => {
  setIsModalOpen(true);
};

const handleJobCreated = (newJob: Job) => {
  // Optimistic update: add to list immediately
  setJobs(prevJobs => [...prevJobs, newJob]);

  // Optional: show success notification
  console.log('Job created:', newJob);

  // Optional: navigate to job details
  // navigate(`/jobs/${newJob.id}`);
};
```

### Step 4: Render Components

```tsx
return (
  <div>
    <ActiveJobsColumn
      jobs={jobs}
      onCreateNew={handleCreateNew}
      onView={(id) => navigate(`/jobs/${id}`)}
      onEdit={(id) => console.log('Edit', id)}
    />

    <CreateJobModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={handleJobCreated}
      clients={clients}
    />
  </div>
);
```

---

## Complete Example

```tsx
import React, { useState, useEffect } from 'react';
import { ActiveJobsColumn } from '@/components/dashboard/ActiveJobsColumn';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { Job } from '@/components/dashboard/JobCard';
import { Client, api } from '@/lib/api';

export function Dashboard() {
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      api.clients.list(),
      // Fetch jobs from your API
      // api.jobs.list()
    ])
      .then(([clientsData]) => {
        setClients(clientsData);
        // setJobs(jobsData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handlers
  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleJobCreated = (newJob: Job) => {
    // Add to jobs list
    setJobs(prevJobs => [...prevJobs, newJob]);

    // Show success message
    console.log('✅ Job created successfully:', newJob.title);

    // Optional: Navigate to job details
    // navigate(`/jobs/${newJob.id}`);
  };

  const handleViewJob = (id: string) => {
    console.log('Navigate to job:', id);
    // navigate(`/jobs/${id}`);
  };

  const handleEditJob = (id: string) => {
    console.log('Edit job:', id);
    // Open edit modal or navigate to edit page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>

      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={handleCreateNew}
        onView={handleViewJob}
        onEdit={handleEditJob}
      />

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </div>
  );
}
```

---

## Integration Patterns

### Pattern 1: With React Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function DashboardWithReactQuery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: api.clients.list,
  });

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: api.jobs.list,
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: api.jobs.create,
    onSuccess: () => {
      // Invalidate jobs cache to refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleJobCreated = (newJob: Job) => {
    // Optimistic update
    queryClient.setQueryData(['jobs'], (old: Job[]) => [...old, newJob]);
  };

  return (
    <>
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={() => setIsModalOpen(true)}
      />
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}
```

### Pattern 2: With Toast Notifications

```tsx
import { toast } from 'sonner';

function DashboardWithToast() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const handleJobCreated = (newJob: Job) => {
    // Add to list
    setJobs([...jobs, newJob]);

    // Show success toast
    toast.success(`Job "${newJob.title}" criado com sucesso!`, {
      description: `Cliente: ${newJob.client}`,
      action: {
        label: 'Ver Job',
        onClick: () => navigate(`/jobs/${newJob.id}`),
      },
    });
  };

  return (
    <>
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={() => setIsModalOpen(true)}
      />
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}
```

### Pattern 3: With Navigation

```tsx
import { useLocation } from 'wouter';

function DashboardWithNavigation() {
  const [, navigate] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const handleJobCreated = (newJob: Job) => {
    // Navigate to job details immediately after creation
    navigate(`/jobs/${newJob.id}`);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        + Create Job
      </button>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}
```

### Pattern 4: With Error Handling

```tsx
function DashboardWithErrorHandling() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    api.clients.list()
      .then(setClients)
      .catch(err => {
        setError('Erro ao carregar clientes');
        console.error(err);
      });
  }, []);

  const handleJobCreated = (newJob: Job) => {
    try {
      setJobs([...jobs, newJob]);
      setError('');
      console.log('Job created:', newJob);
    } catch (err) {
      setError('Erro ao adicionar job');
      console.error(err);
    }
  };

  return (
    <>
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}

      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={() => setIsModalOpen(true)}
      />

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleJobCreated}
        clients={clients}
      />
    </>
  );
}
```

---

## Backend Requirements

### API Endpoint

You need to implement this endpoint:

```typescript
// POST /api/jobs
router.post('/jobs', authenticate, async (req, res) => {
  try {
    const { title, clientId, deadline, status } = req.body;
    const userId = req.user.id; // From JWT token

    // Validate inputs
    if (!title || title.trim().length < 3 || title.trim().length > 200) {
      return res.status(400).json({ error: 'Invalid title' });
    }
    if (!clientId) {
      return res.status(400).json({ error: 'Client is required' });
    }
    if (!deadline || new Date(deadline) < new Date()) {
      return res.status(400).json({ error: 'Invalid deadline' });
    }
    if (!['briefing', 'production', 'review', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Create job in database
    const job = await db.job.create({
      data: {
        title: title.trim(),
        clientId: parseInt(clientId),
        deadline: new Date(deadline),
        status,
        userId,
        progress: 0,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: job.id.toString(),
        title: job.title,
        clientId: job.clientId.toString(),
        deadline: job.deadline.toISOString().split('T')[0],
        status: job.status,
      },
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Database Schema

```prisma
model Job {
  id        Int      @id @default(autoincrement())
  title     String
  clientId  Int
  client    Client   @relation(fields: [clientId], references: [id])
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  status    String   // briefing, production, review, delivered
  deadline  DateTime
  progress  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Troubleshooting

### Modal not opening?
- Check `isModalOpen` state is being set to `true`
- Verify `onCreateNew` handler is connected
- Check browser console for errors

### Form not submitting?
- Check all fields are valid (title 3-200 chars, client selected, future deadline)
- Verify API endpoint exists at `/api/jobs`
- Check network tab for request/response
- Verify JWT token is included in request

### Clients not loading?
- Check `api.clients.list()` is implemented
- Verify API endpoint `/api/clients` exists
- Check network tab for 200 response
- Verify clients array is passed to modal

### Form not resetting?
- Modal should reset automatically when `isOpen` changes from `true` to `false`
- Check `useEffect` dependency on `isOpen`
- Verify modal is being unmounted properly

### TypeScript errors?
- Run `npm run check` to see all errors
- Verify all imports are correct
- Check `Job` and `Client` types are imported
- Ensure `CreateJobFormData` interface matches form

---

## Testing

### Unit Tests

```bash
npm run test -- CreateJobModal.test.tsx
```

### Integration Tests

```tsx
// Test with your dashboard
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

test('creates job from dashboard', async () => {
  render(<Dashboard />);

  // Click create button
  const createButton = screen.getByText('+ NOVO JOB');
  fireEvent.click(createButton);

  // Modal should open
  expect(screen.getByText('Criar Novo Job')).toBeInTheDocument();

  // Fill form...
  // Submit...
  // Verify job appears in list...
});
```

### E2E Tests

```typescript
// Playwright test
test('complete job creation flow', async ({ page }) => {
  await page.goto('/dashboard');

  // Click create button
  await page.click('text=+ NOVO JOB');

  // Fill form
  await page.fill('[aria-label*="Título"]', 'New Project');
  await page.selectOption('[aria-label*="Cliente"]', '1');
  await page.fill('[aria-label*="Deadline"]', '2024-12-31');

  // Submit
  await page.click('text=Criar Job');

  // Verify job appears
  await expect(page.locator('text=New Project')).toBeVisible();
});
```

---

## Common Issues

### Issue: "Cliente é obrigatório" even when client is selected
**Solution**: Make sure client value is being passed as string ID, not object

### Issue: API returns 401 Unauthorized
**Solution**: Verify JWT token is included in request with `credentials: 'include'`

### Issue: Job not appearing in list after creation
**Solution**: Make sure `onSuccess` callback is updating state correctly

### Issue: Modal doesn't close after successful creation
**Solution**: Verify `onClose` is being called in success flow

### Issue: Date picker shows past dates
**Solution**: Input has `min={today}` attribute, but browser support may vary

---

## Performance Tips

1. **Memoize handlers**: Use `useCallback` for handlers passed to child components
2. **Lazy load modal**: Only render when `isOpen` is true
3. **Debounce validation**: Add debounce for real-time validation if needed
4. **Optimistic updates**: Update UI immediately, don't wait for API
5. **Cache clients**: Use React Query or similar to cache client list

---

## Accessibility Checklist

- [x] All form fields have labels
- [x] Required fields marked with aria-required
- [x] Error messages linked with aria-describedby
- [x] Invalid fields marked with aria-invalid
- [x] Keyboard navigation works (Tab, Enter, Escape)
- [x] Focus management (auto-focus close button)
- [x] Screen reader announcements (role="alert")
- [x] Color contrast meets WCAG AA standards
- [x] Works with keyboard only
- [x] Works with screen readers

---

## Next Steps

1. **Implement backend**: Create POST /api/jobs endpoint
2. **Test integration**: Connect modal to your dashboard
3. **Add notifications**: Use toast library for success/error messages
4. **Add navigation**: Redirect to job details after creation
5. **Add analytics**: Track job creation events
6. **Add validation**: Server-side validation for security
7. **Add features**: Consider templates, drafts, bulk creation

---

For more details, see:
- `CreateJobModal.md` - Complete component documentation
- `CreateJobModal.example.tsx` - More usage examples
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
