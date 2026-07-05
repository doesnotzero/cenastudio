/**
 * Typography Scale Utility
 * 
 * Provides plan-aware typography scaling functions that:
 * 1. Read plan-specific scale multipliers from CSS tokens
 * 2. Apply consistent scaling across all text elements
 * 3. Maintain typographic hierarchy
 * 
 * Scale multipliers:
 * - Free: 1.0 (base scale, minimal aesthetic)
 * - Pro: 1.06 (filmmaker cockpit, enhanced presence)
 * - Studio: 1.08 (command center, premium presence)
 */

import { resolvePlanToken, getTypographyScale } from './token-resolver';

/**
 * Base font sizes (in px)
 * These define the typographic hierarchy at 1.0 scale
 */
export const BASE_FONT_SIZES = {
  // Display sizes (hero sections, landing pages)
  'display-2xl': 72,
  'display-xl': 60,
  'display-lg': 48,
  'display-md': 36,
  'display-sm': 30,
  
  // Heading sizes (section titles, page headers)
  'heading-xl': 24,
  'heading-lg': 20,
  'heading-md': 18,
  'heading-sm': 16,
  'heading-xs': 14,
  
  // Body sizes (main content, descriptions)
  'body-xl': 18,
  'body-lg': 16,
  'body-md': 14,
  'body-sm': 13,
  'body-xs': 12,
  
  // Label sizes (UI labels, captions)
  'label-lg': 14,
  'label-md': 13,
  'label-sm': 12,
  'label-xs': 11,
} as const;

export type FontSizeKey = keyof typeof BASE_FONT_SIZES;

/**
 * Font weight tokens
 * Semantic weight names that map to numeric values
 */
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export type FontWeight = keyof typeof FONT_WEIGHTS;

/**
 * Line height ratios
 * Optimized for readability across different font sizes
 */
export const LINE_HEIGHT_RATIOS = {
  // Tight line height for display text
  tight: 1.1,
  
  // Snug line height for headings
  snug: 1.25,
  
  // Normal line height for body text
  normal: 1.5,
  
  // Relaxed line height for long-form content
  relaxed: 1.75,
} as const;

export type LineHeightRatio = keyof typeof LINE_HEIGHT_RATIOS;

/**
 * Get scaled font size for current plan
 * 
 * Applies plan-specific scale multiplier to base font size.
 * 
 * @param sizeKey - Font size key from BASE_FONT_SIZES
 * @returns Scaled font size in pixels
 * 
 * @example
 * ```typescript
 * // Free plan (1.0 scale): 24px
 * // Pro plan (1.06 scale): 25.44px
 * // Studio plan (1.08 scale): 25.92px
 * const fontSize = getScaledFontSize('heading-xl');
 * ```
 */
export function getScaledFontSize(sizeKey: FontSizeKey): number {
  const baseSize = BASE_FONT_SIZES[sizeKey];
  const scale = getTypographyScale();
  return Math.round(baseSize * scale * 100) / 100; // Round to 2 decimal places
}

/**
 * Get scaled font size as CSS value
 * 
 * Returns scaled font size with 'px' unit for use in inline styles or CSS-in-JS.
 * 
 * @param sizeKey - Font size key from BASE_FONT_SIZES
 * @returns Scaled font size as CSS value (e.g., "25.44px")
 * 
 * @example
 * ```tsx
 * <h1 style={{ fontSize: getScaledFontSizeCSS('heading-xl') }}>
 *   Scaled Heading
 * </h1>
 * ```
 */
export function getScaledFontSizeCSS(sizeKey: FontSizeKey): string {
  return `${getScaledFontSize(sizeKey)}px`;
}

/**
 * Get font weight value
 * 
 * Converts semantic weight name to numeric value.
 * 
 * @param weight - Semantic font weight name
 * @returns Numeric font weight value
 * 
 * @example
 * ```typescript
 * const weight = getFontWeight('semibold'); // 600
 * ```
 */
export function getFontWeight(weight: FontWeight): number {
  return FONT_WEIGHTS[weight];
}

/**
 * Get line height value
 * 
 * Calculates absolute line height based on font size and ratio.
 * 
 * @param sizeKey - Font size key
 * @param ratio - Line height ratio
 * @returns Line height in pixels
 * 
 * @example
 * ```typescript
 * const lineHeight = getLineHeight('body-md', 'normal');
 * // Free: 14px * 1.5 = 21px
 * // Pro: 14.84px * 1.5 = 22.26px
 * ```
 */
export function getLineHeight(
  sizeKey: FontSizeKey,
  ratio: LineHeightRatio = 'normal'
): number {
  const fontSize = getScaledFontSize(sizeKey);
  const lineHeightRatio = LINE_HEIGHT_RATIOS[ratio];
  return Math.round(fontSize * lineHeightRatio * 100) / 100;
}

/**
 * Get line height as CSS value
 * 
 * Returns line height with 'px' unit for use in inline styles.
 * 
 * @param sizeKey - Font size key
 * @param ratio - Line height ratio
 * @returns Line height as CSS value
 * 
 * @example
 * ```tsx
 * <p style={{ 
 *   fontSize: getScaledFontSizeCSS('body-md'),
 *   lineHeight: getLineHeightCSS('body-md', 'normal')
 * }}>
 *   Scaled body text
 * </p>
 * ```
 */
export function getLineHeightCSS(
  sizeKey: FontSizeKey,
  ratio: LineHeightRatio = 'normal'
): string {
  return `${getLineHeight(sizeKey, ratio)}px`;
}

