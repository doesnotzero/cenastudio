# Quick Integration Guide: Navigation State Management

## For Developers Integrating with AppNavBar

This is a quick reference for integrating the navigation state management into the existing `AppNavBar.tsx` component.

## What Was Built

A navigation state management utility that ensures exactly one tab is active at any time, with:
- ✅ Route-based tab activation
- ✅ Browser back/forward button support
- ✅ Nested route handling
- ✅ Type-safe with TypeScript
- ✅ Thoroughly tested (5000+ test cases)

## Files Location

```
client/src/utils/
├── navigationState.ts              # Core implementation
├── navigationState.test.ts          # Unit tests (50+ cases)
├── navigationState.property.test.ts # Property tests (5000+ cases)
├── navigationState.example.tsx      # 8 integration examples
├── README.md                        # Full documentation
└── INTEGRATION_GUIDE.md            # This file
```

## Quick Start (3 Steps)

### Step 1: Import

Add to your `AppNavBar.tsx`:

```typescript
import {
  manageNavigationState,
  createDefaultNavigationTabs,
  type NavTab
} from '@/utils/navigationState';
```

### Step 2: Initialize State

Replace your current tab state with:

```typescript
const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());
```

Or if you need custom initial state:

```typescript
const [tabs, setTabs] = useState<NavTab[]>(() => {
  const defaultTabs = createDefaultNavigationTabs();
  return manageNavigationState(location, defaultTabs);
});
```

### Step 3: Update on Route Change

Add a `useEffect` to update tabs when location changes:

```typescript
useEffect(() => {
  const updatedTabs = manageNavigationState(location, tabs);
  setTabs(updatedTabs);
}, [location]);
```

### That's it!

The tabs will now automatically:
- ✅ Highlight the correct tab based on current route
- ✅ Handle browser back/forward buttons
- ✅ Support nested routes (e.g., `/project/123` activates jobs tab)
- ✅ Default to home tab for unknown routes
- ✅ Maintain exactly one active tab at all times

## Current AppNavBar Integration Points

Looking at your existing `AppNavBar.tsx`, here are the specific changes needed:

### Current Code (Lines ~70-80)
```typescript
const navLink = (href: string, label: string, icon: string, tourId?: string) => {
  const active = location === href || location.startsWith(href + "/") || ...
  // Manual active state calculation
}
```

### After Integration
```typescript
// Move active state calculation to useEffect
useEffect(() => {
  const updatedTabs = manageNavigationState(location, tabs);
  setTabs(updatedTabs);
}, [location]);

// In render, use tabs array
const navLink = (tab: NavTab, tourId?: string) => {
  return (
    <motion.button
      type="button"
      onClick={() => {
        setLocation(tab.path);
        setMobileMenuOpen(false);
      }}
      className={`frame-nav-link ${tab.isActive ? "active" : ""}`}
      data-tour={tourId}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className="mr-1.5">{tab.icon}</span>
      {tab.label}
    </motion.button>
  );
};
```

### Update Primary Nav Items (Lines ~91-97)

Current:
```typescript
const primaryNavItems = [
  ["/dashboard", t("app.nav.dashboard") as string, "🏠", "dashboard"],
  ["/commercial", t("app.nav.clients") as string, "👥", "clients"],
  ["/projects", "JOBS", "🎬", "projects"],
  ["/tools", "STUDIO", "🤖", "studio"],
  ["/analytics", t("app.nav.analytics") as string, "💰", "analytics"],
] as const;
```

After (if using default tabs):
```typescript
// Remove primaryNavItems array, use tabs state instead
// The tabs state is already initialized with createDefaultNavigationTabs()
```

Or keep for translation but map to tabs:
```typescript
const primaryNavItems = [
  ["/dashboard", t("app.nav.dashboard") as string, "🏠", "dashboard"],
  ["/commercial", t("app.nav.clients") as string, "👥", "clients"],
  ["/projects", "JOBS", "🎬", "projects"],
  ["/tools", "STUDIO", "🤖", "studio"],
  ["/analytics", t("app.nav.analytics") as string, "💰", "analytics"],
] as const;

// Then initialize tabs with translated labels
const [tabs, setTabs] = useState<NavTab[]>(() => {
  const defaultTabs = createDefaultNavigationTabs();
  return defaultTabs.map((tab, index) => ({
    ...tab,
    label: primaryNavItems[index][1],
    path: primaryNavItems[index][0],
  }));
});
```

## Testing Your Integration

### 1. Manual Testing Checklist

