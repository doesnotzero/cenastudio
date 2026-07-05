/**
 * Property-Based Tests for Navigation State Management
 *
 * Uses fast-check to verify that the navigation state management algorithm
 * maintains the invariant (exactly one active tab) across ALL possible inputs.
 *
 * Property-based testing generates hundreds of random test cases to ensure
 * the algorithm is robust against edge cases and unexpected inputs.
 *
 * Verification Reference: tasks.md > Task 1.2.2 > Acceptance Criteria
 * "Property-based tests with fast-check verify uniqueness for all paths"
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  extractTabIdFromPath,
  manageNavigationState,
  validateSingleActiveTab,
  type NavTab,
  VALID_TAB_IDS,
} from './navigationState';

/**
 * Helper to create a full set of 5 navigation tabs
 */
function createFullTabSet(): NavTab[] {
  return [
    { id: 'home', label: 'HOME', icon: '🏠', path: '/dashboard', isActive: false },
    { id: 'clients', label: 'CLIENTS', icon: '👥', path: '/clients', isActive: false },
    { id: 'jobs', label: 'JOBS', icon: '🎬', path: '/projects', isActive: false },
    { id: 'studio', label: 'STUDIO', icon: '🤖', path: '/tools', isActive: false },
    { id: 'finance', label: 'FINANCE', icon: '💰', path: '/analytics', isActive: false },
  ];
}

