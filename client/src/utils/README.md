# Navigation State Management

## Overview

This module implements the navigation state management algorithm for the Cena Studio Platform rebrand Phase 1. It ensures that exactly one navigation tab is active at any time, with proper route-based activation and browser back/forward button support.

## Files

- **`navigationState.ts`** - Core implementation of the navigation state management algorithm
- **`navigationState.test.ts`** - Comprehensive unit tests covering all acceptance criteria
- **`navigationState.property.test.ts`** - Property-based tests using fast-check to verify invariants across all possible inputs

## Algorithm

The navigation state management follows this algorithm (from `design.md`):

```pascal
ALGORITHM manageNavigationState(currentPath, navigationTabs)
INPUT: currentPath: string, navigationTabs: NavTab[]
OUTPUT: updatedTabs: NavTab[] with correct active states

PRECONDITION: currentPath is valid route path
POSTCONDITION: Exactly one tab has isActive = true

BEGIN
  // Step 1: Normalize path to tab identifier
  tabId ← extractTabIdFromPath(currentPath)

  // Step 2: Update active states
  FOR each tab IN navigationTabs DO
    INVARIANT: All previously processed tabs have correct isActive state

    IF tab.id = tabId THEN
      tab.isActive ← true
    ELSE
      tab.isActive ← false
    END IF
  END FOR

  // Step 3: Validate single active tab
  activeCount ← COUNT tabs WHERE isActive = true
  ASSERT activeCount = 1

  RETURN navigationTabs
END
```

## Key Features

### 1. Route to Tab Mapping

The module supports mapping from URL paths to tab identifiers:

- **HOME**: `/`, `/home`, `/dashboard`
- **CLIENTS**: `/clients`, `/commercial`, `/pipeline`, `/proposals`, `/interactions`
- **JOBS**: `/jobs`, `/projects`, `/project/:id`
- **STUDIO**: `/studio`, `/tools`
- **FINANCE**: `/finance`, `/analytics`

### 2. Nested Route Support

Nested routes automatically map to their parent tab:
- `/project/123` → `jobs` tab
- `/clients/456` → `clients` tab
- `/tools/briefing` → `studio` tab

### 3. Default Fallback

Unknown or invalid paths default to the `home` tab for safety.

### 4. Invariant Guarantee

**Loop Invariant**: After each iteration, exactly one tab has `isActive=true`

This is enforced by:
1. The algorithm itself (deactivates all, then activates one)
2. Runtime assertion that throws if violated
3. Comprehensive test coverage

## API Reference

### `extractTabIdFromPath(path: string): TabId`

Extracts the tab identifier from a URL path.

**Parameters:**
- `path` - The URL path (e.g., `/clients`, `/project/123`)

**Returns:**
- Tab identifier: `'home' | 'clients' | 'jobs' | 'studio' | 'finance'`

**Examples:**
```typescript
extractTabIdFromPath('/home')         // returns 'home'
extractTabIdFromPath('/clients')      // returns 'clients'
extractTabIdFromPath('/project/123')  // returns 'jobs' (parent mapping)
extractTabIdFromPath('/invalid')      // returns 'home' (default fallback)
```

### `manageNavigationState(currentPath: string, navigationTabs: NavTab[]): NavTab[]`

Manages navigation state ensuring exactly one tab is active.

**Parameters:**
- `currentPath` - The current URL path
- `navigationTabs` - Array of navigation tabs

**Returns:**
- Updated array of navigation tabs with correct active states

**Throws:**
- `Error` if the postcondition (exactly one active tab) is violated

**Examples:**
```typescript
const tabs = createDefaultNavigationTabs();
const updated = manageNavigationState('/clients', tabs);
// updated[1].isActive === true (clients tab)
// All other tabs have isActive === false
```

### `validateSingleActiveTab(tabs: NavTab[]): boolean`

Validates that exactly one tab is active in the given tabs array.

**Parameters:**
- `tabs` - Array of navigation tabs to validate

**Returns:**
- `true` if exactly one tab is active, `false` otherwise

### `createDefaultNavigationTabs(): NavTab[]`

