# CommandPalette Component

## Overview

The CommandPalette component provides a keyboard-accessible, searchable navigation interface for quick access to all sections of the Cena Studio application. It implements the 5-tab navigation structure (HOME, CLIENTS, JOBS, STUDIO, FINANCE) as specified in the Phase 1 rebrand design.

## Features

### ✅ Keyboard Shortcuts
- **Cmd+K** (Mac) / **Ctrl+K** (Windows/Linux) opens the command palette
- **Esc** key closes the modal
- Works from any page in the application

### ✅ 5-Tab Primary Navigation
The command palette prominently displays the 5 main navigation tabs:
1. **HOME** (`/dashboard`) - Dashboard and workflow overview
2. **CLIENTS** (`/commercial`) - Client management and CRM
3. **JOBS** (`/projects`) - Project/job management
4. **STUDIO** (`/tools`) - AI Studio tools
5. **FINANCE** (`/analytics`) - Financial analytics

### ✅ Fuzzy Search
Real-time filtering with intelligent fuzzy matching:
- Exact substring matches: "client" matches "clients"
- Character-in-order matches: "cli" matches "clients"
- Keyword matching: "crm" matches "CLIENTS" via keywords
- Case-insensitive search
- Multilingual support (Portuguese/English)

### ✅ Navigation Hierarchy
Commands are organized into logical groups:
- **Primary Navigation** - 5 main tabs
- **Navigation** - Secondary pages
- **Quick Actions** - Common tasks (e.g., "New Client")
- **Projects** - Recent projects (up to 8 shown)

### ✅ Accessibility
- `role="dialog"` for screen readers
- `aria-modal="true"` for modal behavior
- `aria-labelledby` for dialog title
- Focus trap inside modal when open
- Keyboard navigation with arrow keys
- Enter key to select highlighted option

## Usage

### Basic Integration

```tsx
import CommandPalette from "@/components/CommandPalette";

function App() {
  return (
    <>
      <CommandPalette />
      {/* Rest of your app */}
    </>
  );
}
```

### Opening Programmatically

```typescript
// From anywhere in the application
window.dispatchEvent(new Event("cena:open-command-palette"));
```

### Keyboard Shortcut
Users can press **Cmd+K** (or **Ctrl+K**) from anywhere to open the palette.

## Translation Keys

The component uses the following translation keys (must be defined in `translationsSupplemental.ts`):

### Modal UI
- `app.commandPalette.title` - Modal title
- `app.commandPalette.description` - Modal description
- `app.commandPalette.placeholder` - Search input placeholder
- `app.commandPalette.noResults` - No results message

### Section Headers
- `app.commandPalette.primaryNav` - Primary navigation header
- `app.commandPalette.navigation` - Secondary navigation header
- `app.commandPalette.actions` - Quick actions header

### Navigation Labels
- `app.nav.home` - HOME tab
- `app.nav.clients` - CLIENTS tab
- `app.nav.jobs` - JOBS tab
- `app.nav.studio` - STUDIO tab
- `app.nav.finance` - FINANCE tab
- `app.nav.projects` - Projects section header

### Command Labels
- `app.commandPalette.cmd.clients` - Clients list
- `app.commandPalette.cmd.pipeline` - Pipeline
- `app.commandPalette.cmd.interactions` - Interactions
- `app.commandPalette.cmd.proposals` - Proposals
- `app.commandPalette.cmd.documents` - Documents
- `app.commandPalette.cmd.videoReviews` - Video reviews
- `app.commandPalette.cmd.team` - Team
- `app.commandPalette.cmd.profile` - Profile
- `app.commandPalette.cmd.admin` - Admin (only shown to admins)
- `app.commandPalette.cmd.newClient` - New client action

## Fuzzy Search Algorithm

The component implements a custom fuzzy search algorithm with three matching strategies:

### 1. Exact Match
```
Query: "client"
Target: "clients"
Result: ✓ Match (substring found)
```

### 2. Character-in-Order Match
```
Query: "cli"
Target: "clients"
Result: ✓ Match (c-l-i found in order)
```

### 3. Keyword Match
```
Query: "crm"
Target: "CLIENTS"
Keywords: ["clients", "commercial", "crm"]
Result: ✓ Match (keyword matches)
```

### Examples

| Query | Target | Keywords | Match | Reason |
|-------|--------|----------|-------|---------|
| "cli" | "clients" | [] | ✓ | Characters in order |
| "home" | "HOME" | ["dashboard"] | ✓ | Exact match (case-insensitive) |
| "ia" | "STUDIO" | ["ai", "ia", "tools"] | ✓ | Keyword match |
| "proj" | "JOBS" | ["projects", "jobs"] | ✓ | Keyword match |
| "xyz" | "clients" | [] | ✗ | No match |

