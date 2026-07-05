/**
 * Feature Gating Index
 * 
 * Central export point for feature gating utilities.
 */

export {
  canAccessFeature,
  getRequiredPlan,
  hasAccessToAll,
  hasAccessToAny,
  getAccessibleFeatures,
  getLockedFeatures,
  isPlanHigherThan,
  getNextPlan,
} from "./gate";