Creates a default set of 5 navigation tabs with home as the active tab.

**Returns:**
- Array of 5 navigation tabs with correct initial state

## Testing

### Unit Tests (`navigationState.test.ts`)

Comprehensive unit tests covering:
- ✅ Valid routes (primary paths)
- ✅ Nested routes (parent mapping)
- ✅ Invalid/unknown paths (default to home)
- ✅ Edge cases (path normalization)
- ✅ Single active tab property for all paths
- ✅ State transitions
- ✅ Immutability
- ✅ Browser navigation scenarios
- ✅ Integration tests

### Property-Based Tests (`navigationState.property.test.ts`)

Uses `fast-check` to verify invariants across thousands of random inputs:

- ✅ **Always returns valid TabId** - 1000 random test cases
- ✅ **Exactly one active tab** - 1000 random test cases
- ✅ **Deterministic** - Same input produces same output
- ✅ **Idempotent** - f(f(x)) = f(x) for same path
- ✅ **Correct tab mapping** - Valid paths activate correct tabs
- ✅ **Default fallback** - Invalid paths default to home
- ✅ **No duplicate activations** - Each tab appears at most once
- ✅ **Order preservation** - Tab order never changes
- ✅ **Immutability** - Input is never mutated
- ✅ **State transition consistency** - Through random sequences
- ✅ **Exhaustive coverage** - All tabs can be activated
- ✅ **Stress tests** - 1000+ rapid path changes

### Running Tests

```bash
# Run all navigation state tests
npm test -- navigationState

# Run with coverage
npm run test:coverage -- navigationState

# Run only unit tests
npm test -- navigationState.test

# Run only property-based tests
npm test -- navigationState.property.test
```

## Usage in Components

### Example: Integration with AppNavBar

```typescript
import { manageNavigationState, createDefaultNavigationTabs } from '@/utils/navigationState';
import { useLocation } from 'wouter';

function AppNavBar() {
  const [location] = useLocation();
  const [tabs, setTabs] = useState(createDefaultNavigationTabs());

  useEffect(() => {
    // Update active tab based on current route
    const updatedTabs = manageNavigationState(location, tabs);
    setTabs(updatedTabs);
  }, [location]);

  return (
    <nav>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={tab.isActive ? 'active' : ''}
          onClick={() => navigate(tab.path)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

### Example: Manual Tab Activation

```typescript
import { extractTabIdFromPath } from '@/utils/navigationState';

// Determine which tab should be active for a given path
const tabId = extractTabIdFromPath(window.location.pathname);
console.log(`Active tab: ${tabId}`);
```

## Acceptance Criteria Verification

✅ **AC1**: `manageNavigationState` function implemented matching pseudocode in design.md
✅ **AC2**: `extractTabIdFromPath` handles all valid routes (/home, /clients, /jobs, /studio, /finance)
✅ **AC3**: Nested routes map to parent tab (e.g., /project/123 → jobs)
✅ **AC4**: Invalid/unknown paths default to 'home'
✅ **AC5**: Exactly one tab active after state update (∃! tab where isActive=true)
✅ **AC6**: Unit tests verify single active tab property
✅ **AC7**: Property-based tests with fast-check verify uniqueness for all paths

## Design References

- **Spec**: `.kiro/specs/rebrand-fase1-fundacao/tasks.md` > Task 1.2.2
- **Algorithm**: `.kiro/specs/rebrand-fase1-fundacao/design.md` > Algorithmic Pseudocode > Navigation State Management Algorithm
- **Requirements**: `.kiro/specs/rebrand-fase1-fundacao/requirements.md` > FR-002, FR-003, FR-004

## Dependencies

- **TypeScript** - Type safety and interfaces
- **Vitest** - Unit testing framework
- **fast-check** - Property-based testing library

## Performance Characteristics

- **Time Complexity**: O(n) where n is the number of tabs (constant 5 in practice)
- **Space Complexity**: O(n) for creating a new array (immutable approach)
- **Deterministic**: Same input always produces same output
- **Side-effect free**: Pure functions with no mutations

## License

MIT