## Command Structure

Each command is defined with:

```typescript
interface CommandItemDef {
  labelKey: string;        // Translation key
  label: string;          // English label for fuzzy search
  path: string;           // Navigation path
  icon: React.Component;  // Lucide icon component
  category: "primary" | "secondary" | "actions";
  keywords: string[];     // Additional search terms
}
```

### Example Command

```typescript
{
  labelKey: "app.nav.clients",
  label: "CLIENTS",
  path: "/commercial",
  icon: Users,
  category: "primary",
  keywords: ["clients", "clientes", "commercial", "crm"]
}
```

## Testing

### Unit Tests
Run the test suite:
```bash
npm test -- CommandPalette.test.tsx
```

### Test Coverage
- ✅ Keyboard shortcuts (Cmd+K, Ctrl+K, Esc)
- ✅ 5-tab navigation display
- ✅ Fuzzy search filtering
- ✅ Navigation actions
- ✅ Accessibility attributes
- ✅ Global event listener
- ✅ Project search
- ✅ Admin access control

### Fuzzy Search Tests
Run algorithm-specific tests:
```bash
npm test -- fuzzySearch.test.ts
```

## Acceptance Criteria Status

| # | Criteria | Status |
|---|----------|--------|
| 1 | Cmd+K (Mac) / Ctrl+K (Windows/Linux) opens search modal | ✅ |
| 2 | Modal shows all 5 tabs: HOME, CLIENTS, JOBS, STUDIO, FINANCE | ✅ |
| 3 | Typing filters options in real-time (fuzzy match on label) | ✅ |
| 4 | Arrow keys navigate between options (highlight selected) | ✅ * |
| 5 | Enter key navigates to highlighted option | ✅ |
| 6 | Esc key closes modal | ✅ |
| 7 | Search works from any page | ✅ |
| 8 | Focus trapped inside modal when open | ✅ |
| 9 | Glass effect styling applied to modal backdrop | ✅ ** |
| 10 | ARIA attributes: role="dialog", aria-modal="true", aria-labelledby | ✅ |

\* Arrow key navigation is handled by the underlying `cmdk` library
\** Glass effect styling is provided by the `CommandDialog` component from `@/components/ui/command`

## Dependencies

- `cmdk` - Command menu component library
- `lucide-react` - Icon library
- `wouter` - Routing library
- `@radix-ui/react-dialog` - Dialog primitive (via ui/command)

## Architecture

```
CommandPalette
├── Keyboard Event Listeners (Cmd+K, Esc)
├── Custom Event Listener (cena:open-command-palette)
├── CommandDialog (from ui/command)
│   ├── CommandInput (search field)
│   └── CommandList
│       ├── CommandEmpty (no results)
│       ├── CommandGroup (Primary Navigation)
│       │   └── PRIMARY_TABS (5 items)
│       ├── CommandGroup (Secondary Navigation)
│       │   └── SECONDARY_COMMANDS (filtered)
│       ├── CommandGroup (Quick Actions)
│       │   └── ACTION_COMMANDS (e.g., New Client)
│       └── CommandGroup (Projects)
│           └── filteredProjects (up to 8)
└── Navigation Handler (setLocation on select)
```

## Performance

- **Fuzzy search**: O(n*m) where n = target length, m = query length
- **Filtering**: Happens on every keystroke (debouncing not needed due to small dataset)
- **Project limit**: Max 8 projects shown to prevent overwhelming the UI
- **Lazy rendering**: CommandDialog only renders when `open` is true

## Future Enhancements

Possible improvements for future iterations:
- [ ] Recent command history
- [ ] Command usage analytics
- [ ] Custom keyboard shortcuts per command
- [ ] Command aliases
- [ ] Debounced search for large datasets
- [ ] Highlight matching characters in results
- [ ] MRU (Most Recently Used) sorting

## Related Components

- `AppNavBar` - Main navigation bar that includes CommandPalette trigger button
- `ui/command` - Base command menu components from shadcn/ui
- `ui/dialog` - Dialog primitive used by CommandDialog

## Version History

- **v1.0** - Initial implementation with 5-tab navigation and fuzzy search
- Task: 1.2.3 - Add Search Command Palette (Cmd+K)
- Priority: P1
- Dependencies: 1.2.1 (TopNav Refactor) ✅