/**
 * Typography preset configurations
 * 
 * Pre-configured typography styles for common use cases.
 * Each preset includes font size, weight, and line height.
 */
export const TYPOGRAPHY_PRESETS = {
  // Display presets (hero sections)
  'display-hero': {
    sizeKey: 'display-2xl' as FontSizeKey,
    weight: 'bold' as FontWeight,
    lineHeight: 'tight' as LineHeightRatio,
  },
  'display-title': {
    sizeKey: 'display-xl' as FontSizeKey,
    weight: 'bold' as FontWeight,
    lineHeight: 'tight' as LineHeightRatio,
  },
  
  // Heading presets (section titles)
  'heading-page': {
    sizeKey: 'heading-xl' as FontSizeKey,
    weight: 'semibold' as FontWeight,
    lineHeight: 'snug' as LineHeightRatio,
  },
  'heading-section': {
    sizeKey: 'heading-lg' as FontSizeKey,
    weight: 'semibold' as FontWeight,
    lineHeight: 'snug' as LineHeightRatio,
  },
  'heading-card': {
    sizeKey: 'heading-md' as FontSizeKey,
    weight: 'medium' as FontWeight,
    lineHeight: 'snug' as LineHeightRatio,
  },
  
  // Body presets (main content)
  'body-large': {
    sizeKey: 'body-xl' as FontSizeKey,
    weight: 'normal' as FontWeight,
    lineHeight: 'normal' as LineHeightRatio,
  },
  'body-default': {
    sizeKey: 'body-md' as FontSizeKey,
    weight: 'normal' as FontWeight,
    lineHeight: 'normal' as LineHeightRatio,
  },
  'body-small': {
    sizeKey: 'body-sm' as FontSizeKey,
    weight: 'normal' as FontWeight,
    lineHeight: 'normal' as LineHeightRatio,
  },
  
  // Label presets (UI elements)
  'label-default': {
    sizeKey: 'label-md' as FontSizeKey,
    weight: 'medium' as FontWeight,
    lineHeight: 'snug' as LineHeightRatio,
  },
  'label-small': {
    sizeKey: 'label-sm' as FontSizeKey,
    weight: 'medium' as FontWeight,
    lineHeight: 'snug' as LineHeightRatio,
  },
} as const;

export type TypographyPreset = keyof typeof TYPOGRAPHY_PRESETS;

/**
 * Typography style object
 * 
 * Contains all CSS properties for a complete typography style.
 */
export interface TypographyStyle {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
}

/**
 * Get typography style object from preset
 * 
 * Returns a complete style object with fontSize, fontWeight, and lineHeight.
 * Can be spread directly into React inline styles or CSS-in-JS.
 * 
 * @param preset - Typography preset name
 * @returns Typography style object
 * 
 * @example
 * ```tsx
 * <h1 style={getTypographyStyle('heading-page')}>
 *   Page Title
 * </h1>
 * 
 * // Outputs (Free plan):
 * // {
 * //   fontSize: '24px',
 * //   fontWeight: 600,
 * //   lineHeight: '30px'
 * // }
 * ```
 */
export function getTypographyStyle(preset: TypographyPreset): TypographyStyle {
  const config = TYPOGRAPHY_PRESETS[preset];
  
  return {
    fontSize: getScaledFontSizeCSS(config.sizeKey),
    fontWeight: getFontWeight(config.weight),
    lineHeight: getLineHeightCSS(config.sizeKey, config.lineHeight),
  };
}

/**
 * Get typography class name (for use with CSS modules)
 * 
 * Returns a CSS custom property reference that can be used in CSS files.
 * This allows typography to be defined once and used via class names.
 * 
 * @param sizeKey - Font size key
 * @returns CSS custom property name
 * 
 * @example
 * ```css
 * .heading {
 *   font-size: var(--font-heading-xl);
 * }
 * ```
 * 
 * ```typescript
 * const varName = getTypographyVar('heading-xl');
 * // Returns: '--font-heading-xl'
 * ```
 */
export function getTypographyVar(sizeKey: FontSizeKey): string {
  return `--font-${sizeKey}`;
}

/**
 * Clamp text size for responsive typography
 * 
 * Creates a CSS clamp() function that scales typography between min and max viewport widths.
 * Useful for responsive designs that need fluid typography.
 * 
 * @param sizeKey - Font size key
 * @param minViewport - Minimum viewport width (px)
 * @param maxViewport - Maximum viewport width (px)
 * @returns CSS clamp() function
 * 
 * @example
 * ```tsx
 * <h1 style={{ fontSize: clampFontSize('display-xl', 375, 1920) }}>
 *   Responsive Hero Title
 * </h1>
 * 
 * // Outputs (Free plan):
 * // clamp(48px, calc(48px + (60 - 48) * (100vw - 375px) / (1920 - 375)), 60px)
 * ```
 */
export function clampFontSize(
  sizeKey: FontSizeKey,
  minViewport: number = 375,
  maxViewport: number = 1920
): string {
  const baseFontSize = BASE_FONT_SIZES[sizeKey];
  const scale = getTypographyScale();
  
  // Calculate min and max font sizes
  const minSize = baseFontSize * 0.8 * scale; // 80% at min viewport
  const maxSize = baseFontSize * scale; // 100% at max viewport
  
  // Create clamp function
  const viewportDiff = maxViewport - minViewport;
  const sizeDiff = maxSize - minSize;
  
  return `clamp(${minSize}px, calc(${minSize}px + ${sizeDiff} * (100vw - ${minViewport}px) / ${viewportDiff}), ${maxSize}px)`;
}
