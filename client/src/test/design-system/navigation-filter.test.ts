/**
 * Navigation Filter Unit Tests
 * 
 * Tests the navigation filtering system for:
 * - Plan-level filtering (minPlan requirement)
 * - Feature entitlement checking
 * - Admin-only route filtering
 * - Recursive filtering for nested navigation
 * - Accessible route calculation
 * - Locked feature detection
 * - Breadcrumb generation
 */

import { describe, it, expect } from 'vitest';
import {
  filterNavigationItems,
  getAccessibleRoutes,
  canAccessRoute,
  getLockedFeatures,
  findNavigationItem,
  getBreadcrumbs,
  type UserPermissions,
} from '@/lib/design-system/navigation-filter';
import type { NavigationItem } from '@/config/navigation';
import type { PlanMode } from '@/types/plan';

describe('Navigation Filter', () => {
  // Mock navigation items for testing
  const mockNavigation: NavigationItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: 'Home',
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: 'Briefcase',
      feature: 'projects',
      minPlan: 'free',
    },
    {
      href: '/pipeline',
      label: 'Pipeline',
      icon: 'LayoutList',
      feature: 'pipeline',
      minPlan: 'pro',
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: 'DollarSign',
      feature: 'analytics',
      minPlan: 'studio',
      badge: 'Gold',
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: 'Shield',
      adminOnly: true,
    },
    {
      href: '/commercial',
      label: 'Commercial',
      icon: 'TrendingUp',
      children: [
        {
          href: '/clients',
          label: 'Clients',
          icon: 'Users',
        },
        {
          href: '/proposals',
          label: 'Proposals',
          icon: 'FileText',
          feature: 'pipeline',
        },
      ],
    },
  ];

  describe('filterNavigationItems', () => {
    it('should return all items for admin user', () => {
      const permissions: UserPermissions = {
        isAdmin: true,
        planId: 'free',
        status: 'active',
      };

      const filtered = filterNavigationItems(mockNavigation, 'admin', permissions);

      expect(filtered).toHaveLength(mockNavigation.length);
    });

    it('should filter out pro-only items for free plan', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      const filtered = filterNavigationItems(mockNavigation, 'free', permissions);

      // Should not include pipeline (requires pro)
      expect(filtered.find((item) => item.href === '/pipeline')).toBeUndefined();
      
      // Should not include analytics (requires studio)
      expect(filtered.find((item) => item.href === '/analytics')).toBeUndefined();
      
      // Should not include admin (requires admin role)
      expect(filtered.find((item) => item.href === '/admin')).toBeUndefined();
    });

    it('should include pro items for pro plan', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'pro',
        status: 'active',
      };

      const filtered = filterNavigationItems(mockNavigation, 'pro', permissions);

      // Should include pipeline
      expect(filtered.find((item) => item.href === '/pipeline')).toBeDefined();
      
      // Should not include studio-only analytics
      expect(filtered.find((item) => item.href === '/analytics')).toBeUndefined();
    });

    it('should include all items for studio plan (except admin)', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'studio',
        status: 'active',
      };

      const filtered = filterNavigationItems(mockNavigation, 'studio', permissions);

      expect(filtered.find((item) => item.href === '/dashboard')).toBeDefined();
      expect(filtered.find((item) => item.href === '/projects')).toBeDefined();
      expect(filtered.find((item) => item.href === '/pipeline')).toBeDefined();
      expect(filtered.find((item) => item.href === '/analytics')).toBeDefined();
      expect(filtered.find((item) => item.href === '/admin')).toBeUndefined();
    });

    it('should recursively filter nested navigation', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      const filtered = filterNavigationItems(mockNavigation, 'free', permissions);

      const commercial = filtered.find((item) => item.href === '/commercial');
      expect(commercial).toBeDefined();
      expect(commercial?.children).toBeDefined();
      
      // Clients should be included (no restrictions)
      expect(commercial?.children?.find((c) => c.href === '/clients')).toBeDefined();
      
      // Proposals should be excluded (requires pipeline feature)
      expect(commercial?.children?.find((c) => c.href === '/proposals')).toBeUndefined();
    });

    it('should filter by feature entitlement', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'pro',
        status: 'trial', // Trial might not have all features
      };

      const filtered = filterNavigationItems(mockNavigation, 'pro', permissions);

      // Items without feature requirement should be included
      expect(filtered.find((item) => item.href === '/dashboard')).toBeDefined();
    });
  });

  describe('getAccessibleRoutes', () => {
    it('should return flat list of accessible routes', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      const routes = getAccessibleRoutes(mockNavigation, 'free', permissions);

      expect(routes).toContain('/dashboard');
      expect(routes).toContain('/projects');
      expect(routes).toContain('/clients');
      expect(routes).not.toContain('/pipeline');
      expect(routes).not.toContain('/analytics');
      expect(routes).not.toContain('/admin');
    });

    it('should include nested routes', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'studio',
        status: 'active',
      };

      const routes = getAccessibleRoutes(mockNavigation, 'studio', permissions);

      expect(routes).toContain('/clients');
      expect(routes).toContain('/proposals');
    });
  });

  describe('canAccessRoute', () => {
    it('should return true for accessible route', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      expect(canAccessRoute('/dashboard', mockNavigation, 'free', permissions)).toBe(true);
      expect(canAccessRoute('/projects', mockNavigation, 'free', permissions)).toBe(true);
    });

    it('should return false for restricted route', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      expect(canAccessRoute('/pipeline', mockNavigation, 'free', permissions)).toBe(false);
      expect(canAccessRoute('/analytics', mockNavigation, 'free', permissions)).toBe(false);
      expect(canAccessRoute('/admin', mockNavigation, 'free', permissions)).toBe(false);
    });

    it('should handle nested routes', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      expect(canAccessRoute('/clients', mockNavigation, 'free', permissions)).toBe(true);
      expect(canAccessRoute('/proposals', mockNavigation, 'free', permissions)).toBe(false);
    });

    it('should match partial routes', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'pro',
        status: 'active',
      };

      // /projects/123 should match /projects
      expect(canAccessRoute('/projects/123', mockNavigation, 'pro', permissions)).toBe(true);
    });
  });

  describe('getLockedFeatures', () => {
    it('should return locked features for free plan', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      const locked = getLockedFeatures(mockNavigation, 'free', permissions);

      expect(locked.find((item) => item.href === '/pipeline')).toBeDefined();
      expect(locked.find((item) => item.href === '/analytics')).toBeDefined();
      expect(locked.find((item) => item.href === '/admin')).toBeDefined();
    });

    it('should return empty for admin user', () => {
      const permissions: UserPermissions = {
        isAdmin: true,
        planId: 'free',
        status: 'active',
      };

      const locked = getLockedFeatures(mockNavigation, 'admin', permissions);

      expect(locked).toHaveLength(0);
    });

    it('should return studio-only features for pro plan', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'pro',
        status: 'active',
      };

      const locked = getLockedFeatures(mockNavigation, 'pro', permissions);

      expect(locked.find((item) => item.href === '/analytics')).toBeDefined();
      expect(locked.find((item) => item.href === '/pipeline')).toBeUndefined();
    });
  });

  describe('findNavigationItem', () => {
    it('should find top-level item by href', () => {
      const item = findNavigationItem('/dashboard', mockNavigation);

      expect(item).toBeDefined();
      expect(item?.label).toBe('Dashboard');
    });

    it('should find nested item', () => {
      const item = findNavigationItem('/clients', mockNavigation);

      expect(item).toBeDefined();
      expect(item?.label).toBe('Clients');
    });

    it('should return undefined for non-existent route', () => {
      const item = findNavigationItem('/nonexistent', mockNavigation);

      expect(item).toBeUndefined();
    });
  });

  describe('getBreadcrumbs', () => {
    it('should return breadcrumb trail for top-level route', () => {
      const breadcrumbs = getBreadcrumbs('/dashboard', mockNavigation);

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].label).toBe('Dashboard');
    });

    it('should return breadcrumb trail for nested route', () => {
      const breadcrumbs = getBreadcrumbs('/clients', mockNavigation);

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].label).toBe('Commercial');
      expect(breadcrumbs[1].label).toBe('Clients');
    });

    it('should return empty array for non-existent route', () => {
      const breadcrumbs = getBreadcrumbs('/nonexistent', mockNavigation);

      expect(breadcrumbs).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty navigation array', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'free',
        status: 'active',
      };

      const filtered = filterNavigationItems([], 'free', permissions);

      expect(filtered).toHaveLength(0);
    });

    it('should handle navigation without permissions', () => {
      const filtered = filterNavigationItems(mockNavigation, 'free', undefined);

      // Should still work but filter out feature-gated items
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should handle unknown plan mode gracefully', () => {
      const permissions: UserPermissions = {
        isAdmin: false,
        planId: 'unknown',
        status: 'active',
      };

      // @ts-expect-error Testing invalid plan mode
      const filtered = filterNavigationItems(mockNavigation, 'unknown', permissions);

      // Should not crash
      expect(Array.isArray(filtered)).toBe(true);
    });
  });
});
