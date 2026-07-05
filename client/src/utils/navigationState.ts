/**
 * Navigation State Management Utility
 *
 * Implements the navigation state management algorithm ensuring exactly one tab
 * is active at any time, with route-based tab activation and browser back/forward
 * button support.
 *
 * Algorithm Design Reference: design.md > Algorithmic Pseudocode > Navigation State Management Algorithm
 */

export interface NavTab {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive: boolean;
}

/**
 * Valid tab identifiers
 */
export const VALID_TAB_IDS = ['home', 'clients', 'jobs', 'studio', 'finance'] as const;
export type TabId = typeof VALID_TAB_IDS[number];

/**
 * Route to tab ID mappings for nested routes
 */
const ROUTE_TO_TAB_MAP: Record<string, TabId> = {
  '/dashboard': 'home',
  '/home': 'home',
  '/': 'home',

  '/commercial': 'clients',
  '/clients': 'clients',
  '/pipeline': 'clients',
  '/interactions': 'clients',
  '/proposals': 'clients',

  '/projects': 'jobs',
  '/project': 'jobs',
  '/jobs': 'jobs',

  '/tools': 'studio',
  '/studio': 'studio',

  '/analytics': 'finance',
  '/finance': 'finance',
};

/**
 * Extracts tab identifier from a URL path.
 *
 * ALGORITHM extractTabIdFromPath(path: string) RETURNS string
 *   PRECONDITION: path is non-empty string starting with '/'
 *   POSTCONDITION: Returns valid tab identifier or 'home' as default
 *
 * @param path - The URL path (e.g., '/clients', '/project/123', '/home')
 * @returns Tab identifier ('home', 'clients', 'jobs', 'studio', 'finance') or 'home' as default
 *
 * @example
 * extractTabIdFromPath('/home') // returns 'home'
 * extractTabIdFromPath('/clients') // returns 'clients'
 * extractTabIdFromPath('/project/123') // returns 'jobs' (parent mapping)
 * extractTabIdFromPath('/invalid') // returns 'home' (default fallback)
 */
export function extractTabIdFromPath(path: string): TabId {
  // Handle empty or invalid paths
  if (!path || typeof path !== 'string') {
    return 'home';
  }

  // Normalize path: remove trailing slash, ensure leading slash
  let normalizedPath = path.trim();
  if (normalizedPath.endsWith('/') && normalizedPath.length > 1) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }

  // Try exact match first
  if (normalizedPath in ROUTE_TO_TAB_MAP) {
    return ROUTE_TO_TAB_MAP[normalizedPath];
  }

  // Try partial match for nested routes (e.g., /project/123 → /project → jobs)
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const firstSegment = '/' + pathSegments[0];
    if (firstSegment in ROUTE_TO_TAB_MAP) {
      return ROUTE_TO_TAB_MAP[firstSegment];
    }

    // Check if first segment is a valid tab ID directly
    const firstSegmentWithoutSlash = pathSegments[0] as string;
    if (VALID_TAB_IDS.includes(firstSegmentWithoutSlash as TabId)) {
      return firstSegmentWithoutSlash as TabId;
    }
  }

  // Default fallback
  return 'home';
}

/**
 * Manages navigation state ensuring exactly one tab is active at any time.
 *
 * ALGORITHM manageNavigationState(currentPath, navigationTabs)
 *   INPUT: currentPath: string, navigationTabs: NavTab[]
 *   OUTPUT: updatedTabs: NavTab[] with correct active states
 *   PRECONDITION: currentPath is valid route path
 *   POSTCONDITION: Exactly one tab has isActive = true
 *
 * Loop Invariant: After each iteration, all processed tabs have correct isActive state
 *
 * @param currentPath - The current URL path
 * @param navigationTabs - Array of navigation tabs
 * @returns Updated array of navigation tabs with correct active states
 *
 * @throws {Error} If postcondition (exactly one active tab) is violated
 *
 * @example
 * const tabs = [
 *   { id: 'home', label: 'HOME', icon: '🏠', path: '/dashboard', isActive: false },
 *   { id: 'clients', label: 'CLIENTS', icon: '👥', path: '/clients', isActive: false },
 * ];
 * const updated = manageNavigationState('/clients', tabs);
 * // updated[1].isActive === true, updated[0].isActive === false
 */
export function manageNavigationState(
  currentPath: string,
  navigationTabs: NavTab[]
): NavTab[] {
  // Step 1: Extract tab ID from current path
  const tabId = extractTabIdFromPath(currentPath);

  // Step 2: Create new array with updated active states
  // Loop invariant: All previously processed tabs have correct isActive state
  const updatedTabs = navigationTabs.map(tab => ({
    ...tab,
    isActive: tab.id === tabId
  }));

  // Step 3: Validate postcondition - exactly one tab must be active
  const activeCount = updatedTabs.filter(tab => tab.isActive).length;

  // Assert exactly one active tab (∃! tab where isActive=true)
  if (activeCount !== 1) {
    throw new Error(
      `Navigation state invariant violated: Expected exactly 1 active tab, got ${activeCount}. ` +
      `Path: "${currentPath}", TabId: "${tabId}"`
    );
  }

  return updatedTabs;
}

/**
 * Validates that exactly one tab is active in the given tabs array.
 *
 * @param tabs - Array of navigation tabs to validate
 * @returns true if exactly one tab is active, false otherwise
 */
export function validateSingleActiveTab(tabs: NavTab[]): boolean {
  const activeCount = tabs.filter(tab => tab.isActive).length;
  return activeCount === 1;
}

/**
 * Creates a default set of navigation tabs with the home tab active.
 *
 * @returns Array of 5 navigation tabs with home as the default active tab
 */
export function createDefaultNavigationTabs(): NavTab[] {
  return [
    { id: 'home', label: 'HOME', icon: '🏠', path: '/dashboard', isActive: true },
    { id: 'clients', label: 'CLIENTS', icon: '👥', path: '/clients', isActive: false },
    { id: 'jobs', label: 'JOBS', icon: '🎬', path: '/projects', isActive: false },
    { id: 'studio', label: 'STUDIO', icon: '🤖', path: '/tools', isActive: false },
    { id: 'finance', label: 'FINANCE', icon: '💰', path: '/analytics', isActive: false },
  ];
}
