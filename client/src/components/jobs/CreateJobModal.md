# CreateJobModal Component

## Overview

Modal component for creating new jobs with a 4-step form (title, client, deadline, status). Features comprehensive validation, error handling, and API integration.

## Features

- **4-Field Form**: Title, client, deadline, and status fields
- **Real-time Validation**: Live validation with error messages
- **Client Dropdown**: Autocomplete-style dropdown with client list
- **Date Picker**: Future date validation for deadlines
- **Status Dropdown**: 4 status options (briefing, production, review, delivered)
- **API Integration**: POST /api/jobs with loading states
- **Error Handling**: Display API errors with retry capability
- **Optimistic Updates**: Immediate UI feedback on success
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Form Reset**: Automatic reset on close or success

## Usage

```tsx
import { CreateJobModal } from '@/components/jobs/CreateJobModal';
import { useState } from 'react';

function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients on mount
  useEffect(() => {
    api.clients.list().then(setClients);
  }, []);

  const handleSuccess = (newJob: Job) => {
    console.log('Job created:', newJob);
    // Optionally navigate to job details
    navigate(`/jobs/${newJob.id}`);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>+ Novo Job</Button>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        clients={clients}
      />
    </>
  );
}
```

## Props

### CreateJobModalProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback when modal closes |
| `onSuccess` | `(newJob: Job) => void` | No | Callback when job is successfully created |
| `clients` | `Client[]` | No | List of clients for dropdown (default: []) |

## Form Data

### CreateJobFormData

```typescript
interface CreateJobFormData {
  title: string;        // 3-200 characters
  clientId: string;     // Valid client ID
  deadline: string;     // ISO date (YYYY-MM-DD), today or future
  status: JobStatus;    // 'briefing' | 'production' | 'review' | 'delivered'
}
```

## Validation Rules

### Title
- **Required**: Yes
- **Min Length**: 3 characters
- **Max Length**: 200 characters
- **Trimming**: Whitespace is trimmed
- **Error Messages**:
  - Empty: "Título é obrigatório"
  - Too short: "Título deve ter pelo menos 3 caracteres"
  - Too long: "Título deve ter no máximo 200 caracteres"

### Client
- **Required**: Yes
- **Type**: Must be valid client ID from list
- **Error Messages**:
  - Empty: "Cliente é obrigatório"

### Deadline
- **Required**: Yes
- **Type**: Date (YYYY-MM-DD format)
- **Validation**: Must be today or future date
- **Error Messages**:
  - Empty: "Deadline é obrigatório"
  - Past date: "Deadline deve ser hoje ou uma data futura"

### Status
- **Required**: Yes
- **Default**: "briefing"
- **Options**: briefing, production, review, delivered
- **Error Messages**:
  - Invalid: "Status inválido"

## API Integration

### Request

```http
POST /api/jobs
Content-Type: application/json
Credentials: include

{
  "title": "Project Title",
  "clientId": "1",
  "deadline": "2024-12-31",
  "status": "briefing"
}
```

### Response (Success)

```json
{
  "success": true,
  "data": {
    "id": "job-123",
    "title": "Project Title",
    "clientId": "1",
    "deadline": "2024-12-31",
    "status": "briefing"
  }
}
```

### Response (Error)

```json
{
  "error": "Error message here"
}
```

Status codes: 400 (validation), 401 (unauthorized), 500 (server error)

## User Flow

1. User clicks "+ NOVO JOB" button
2. Modal opens with empty form
3. User fills in:
   - Title (text input)
   - Client (dropdown)
   - Deadline (date picker)
   - Status (dropdown, default: briefing)
4. Real-time validation as user types/selects
5. Submit button enabled when all fields valid
6. User clicks "Criar Job"
7. Loading state: "Criando..."
8. Success: Job created, onSuccess callback, modal closes
9. Error: Error message displayed, modal stays open for retry

## Error Handling

### Validation Errors
- Displayed below each field
- Red border on invalid fields
- Error icon with aria-describedby

### API Errors
- Displayed at top of form
- Red background banner
- Retry: Keep modal open, allow resubmit
- Clear on form edit

### Network Errors
- Caught and displayed as API errors
- User can retry submission

## Accessibility

- **ARIA Labels**: All fields have aria-label
- **ARIA Required**: Required fields marked
- **ARIA Invalid**: Invalid fields marked
- **ARIA Describedby**: Error messages linked to fields
- **Keyboard Navigation**: Tab through fields, Enter to submit, Escape to close
- **Focus Management**: Auto-focus on close button
- **Screen Reader**: Error messages announced via role="alert"

## Testing

Comprehensive test suite with 30+ tests covering:
- Modal rendering
- Form field display
- Title validation (required, min/max length, trimming)
- Client validation (required, dropdown)
- Deadline validation (required, future date)
- Status options (4 options, default)
- Submit button (disabled/enabled states)
- Cancel/close behavior
- API calls (POST request, correct payload)
- Success flow (callback, modal close)
- Error handling (400, 401, 500, retry)
- Form reset (on close, on success)
- Edge cases (empty clients, network error, enter key)

Run tests:
```bash
npm run test -- CreateJobModal.test.tsx
```

## Integration with ActiveJobsColumn

```tsx
import { ActiveJobsColumn } from '@/components/dashboard/ActiveJobsColumn';
import { CreateJobModal } from '@/components/jobs/CreateJobModal';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs([...jobs, newJob]); // Optimistic update
  };

  return (
    <>
      <ActiveJobsColumn
        jobs={jobs}
        onCreateNew={handleCreateNew}
        onView={(id) => navigate(`/jobs/${id}`)}
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

## Styling

- **Modal**: Glass effect with backdrop blur (via AnimatedModal)
- **Form Fields**: Dark theme, semi-transparent backgrounds
- **Borders**: Red for errors, orange for focus
- **Typography**: Plan tokens for text colors
- **Spacing**: 24px between fields, 16px internal padding
- **Responsive**: Full width on mobile, max-w-2xl on desktop

## Dependencies

- `@/components/AnimatedModal`: Modal wrapper with animations
- `@/design-system/primitives/Button`: Button component
- `@/components/dashboard/JobCard`: Job and JobStatus types
- `@/lib/api`: Client type
- `react`: useState, useEffect

## Future Enhancements

- [ ] Client creation from modal ("+ New Client" option)
- [ ] Multi-step wizard with progress indicator
- [ ] Deadline suggestions (e.g., "1 week", "2 weeks")
- [ ] Status descriptions/tooltips
- [ ] Draft save functionality
- [ ] Duplicate job from existing
- [ ] Bulk job creation
- [ ] Templates for common job types