describe('Property-Based Tests: Navigation State Management', () => {
  describe('PROPERTY: extractTabIdFromPath always returns a valid TabId', () => {
    it('should always return one of the valid tab IDs for any string input', () => {
      fc.assert(
        fc.property(
          fc.string(), // Generate any random string
          (path) => {
            const result = extractTabIdFromPath(path);

            // Property: Result must be one of the valid tab IDs
            expect(VALID_TAB_IDS).toContain(result);
          }
        ),
        { numRuns: 1000 } // Run 1000 random test cases
      );
    });

    it('should return valid TabId for paths with random segments', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          (segments) => {
            const path = '/' + segments.join('/');
            const result = extractTabIdFromPath(path);

            expect(VALID_TAB_IDS).toContain(result);
          }
        ),
        { numRuns: 500 }
      );
    });

    it('should return valid TabId for paths with special characters', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer({ min: 1, max: 1000 }),
          (prefix, id) => {
            const path = `${prefix}/${id}`;
            const result = extractTabIdFromPath(path);

            expect(VALID_TAB_IDS).toContain(result);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: manageNavigationState always produces exactly one active tab', () => {
    it('should maintain single active tab invariant for any path', () => {
      fc.assert(
        fc.property(
          fc.string(), // Any random path
          (path) => {
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Exactly one tab must be active (∃! tab where isActive=true)
            const activeCount = result.filter(t => t.isActive).length;
            expect(activeCount).toBe(1);
            expect(validateSingleActiveTab(result)).toBe(true);
          }
        ),
        { numRuns: 1000 }
      );
    });

    it('should maintain invariant for nested paths of any depth', () => {
      fc.assert(
        fc.property(
          fc.constant('home').chain(() => fc.oneof(
            fc.constant('/home'),
            fc.constant('/clients'),
            fc.constant('/projects'),
            fc.constant('/tools'),
            fc.constant('/analytics')
          )),
          fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 5 }),
          (basePath, segments) => {
            const path = basePath + (segments.length > 0 ? '/' + segments.join('/') : '');
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Single active tab invariant
            expect(result.filter(t => t.isActive).length).toBe(1);
          }
        ),
        { numRuns: 500 }
      );
    });

    it('should maintain invariant through multiple state transitions', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 2, maxLength: 10 }), // Array of paths
          (paths) => {
            let tabs = createFullTabSet();

            // Apply each path transition
            for (const path of paths) {
              tabs = manageNavigationState(path, tabs);

              // PROPERTY: After each transition, exactly one tab is active
              const activeCount = tabs.filter(t => t.isActive).length;
              expect(activeCount).toBe(1);
            }
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('PROPERTY: manageNavigationState is deterministic', () => {
    it('should produce identical results for identical inputs', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (path) => {
            const tabs1 = createFullTabSet();
            const tabs2 = createFullTabSet();

            const result1 = manageNavigationState(path, tabs1);
            const result2 = manageNavigationState(path, tabs2);

            // PROPERTY: Same input always produces same output (deterministic)
            expect(result1.map(t => t.isActive)).toEqual(result2.map(t => t.isActive));
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: manageNavigationState is idempotent for same path', () => {
    it('should produce same result when applied twice with same path', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (path) => {
            const tabs = createFullTabSet();

            const result1 = manageNavigationState(path, tabs);
            const result2 = manageNavigationState(path, result1);

            // PROPERTY: f(f(x)) = f(x) for same path (idempotent)
            expect(result1.map(t => t.isActive)).toEqual(result2.map(t => t.isActive));
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: Valid known paths map to correct tabs', () => {
    it('should always activate home tab for home-related paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/home', '/dashboard', '/'),
          fc.array(fc.string(), { maxLength: 3 }),
          (basePath, segments) => {
            const path = basePath + (segments.length > 0 ? '/' + segments.join('/') : '');
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Home paths activate home tab
            const homeTab = result.find(t => t.id === 'home');
            expect(homeTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('should always activate clients tab for client-related paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/clients', '/commercial', '/pipeline', '/proposals', '/interactions'),
          fc.option(fc.integer({ min: 1, max: 9999 }), { nil: undefined }),
          (basePath, id) => {
            const path = id ? `${basePath}/${id}` : basePath;
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Client paths activate clients tab
            const clientsTab = result.find(t => t.id === 'clients');
            expect(clientsTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('should always activate jobs tab for project-related paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/projects', '/project', '/jobs'),
          fc.option(fc.integer({ min: 1, max: 9999 }), { nil: undefined }),
          (basePath, id) => {
            const path = id ? `${basePath}/${id}` : basePath;
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Project paths activate jobs tab
            const jobsTab = result.find(t => t.id === 'jobs');
            expect(jobsTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('should always activate studio tab for studio-related paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/tools', '/studio'),
          fc.option(fc.constantFrom('/briefing', '/roteiro', '/document'), { nil: undefined }),
          (basePath, subPath) => {
            const path = subPath ? `${basePath}${subPath}` : basePath;
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Studio paths activate studio tab
            const studioTab = result.find(t => t.id === 'studio');
            expect(studioTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('should always activate finance tab for finance-related paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/analytics', '/finance'),
          fc.option(fc.constantFrom('/reports', '/revenue', '/expenses'), { nil: undefined }),
          (basePath, subPath) => {
            const path = subPath ? `${basePath}${subPath}` : basePath;
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Finance paths activate finance tab
            const financeTab = result.find(t => t.id === 'finance');
            expect(financeTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('PROPERTY: Invalid paths default to home tab', () => {
    it('should activate home tab for unrecognized paths', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => {
            // Filter out valid paths
            const validPrefixes = [
              '/home', '/dashboard', '/clients', '/commercial', '/pipeline',
              '/proposals', '/interactions', '/projects', '/project', '/jobs',
              '/tools', '/studio', '/analytics', '/finance'
            ];
            return !validPrefixes.some(prefix => s.startsWith(prefix));
          }),
          (path) => {
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Unknown paths activate home tab (safe default)
            const homeTab = result.find(t => t.id === 'home');
            expect(homeTab?.isActive).toBe(true);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: No tab is activated multiple times', () => {
    it('should never have the same tab active more than once', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (path) => {
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Each tab appears at most once in the active set
            const activeTabs = result.filter(t => t.isActive);
            const activeIds = activeTabs.map(t => t.id);
            const uniqueIds = [...new Set(activeIds)];

            expect(activeIds.length).toBe(uniqueIds.length);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: Tab order is preserved', () => {
    it('should maintain tab order regardless of which is active', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (path) => {
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            // PROPERTY: Tab order in array never changes
            const expectedOrder = ['home', 'clients', 'jobs', 'studio', 'finance'];
            const actualOrder = result.map(t => t.id);

            expect(actualOrder).toEqual(expectedOrder);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: Immutability', () => {
    it('should never mutate the input tabs array', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (path) => {
            const tabs = createFullTabSet();
            const originalState = tabs.map(t => ({ ...t })); // Deep clone

            manageNavigationState(path, tabs);

            // PROPERTY: Input is never mutated
            expect(tabs).toEqual(originalState);
          }
        ),
        { numRuns: 500 }
      );
    });
  });

  describe('PROPERTY: State transition consistency', () => {
    it('should produce consistent states through random navigation sequences', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom(
              '/home', '/clients', '/projects', '/tools', '/analytics',
              '/project/123', '/clients/456', '/tools/briefing'
            ),
            { minLength: 3, maxLength: 20 }
          ),
          (paths) => {
            let tabs = createFullTabSet();

            // Navigate through sequence
            for (const path of paths) {
              tabs = manageNavigationState(path, tabs);
            }

            // PROPERTY: Final state has exactly one active tab
            expect(validateSingleActiveTab(tabs)).toBe(true);

            // PROPERTY: Final state matches last path
            const lastPath = paths[paths.length - 1];
            const expectedTabId = extractTabIdFromPath(lastPath);
            const activeTab = tabs.find(t => t.isActive);

            expect(activeTab?.id).toBe(expectedTabId);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('PROPERTY: Exhaustive coverage of all tab IDs', () => {
    it('should be possible to activate each tab with at least one path', () => {
      const tabActivationMap = new Map<string, boolean>();
      VALID_TAB_IDS.forEach(id => tabActivationMap.set(id, false));

      fc.assert(
        fc.property(
          fc.constantFrom(...[
            '/home', '/clients', '/projects', '/tools', '/analytics',
            '/dashboard', '/commercial', '/project/1', '/studio', '/finance'
          ]),
          (path) => {
            const tabs = createFullTabSet();
            const result = manageNavigationState(path, tabs);

            const activeTab = result.find(t => t.isActive);
            if (activeTab) {
              tabActivationMap.set(activeTab.id, true);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );

      // PROPERTY: Every valid tab can be activated
      VALID_TAB_IDS.forEach(id => {
        expect(tabActivationMap.get(id)).toBe(true);
      });
    });
  });
});

describe('Stress Tests: High-volume navigation scenarios', () => {
  it('should handle 1000 rapid path changes maintaining invariant', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1000, maxLength: 1000 }),
        (paths) => {
          let tabs = createFullTabSet();

          for (const path of paths) {
            tabs = manageNavigationState(path, tabs);

            // Must maintain invariant on every single iteration
            expect(validateSingleActiveTab(tabs)).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 5 } // Run 5 times with 1000 paths each = 5000 total validations
    );
  });

  it('should handle deeply nested paths without breaking invariant', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 10, maxLength: 20 }),
        (segments) => {
          const deepPath = '/' + segments.join('/');
          const tabs = createFullTabSet();
          const result = manageNavigationState(deepPath, tabs);

          expect(validateSingleActiveTab(result)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
