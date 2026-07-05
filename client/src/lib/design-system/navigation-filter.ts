import type { NavigationItem } from "@/config/navigation";
import type { PlanMode, FeatureName } from "@/types/plan";
import type { ProductFeatureId } from "@shared/planEntitlements";
import { canAccessFeature } from "@/lib/feature-gating";

/**
 * Navigation Filtering Utility
 *
 * Filters navigation items based on user's plan, permissions, and entitlements.
 * Ensures users only see navigation items they have access to.
 *
 * Features:
 * - Plan-level filtering (minPlan requirement)
 * - Feature entitlement checking
 * - Admin-only route filtering
 * - Recursive filtering for nested navigation
 * - Preserves navigation structure
 *
 * @example
 * ```tsx
 * const navigation = getNavigationForPlan('pro');
 * const filtered = filterNavigationItems(
 *   navigation.primary,
 *   'pro',
 *   { isAdmin: false, planId: 'pro', status: 'active' }
 * );
 * ```
 */

export interface UserPermissions {
  /** Is user an admin? */
  isAdmin: boolean;

  /** User's plan ID */
  planId?: string;

  /** User's plan status */
  status?: string;
}

/**
 * Plan hierarchy for minPlan filtering
 */
const planHierarchy: Record<PlanMode, number> = {
  brand: 0,
  free: 1,
  pro: 2,
  studio: 3,
  "studio-pending": 3,
  admin: 4,
};

/**
 * Check if user meets minimum plan requirement
 *
 * @param userPlanMode - User's current plan mode
 * @param minPlan - Minimum required plan mode
 * @returns True if user meets requirement
 */
function meetsMinPlanRequirement(
  userPlanMode: PlanMode,
  minPlan?: PlanMode
): boolean {
  if (!minPlan) return true;
  return planHierarchy[userPlanMode] >= planHierarchy[minPlan];
}

/**
 * Check if user has required feature entitlement
 *
 * @param feature - Required feature ID
 * @param permissions - User permissions object
 * @returns True if user has access
 */
/**
 * Mapping between ProductFeatureId and FeatureName
 *
 * Maps feature identifiers to the typed FeatureName system.
 * Features not in this map are accessible to all authenticated users.
 */
const FEATURE_ID_MAP: Partial<Record<ProductFeatureId, FeatureName>> = {
  // Pro Features
  "pipeline": "pipeline",
  "video-reviews": "video-reviews",
  "collaboration": "collaboration",
  "advanced-export": "advanced-export",

  // Studio Features
  "commercial-hub": "commercial-hub",
  "proposals": "proposals",
  "contracts": "contracts",
  "financial-module": "financial-module",
  "team-management": "team-management",
  "analytics": "analytics",
  "api": "api",
  "custom-branding": "custom-branding",
  "priority-support": "priority-support",
};

/**
 * Check if user has access to a specific feature
 *
 * Validates feature access based on plan and subscription status.
 * Integrates with the feature gating system from @/lib/feature-gating.
 *
 * @param feature - Feature ID to check
 * @param permissions - User permissions object
 * @returns True if user can access the feature
 */
function hasFeatureAccess(
  feature?: ProductFeatureId,
  permissions?: UserPermissions
): boolean {
  if (!feature) return true;
  if (!permissions) return false;
  if (permissions.isAdmin) return true;

  // Map ProductFeatureId to FeatureName (if mapping exists)
  const featureName = FEATURE_ID_MAP[feature];

  // If no mapping, feature is not gated (backward compatibility)
  if (!featureName) {
    return true;
  }

  // Use feature gating system
  try {
    const result = canAccessFeature(
      featureName,
      permissions.planId as PlanMode
    );
    return result.hasAccess;
  } catch (error) {
    // Fail open to prevent blocking users
    console.error(`Error checking feature access for ${feature}:`, error);
    return true;
  }
}

/**
 * Check if user can access admin-only routes
 *
 * @param adminOnly - Is route admin-only?
 * @param permissions - User permissions object
 * @returns True if user has access
 */
function hasAdminAccess(
  adminOnly?: boolean,
  permissions?: UserPermissions
): boolean {
  if (!adminOnly) return true;
  return permissions?.isAdmin === true;
}

/**
 * Filter navigation items based on permissions
 *
 * Recursively filters navigation items and their children,
 * removing items the user doesn't have access to.
 *
 * @param items - Navigation items to filter
 * @param planMode - User's current plan mode
 * @param permissions - User permissions object
 * @returns Filtered navigation items
 */
