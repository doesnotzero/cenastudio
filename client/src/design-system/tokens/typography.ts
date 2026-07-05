/**
 * Design Tokens - Typography
 *
 * Sistema tipográfico completo do Cena Studio
 * Baseado em type scale modular
 */

// Font Families
export const fontFamilies = {
  display: 'var(--font-frame-display)', // Orbitron - Títulos principais
  body: 'var(--font-frame-body)',       // Inter - Corpo de texto
  mono: 'var(--font-frame-mono)',       // JetBrains Mono - Code, labels
} as const;

// Font Sizes (modular scale 1.250 - major third)
export const fontSizes = {
  xs: '0.64rem',    // 10.24px - Tiny labels, metadata
  sm: '0.8rem',     // 12.8px - Small text, captions
  base: '1rem',     // 16px - Body text
  lg: '1.25rem',    // 20px - Lead text
  xl: '1.563rem',   // 25px - H4
  '2xl': '1.953rem',  // 31.25px - H3
  '3xl': '2.441rem',  // 39.06px - H2
  '4xl': '3.052rem',  // 48.83px - H1
  '5xl': '3.815rem',  // 61.04px - Hero titles
  '6xl': '4.768rem',  // 76.29px - Display titles
} as const;

// Font Weights
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Line Heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
  mono: '0.12em',    // For mono labels
  display: '0.15em',  // For uppercase display
} as const;

// Typography Presets
export const typographyPresets = {
  // Display Titles (Orbitron)
  displayHero: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayH1: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayH2: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Body Headings (Inter)
  h1: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body Text (Inter)
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Labels & UI Text (JetBrains Mono)
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.display,
    textTransform: 'uppercase' as const,
  },
  labelLarge: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.mono,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.mono,
    textTransform: 'uppercase' as const,
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Captions & Meta
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  captionBold: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
  },
} as const;

// CSS Custom Properties Map
export const typographyCSSVariables = {
  // Families
  '--font-display': fontFamilies.display,
  '--font-body': fontFamilies.body,
  '--font-mono': fontFamilies.mono,

  // Sizes
  '--text-xs': fontSizes.xs,
  '--text-sm': fontSizes.sm,
  '--text-base': fontSizes.base,
  '--text-lg': fontSizes.lg,
  '--text-xl': fontSizes.xl,
  '--text-2xl': fontSizes['2xl'],
  '--text-3xl': fontSizes['3xl'],
  '--text-4xl': fontSizes['4xl'],
  '--text-5xl': fontSizes['5xl'],
  '--text-6xl': fontSizes['6xl'],

  // Weights
  '--font-light': fontWeights.light,
  '--font-normal': fontWeights.normal,
  '--font-medium': fontWeights.medium,
  '--font-semibold': fontWeights.semibold,
  '--font-bold': fontWeights.bold,
  '--font-extrabold': fontWeights.extrabold,

  // Line heights
  '--leading-none': lineHeights.none,
  '--leading-tight': lineHeights.tight,
  '--leading-snug': lineHeights.snug,
  '--leading-normal': lineHeights.normal,
  '--leading-relaxed': lineHeights.relaxed,
  '--leading-loose': lineHeights.loose,

  // Letter spacing
  '--tracking-tighter': letterSpacing.tighter,
  '--tracking-tight': letterSpacing.tight,
  '--tracking-normal': letterSpacing.normal,
  '--tracking-wide': letterSpacing.wide,
  '--tracking-wider': letterSpacing.wider,
  '--tracking-widest': letterSpacing.widest,
  '--tracking-mono': letterSpacing.mono,
  '--tracking-display': letterSpacing.display,
};

// Type Exports
export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyPreset = keyof typeof typographyPresets;