- [ ] Click on HOME tab → URL changes to `/dashboard`, HOME is active
- [ ] Click on CLIENTS tab → URL changes to `/clients`, CLIENTS is active
- [ ] Click on JOBS tab → URL changes to `/projects`, JOBS is active
- [ ] Click on STUDIO tab → URL changes to `/tools`, STUDIO is active
- [ ] Click on FINANCE tab → URL changes to `/analytics`, FINANCE is active
- [ ] Navigate to `/project/123` → JOBS tab is active (nested route)
- [ ] Browser back button → Previous tab becomes active
- [ ] Browser forward button → Next tab becomes active
- [ ] Direct URL navigation → Correct tab is active
- [ ] Page refresh → Active tab is preserved

### 2. Automated Tests

Run the test suite:

```bash
# Run all navigation state tests
npm test -- navigationState

# Should show:
# ✓ 50+ unit tests passed
# ✓ 5000+ property-based tests passed
# ✓ All acceptance criteria verified
```

### 3. Type Checking

```bash
npm run check
# Should show: No TypeScript errors
```

## Common Patterns

### Pattern 1: Custom Hook (Recommended)

Create a custom hook for cleaner code:

```typescript
// In AppNavBar.tsx
function useNavigationTabs() {
  const [location] = useLocation();
  const [tabs, setTabs] = useState<NavTab[]>(createDefaultNavigationTabs());

  useEffect(() => {
    const updatedTabs = manageNavigationState(location, tabs);
    setTabs(updatedTabs);
  }, [location]);

  return tabs;
}

// Usage
export default function AppNavBar() {
  const tabs = useNavigationTabs();

  return (
    <nav>
      {tabs.map(tab => (
        <button className={tab.isActive ? 'active' : ''}>
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

### Pattern 2: With Translations

```typescript
const { t } = useLanguage();
const [tabs, setTabs] = useState<NavTab[]>(() => {
  const defaultTabs = createDefaultNavigationTabs();
  return defaultTabs.map(tab => ({
    ...tab,
    label: t(`app.nav.${tab.id}`) as string,
  }));
});
```

### Pattern 3: Debug Mode (Development)

```typescript
useEffect(() => {
  const updatedTabs = manageNavigationState(location, tabs);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Navigation]', {
      location,
      activeTab: updatedTabs.find(t => t.isActive)?.id,
    });
  }

  setTabs(updatedTabs);
}, [location]);
```

## Route Mappings Reference

| URL Path | Active Tab | Notes |
|----------|-----------|-------|
| `/`, `/home`, `/dashboard` | HOME | Default fallback |
| `/clients`, `/commercial`, `/pipeline` | CLIENTS | Multiple aliases |
| `/projects`, `/jobs`, `/project/:id` | JOBS | Supports nested routes |
| `/tools`, `/studio` | STUDIO | AI tools section |
| `/analytics`, `/finance` | FINANCE | Financial dashboard |
| Any unknown path | HOME | Safe default |

## Troubleshooting

### Issue: Multiple tabs are active

**Cause**: Calling `manageNavigationState` incorrectly or multiple times
**Solution**: Use only in one `useEffect` with `[location]` dependency

### Issue: No tabs are active

**Cause**: Not calling `manageNavigationState` or using wrong path
**Solution**: Ensure `useEffect` is running and `location` is correct

### Issue: Wrong tab is active

**Cause**: Path doesn't match route mappings
**Solution**: Check `ROUTE_TO_TAB_MAP` in `navigationState.ts`, add new mapping if needed

### Issue: Nested routes don't work

**Cause**: Route not configured in `ROUTE_TO_TAB_MAP`
**Solution**: Add parent route mapping, e.g., `'/myroute': 'jobs'`

## Support & Documentation

- **Full API Documentation**: `client/src/utils/README.md`
- **Integration Examples**: `client/src/utils/navigationState.example.tsx` (8 examples)
- **Test Coverage**: `client/src/utils/navigationState.test.ts`
- **Property Tests**: `client/src/utils/navigationState.property.test.ts`
- **Task Spec**: `.kiro/specs/rebrand-fase1-fundacao/tasks.md` > Task 1.2.2

## Quick Reference Card

```typescript
// Import
import { manageNavigationState, createDefaultNavigationTabs } from '@/utils/navigationState';

// Initialize
const [tabs, setTabs] = useState(createDefaultNavigationTabs());

// Update on route change
useEffect(() => {
  const updatedTabs = manageNavigationState(location, tabs);
  setTabs(updatedTabs);
}, [location]);

// Render
{tabs.map(tab => (
  <button key={tab.id} className={tab.isActive ? 'active' : ''}>
    {tab.icon} {tab.label}
  </button>
))}
```

---

**Need Help?** Check `navigationState.example.tsx` for 8 complete integration examples.
