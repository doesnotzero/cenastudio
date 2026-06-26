---
name: animations
description: "Use when the user requests animations, transitions, micro-interactions, page transitions, loading animations, hover effects, scroll animations, framer-motion, gesture responses, or any motion design for the FRAME.AI Director site. Front-loaded keywords: animação, animation, transition, motion, framer-motion, fade, slide, hover, micro-interação, micro-interaction, gesto, gesture, scroll, parallax, loader, skeleton, efeito, effect."
---

# Skill: animations

Use this skill when adding motion/animation to the FRAME.AI Director.

## Tool

**framer-motion** is already installed and used. Import from `framer-motion`:
```tsx
import { motion, AnimatePresence } from "framer-motion";
```

## Existing Animation Patterns

Look at existing components for reference:
- `AppNavBar.tsx` — uses framer-motion for dropdown/drawer
- `NotificationsPopover.tsx` — animated popover
- `CommandPalette.tsx` — command palette overlay

## Animation Standards

### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -12 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

### List Items (stagger)
```tsx
<motion.div
  initial={{ opacity: 0, x: -8 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.2, delay: index * 0.05 }}
>
```

### Hover on Cards
```tsx
whileHover={{ scale: 1.01, borderColor: "var(--frame-orange)" }}
transition={{ duration: 0.2 }}
```

### Modal/Overlay
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
```

### Loading Skeleton
```tsx
<motion.div
  animate={{ opacity: [0.3, 0.6, 0.3] }}
  transition={{ duration: 1.5, repeat: Infinity }}
  className="bg-frame-gray-3 h-4 w-full"
/>
```

## Principles

- **Subtle > flashy**: Small opacity shifts and micro-movements, not旋转或弹跳
- **Performance**: Use `will-change: transform` sparingly, avoid animating `height`/`width`
- **Reduced motion**: Always wrap new animations with a check or use `transition: { duration: 0 }` fallback
- **Duration**: Keep under 300ms for micro-interactions, under 500ms for page transitions
- **Easing**: Use `easeOut` for enter, `easeInOut` for transitions between states

## Implementation Checklist

- [ ] `import { motion, AnimatePresence } from "framer-motion"`
- [ ] Define `variants` object for reusable animation presets
- [ ] Wrap page content in `<AnimatePresence mode="wait">`
- [ ] Add hover states to interactive cards/borders
- [ ] Stagger list appearances (delay based on index)
- [ ] Animate modal entries/exits
