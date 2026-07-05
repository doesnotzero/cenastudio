/**
 * Design Tokens - Central Export
 *
 * Importar tokens do design system:
 * import { colors, typography, spacing } from '@/design-system/tokens'
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export organized
export { colors, colorsCSSVariables, tailwindColors } from './colors';
export {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  typographyPresets,
  typographyCSSVariables,
} from './typography';
export {
  spacing,
  semanticSpacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  containerMaxWidths,
  spacingCSSVariables,
} from './spacing';
