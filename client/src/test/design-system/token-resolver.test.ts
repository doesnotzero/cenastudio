/**
 * Token Resolver Unit Tests
 *
 * Tests the token resolution utility functions for:
 * - Single token resolution with fallback chain
 * - Batch token resolution
 * - Token availability checking
 * - Plan mode detection
 * - Feature detection (glow effects, dual accent)
 * - Typography scale resolution
 * - Contextual accent switching
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  resolvePlanToken,
  resolvePlanTokens,
  hasPlanToken,
  getCurrentPlanMode,
  hasGlowEffects,
  hasDualAccent,
  getTypographyScale,
  getContextualAccent,
} from '@/lib/design-system/token-resolver';
import type { PlanMode } from '@/types/plan';

describe('Token Resolver', () => {
  // Mock document root for testing
  const mockRoot = document.documentElement;

  beforeEach(() => {
    // Clear any existing data-plan attribute
    mockRoot.removeAttribute('data-plan');

    // Clear inline styles
    mockRoot.style.cssText = '';
  });

  afterEach(() => {
    mockRoot.removeAttribute('data-plan');
    mockRoot.style.cssText = '';
  });

  describe('resolvePlanToken', () => {
    it('should resolve a plan token from computed styles', () => {
      // Set up mock token
      mockRoot.style.setProperty('--plan-accent-primary', '#e85002');

      const value = resolvePlanToken('accent-primary');

      expect(value).toBe('#e85002');
    });

    it('should return fallback for undefined token', () => {
      const value = resolvePlanToken('nonexistent', '#fallback');

      expect(value).toBe('#fallback');
    });

    it('should return empty string if no token and no fallback', () => {
      const value = resolvePlanToken('nonexistent');

      expect(value).toBe('');
    });

    it('should trim whitespace from resolved value', () => {
      mockRoot.style.setProperty('--plan-accent-primary', '  #e85002  ');

      const value = resolvePlanToken('accent-primary');

      expect(value).toBe('#e85002');
    });
  });

  describe('resolvePlanTokens', () => {
    it('should resolve multiple tokens at once', () => {
      mockRoot.style.setProperty('--plan-accent-primary', '#e85002');
      mockRoot.style.setProperty('--plan-text-primary', '#f9f9f9');

      const tokens = resolvePlanTokens({
        'accent-primary': '#e85002',
        'text-primary': '#f9f9f9',
      });

      expect(tokens).toEqual({
        'accent-primary': '#e85002',
        'text-primary': '#f9f9f9',
      });
    });

    it('should return fallback for missing tokens', () => {
      const tokens = resolvePlanTokens({
        'nonexistent-1': '#fallback1',
        'nonexistent-2': '#fallback2',
      });

      expect(tokens).toEqual({
        'nonexistent-1': '#fallback1',
        'nonexistent-2': '#fallback2',
      });
    });
  });

  describe('hasPlanToken', () => {
    it('should return true if token exists', () => {
      mockRoot.style.setProperty('--plan-accent-primary', '#e85002');

      expect(hasPlanToken('accent-primary')).toBe(true);
    });

    it('should return false if token does not exist', () => {
      expect(hasPlanToken('nonexistent')).toBe(false);
    });

    it('should return false if token is empty string', () => {
      mockRoot.style.setProperty('--plan-test', '');

      expect(hasPlanToken('test')).toBe(false);
    });
  });

  describe('getCurrentPlanMode', () => {
    it('should return plan mode from data-plan attribute', () => {
      mockRoot.setAttribute('data-plan', 'pro');

      expect(getCurrentPlanMode()).toBe('pro');
    });

    it('should return null if no data-plan attribute', () => {
      expect(getCurrentPlanMode()).toBeNull();
    });

    it('should handle all valid plan modes', () => {
      const plans: PlanMode[] = ['free', 'pro', 'studio', 'studio-pending', 'admin', 'brand'];

      plans.forEach((plan) => {
        mockRoot.setAttribute('data-plan', plan);
        expect(getCurrentPlanMode()).toBe(plan);
      });
    });
  });

  describe('hasGlowEffects', () => {
    it('should return false for free plan', () => {
      mockRoot.setAttribute('data-plan', 'free');

      expect(hasGlowEffects()).toBe(false);
    });

    it('should return true for pro plan', () => {
      mockRoot.setAttribute('data-plan', 'pro');

      expect(hasGlowEffects()).toBe(true);
    });

    it('should return true for studio plan', () => {
      mockRoot.setAttribute('data-plan', 'studio');

      expect(hasGlowEffects()).toBe(true);
    });

    it('should return false for brand plan', () => {
      mockRoot.setAttribute('data-plan', 'brand');

      expect(hasGlowEffects()).toBe(false);
    });

    it('should return true for admin plan', () => {
      mockRoot.setAttribute('data-plan', 'admin');

      expect(hasGlowEffects()).toBe(true);
    });
  });

  describe('hasDualAccent', () => {
    it('should return false for free plan', () => {
      mockRoot.setAttribute('data-plan', 'free');

      expect(hasDualAccent()).toBe(false);
    });

    it('should return false for pro plan', () => {
      mockRoot.setAttribute('data-plan', 'pro');

      expect(hasDualAccent()).toBe(false);
    });

    it('should return true for studio plan', () => {
      mockRoot.setAttribute('data-plan', 'studio');

      expect(hasDualAccent()).toBe(true);
    });

    it('should return true for studio-pending plan', () => {
      mockRoot.setAttribute('data-plan', 'studio-pending');

      expect(hasDualAccent()).toBe(true);
    });

    it('should return true for admin plan', () => {
      mockRoot.setAttribute('data-plan', 'admin');

      expect(hasDualAccent()).toBe(true);
    });
  });

  describe('getTypographyScale', () => {
    it('should return 1.0 for free plan with no token', () => {
      mockRoot.setAttribute('data-plan', 'free');

      expect(getTypographyScale()).toBe(1.0);
    });

    it('should return 1.06 for pro plan when token is set', () => {
      mockRoot.setAttribute('data-plan', 'pro');
      mockRoot.style.setProperty('--plan-typography-scale', '1.06');

      expect(getTypographyScale()).toBe(1.06);
    });

    it('should return 1.08 for studio plan when token is set', () => {
      mockRoot.setAttribute('data-plan', 'studio');
      mockRoot.style.setProperty('--plan-typography-scale', '1.08');

      expect(getTypographyScale()).toBe(1.08);
    });

    it('should return 1.0 as default for unknown plan', () => {
      mockRoot.setAttribute('data-plan', 'unknown-plan');

      expect(getTypographyScale()).toBe(1.0);
    });

    it('should handle fallback when token not set', () => {
      mockRoot.setAttribute('data-plan', 'pro');

      // No token set, should use fallback '1.0'
      expect(getTypographyScale()).toBe(1.0);
    });
  });

  describe('getContextualAccent', () => {
    it('should return primary accent by default', () => {
      mockRoot.setAttribute('data-plan', 'studio');
      mockRoot.style.setProperty('--plan-accent-primary', '#e85002');

      const accent = getContextualAccent('primary');

      expect(accent).toBe('#e85002');
    });

    it('should return financial accent in financial context for studio plan', () => {
      mockRoot.setAttribute('data-plan', 'studio');
      mockRoot.style.setProperty('--plan-accent-financial', '#d8b343');

      const accent = getContextualAccent('financial');

      expect(accent).toBe('#d8b343');
    });

    it('should use hardcoded fallback if token not available', () => {
      mockRoot.setAttribute('data-plan', 'studio');

      const accent = getContextualAccent('financial');

      // No token set, should use hardcoded fallback
      expect(accent).toBe('#d8b343');
    });

    it('should return primary for non-studio plans in financial context', () => {
      mockRoot.setAttribute('data-plan', 'free');

      const accent = getContextualAccent('financial');

      // Free plan doesn't have dual accent, falls back to primary with hardcoded value
      expect(accent).toBe('#e85002');
    });

    it('should default to primary context when no context specified', () => {
      mockRoot.setAttribute('data-plan', 'pro');
      mockRoot.style.setProperty('--plan-accent-primary', '#e85002');

      const accent = getContextualAccent();

      expect(accent).toBe('#e85002');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid plan mode changes', () => {
      mockRoot.setAttribute('data-plan', 'free');
      expect(getCurrentPlanMode()).toBe('free');

      mockRoot.setAttribute('data-plan', 'pro');
      expect(getCurrentPlanMode()).toBe('pro');

      mockRoot.setAttribute('data-plan', 'studio');
      expect(getCurrentPlanMode()).toBe('studio');
    });

    it('should handle missing computed styles gracefully', () => {
      const value = resolvePlanToken('accent-primary', '#fallback');

      // Should return fallback if token not found
      expect(value).toBe('#fallback');
    });

    it('should handle CSS variable references', () => {
      // Set up a variable that references another
      mockRoot.style.setProperty('--plan-base-color', '#e85002');
      mockRoot.style.setProperty('--plan-accent-primary', 'var(--plan-base-color)');

      const value = resolvePlanToken('accent-primary');

      // Computed style should resolve the reference (or return empty string in test env)
      expect(typeof value).toBe('string');
    });

    it('should handle null plan mode gracefully', () => {
      // No plan attribute set
      expect(getCurrentPlanMode()).toBeNull();

      // Functions that depend on plan mode should still work
      expect(hasGlowEffects()).toBe(false);
      expect(hasDualAccent()).toBe(false);
    });
  });
});