export function filterNavigationItems(
  items: NavigationItem[],
  planMode: PlanMode,
  permissions?: UserPermissions
): NavigationItem[] {
  return items
    .filter((item) => {
      // Check minimum plan requirement
      if (!meetsMinPlanRequirement(planMode, item.minPlan)) {
        return false;
      }

      // Check feature entitlement
      if (!hasFeatureAccess(item.feature, permissions)) {
        return false;
      }

      // Check admin access
      if (!hasAdminAccess(item.adminOnly, permissions)) {
        return false;
      }

      return true;
    })
    .map((item) => {
      // Recursively filter children
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterNavigationItems(
          item.children,
          planMode,
          permissions
        );

        // If parent has no accessible children, keep parent but remove children
        return {
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      }

      return item;
    });
}

/**
 * Get accessible routes for user (for validation)
 *
 * Returns flat array of all route paths the user can access.
 * Useful for route guards and validation.
 *
 * @param items - Navigation items to extract routes from
 * @param planMode - User's current plan mode
 * @param permissions - User permissions object
 * @returns Array of accessible route paths
 */
export function getAccessibleRoutes(
  items: NavigationItem[],
  planMode: PlanMode,
  permissions?: UserPermissions
): string[] {
  const filtered = filterNavigationItems(items, planMode, permissions);

  const extractRoutes = (navItems: NavigationItem[]): string[] => {
    return navItems.flatMap((item) => [
      item.href,
      ...(item.activeRoutes || []),
      ...(item.children ? extractRoutes(item.children) : []),
    ]);
  };

  return [...new Set(extractRoutes(filtered))];
}

/**
 * Check if user can access a specific route
 *
 * @param route - Route path to check
 * @param items - Navigation items to search
 * @param planMode - User's current plan mode
 * @param permissions - User permissions object
 * @returns True if user can access route
 */
export function canAccessRoute(
  route: string,
  items: NavigationItem[],
  planMode: PlanMode,
  permissions?: UserPermissions
): boolean {
  const accessibleRoutes = getAccessibleRoutes(items, planMode, permissions);

  // Exact match
  if (accessibleRoutes.includes(route)) return true;

  // Partial match (for nested routes like /project/123)
  return accessibleRoutes.some((accessible) =>
    route.startsWith(accessible + "/")
  );
}

/**
 * Get locked features for user (for upgrade prompts)
 *
 * Returns navigation items that are locked due to plan restrictions.
 * Useful for showing "Upgrade to unlock" UI.
 *
 * @param items - Navigation items to check
 * @param planMode - User's current plan mode
 * @param permissions - User permissions object
 * @returns Array of locked navigation items
 */
export function getLockedFeatures(
  items: NavigationItem[],
  planMode: PlanMode,
  permissions?: UserPermissions
): NavigationItem[] {
  return items
    .filter((item) => {
      // Skip items without restrictions
      if (!item.minPlan && !item.feature && !item.adminOnly) {
        return false;
      }

      // Item is locked if user doesn't meet requirements
      const meetsMinPlan = meetsMinPlanRequirement(planMode, item.minPlan);
      const hasFeature = hasFeatureAccess(item.feature, permissions);
      const hasAdmin = hasAdminAccess(item.adminOnly, permissions);

      return !meetsMinPlan || !hasFeature || !hasAdmin;
    })
    .map((item) => {
      // Recursively check children
      if (item.children && item.children.length > 0) {
        const lockedChildren = getLockedFeatures(
          item.children,
          planMode,
          permissions
        );
        return {
          ...item,
          children: lockedChildren.length > 0 ? lockedChildren : undefined,
        };
      }
      return item;
    });
}

/**
 * Get navigation item by route path
 *
 * @param route - Route path to find
 * @param items - Navigation items to search
 * @returns Navigation item if found, undefined otherwise
 */
export function findNavigationItem(
  route: string,
  items: NavigationItem[]
): NavigationItem | undefined {
  for (const item of items) {
    if (item.href === route) return item;
    if (item.activeRoutes?.includes(route)) return item;
    if (item.children) {
      const found = findNavigationItem(route, item.children);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Get breadcrumb trail for current route
 *
 * @param route - Current route path
 * @param items - Navigation items to search
 * @returns Array of navigation items forming breadcrumb trail
 */
export function getBreadcrumbs(
  route: string,
  items: NavigationItem[]
): NavigationItem[] {
  const findPath = (
    navItems: NavigationItem[],
    target: string,
    path: NavigationItem[] = []
  ): NavigationItem[] | null => {
    for (const item of navItems) {
      const currentPath = [...path, item];

      if (item.href === target) return currentPath;
      if (item.activeRoutes?.includes(target)) return currentPath;

      if (item.children) {
        const found = findPath(item.children, target, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  return findPath(items, route) || [];
}
