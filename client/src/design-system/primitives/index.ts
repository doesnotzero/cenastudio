/**
 * Design System Primitives
 * 
 * Plan-aware base components that adapt their appearance based on the user's plan.
 * All primitives use plan tokens (--plan-*) for colors, shadows, and typography.
 * 
 * Plan Progression:
 * - Free: Clean, minimal aesthetic with single accent color
 * - Pro: Enhanced with glow effects and filmmaker-focused styling
 * - Studio: Premium with dual-accent system and command center aesthetic
 * 
 * Usage:
 * Import primitives from this index file in your components:
 * 
 * ```tsx
 * import { Button, Card, Badge, Input, Typography } from '@/design-system/primitives';
 * ```
 * 
 * Each primitive automatically inherits the current plan's visual design
 * through CSS custom properties injected by PlanTokenProvider.
 */

export { Button, buttonVariants, type ButtonProps } from "./Button";
export { Input, inputVariants, type InputProps } from "./Input";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  type CardProps,
} from "./Card";
export { Badge, badgeVariants, type BadgeProps } from "./Badge";
export { Typography, typographyVariants, type TypographyProps } from "./Typography";
