# LA Crime Map Design System

## Overview

This document outlines the comprehensive design system for the LA Crime Map project, ensuring consistent, professional, and accessible design across all components.

---

## Color Palette

### LA-Themed Colors

Our color palette is inspired by Los Angeles sunsets and the city's vibrant nightlife.

#### Primary Brand Colors (LA Sunset)
- **Orange**: `#FF6B35` - `la-sunset-orange`
- **Pink**: `#FF2E97` - `la-sunset-pink`
- **Purple**: `#9D4EDD` - `la-sunset-purple`
- **Gold**: `#FFB020` - `la-sunset-gold`

#### Accent Color
- **Neon Cyan**: `#00D9FF` - `neon-cyan`

#### LA Night Sky (Dark Backgrounds)
- **Dark**: `#0a0e1a` - `la-night-dark`
- **Base**: `#131827` - `la-night-base`
- **Tertiary**: `#1e293b` - `la-night-tertiary`

### Semantic Colors

#### Light Mode
- **Surface Primary**: `#ffffff` (white)
- **Surface Secondary**: `#f8fafc` (light gray)
- **Surface Tertiary**: `#f1f5f9` (lighter gray)
- **Text Primary**: `#0f172a` (dark slate)
- **Text Secondary**: `#475569` (medium slate)
- **Text Tertiary**: `#94a3b8` (light slate)
- **Border Primary**: `#e2e8f0`
- **Border Secondary**: `#cbd5e1`

#### Dark Mode
- **Surface Primary**: `#0a0e1a` - `dark-bg-primary`
- **Surface Secondary**: `#131827` - `dark-bg-secondary`
- **Surface Tertiary**: `#1e293b` - `dark-bg-tertiary`
- **Text Primary**: `#f8fafc` - `dark-text-primary`
- **Text Secondary**: `#cbd5e1` - `dark-text-secondary`
- **Text Tertiary**: `#94a3b8` - `dark-text-tertiary`

#### Status Colors (consistent across modes)
- **Success**: `#10b981` - `status-success`
- **Warning**: `#f59e0b` - `status-warning`
- **Error**: `#ef4444` - `status-error`
- **Info**: `#3b82f6` - `status-info`

---

## Typography

### Font Families
- **Primary**: Geist Sans (via `--font-geist-sans`)
- **Monospace**: Geist Mono (via `--font-geist-mono`)

### Type Scale

#### Display Sizes (for hero sections and major headings)
- **Display Large**: 3rem (48px), line-height 1.1, letter-spacing -0.02em, weight 700
  - Usage: `text-display-lg`
- **Display Medium**: 2.5rem (40px), line-height 1.2, letter-spacing -0.02em, weight 700
  - Usage: `text-display-md`
- **Display Small**: 2rem (32px), line-height 1.2, letter-spacing -0.01em, weight 700
  - Usage: `text-display-sm`

#### Heading Sizes
- **Heading XL**: 1.75rem (28px), line-height 1.3, weight 700
  - Usage: `text-heading-xl`
- **Heading Large**: 1.5rem (24px), line-height 1.3, weight 700
  - Usage: `text-heading-lg`
- **Heading Medium**: 1.25rem (20px), line-height 1.4, weight 600
  - Usage: `text-heading-md`
- **Heading Small**: 1.125rem (18px), line-height 1.4, weight 600
  - Usage: `text-heading-sm`

#### Body Sizes
- **Body Large**: 1.125rem (18px), line-height 1.6, weight 400
  - Usage: `text-body-lg`
- **Body Medium**: 1rem (16px), line-height 1.6, weight 400
  - Usage: `text-body-md`
- **Body Small**: 0.875rem (14px), line-height 1.5, weight 400
  - Usage: `text-body-sm`
- **Body XSmall**: 0.75rem (12px), line-height 1.5, weight 400
  - Usage: `text-body-xs`

#### Special Text
- **Caption**: 0.75rem (12px), line-height 1.4, weight 500
  - Usage: `text-caption`
- **Overline**: 0.75rem (12px), line-height 1.4, weight 600, letter-spacing 0.05em, uppercase
  - Usage: `text-overline`

---

## Spacing Scale

### Consistent Spacing Tokens

#### Micro Spacing
- **XXS**: 0.25rem (4px) - `xxs`
- **XS**: 0.5rem (8px) - `xs`
- **SM**: 0.75rem (12px) - `sm`

#### Standard Spacing
- **MD**: 1rem (16px) - `md`
- **LG**: 1.5rem (24px) - `lg`
- **XL**: 2rem (32px) - `xl`
- **2XL**: 2.5rem (40px) - `2xl`
- **3XL**: 3rem (48px) - `3xl`
- **4XL**: 4rem (64px) - `4xl`
- **5XL**: 5rem (80px) - `5xl`
- **6XL**: 6rem (96px) - `6xl`

#### Special Purpose
- **Touch**: 2.75rem (44px) - `touch` - Minimum touch target size for mobile accessibility

### Usage Examples
```jsx
// Card padding
<div className="p-lg">Content</div>

// Section spacing
<section className="py-4xl">Content</section>

// Element gaps
<div className="flex gap-md">Items</div>

// Mobile touch targets
<button className="min-w-touch min-h-touch">Button</button>
```

---

## Border Radius

### Consistent Radius Scale
- **Card**: 0.75rem (12px) - `rounded-card`
- **Button**: 0.5rem (8px) - `rounded-button`
- **Input**: 0.5rem (8px) - `rounded-input`
- **Badge**: 9999px (full) - `rounded-badge`
- **Modal**: 1rem (16px) - `rounded-modal`

---

## Shadows

### Shadow Scale (with dark mode variants)

#### Light Mode
- **Card**: `shadow-card` - Subtle card elevation
- **Card Hover**: `shadow-card-hover` - Enhanced elevation on hover
- **Elevated**: `shadow-elevated` - High elevation for modals
- **Modal**: `shadow-modal` - Maximum elevation

#### Dark Mode
Shadows are automatically adjusted with higher opacity in dark mode for better visibility.

---

## Animations

### Animation Presets
- **Fade In**: `animate-fade-in` - 0.4s fade in
- **Fade In Up**: `animate-fade-in-up` - 0.5s fade in with upward motion
- **Slide In**: `animate-slide-in` - 0.3s horizontal slide
- **Scale In**: `animate-scale-in` - 0.2s scale from 95% to 100%

### Transition Durations
- **Fast**: 150ms - `duration-fast`
- **Base**: 200ms - `duration-base`
- **Slow**: 300ms - `duration-slow`

### Easing
- **Smooth**: `ease-smooth` - `cubic-bezier(0.4, 0, 0.2, 1)`

### Usage Examples
```jsx
// Smooth hover effect
<button className="transition-all duration-base hover:scale-105">
  Click me
</button>

// Fade in animation
<div className="animate-fade-in">Content</div>
```

---

## Component Patterns

### Cards

```jsx
<div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-card p-lg shadow-card hover:shadow-card-hover transition-all duration-base">
  Card content
</div>
```

### Buttons

#### Primary Button
```jsx
<button className="px-md py-sm text-body-sm font-semibold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white rounded-button hover:shadow-card-hover transition-all duration-base">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-md py-sm text-body-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-button transition-all duration-base">
  Secondary Action
</button>
```

### Input Fields

```jsx
<input
  type="text"
  className="px-md py-sm text-body-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg-secondary rounded-input focus:ring-2 focus:ring-la-sunset-orange transition-all duration-base"
/>
```

---

## Accessibility Guidelines

### Touch Targets
- Minimum size: 44x44px (`min-w-touch min-h-touch`)
- Applies to all interactive elements (buttons, links, form controls)

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Status colors maintain accessibility in both light and dark modes

### Focus States
- All interactive elements must have visible focus indicators
- Use `focus:ring-2 focus:ring-la-sunset-orange` for consistency

### Screen Readers
- Use proper semantic HTML
- Include `aria-label` for icon-only buttons
- Add `aria-hidden="true"` to decorative icons

---

## Dark Mode

### Implementation
- Uses `class` strategy with `next-themes`
- Automatic system preference detection
- Smooth transitions between modes

### Best Practices
1. Always provide dark mode variants for all colors
2. Use semantic color tokens (e.g., `text-gray-900 dark:text-white`)
3. Test all components in both modes
4. Ensure shadows are visible in dark mode

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- **SM**: 640px
- **MD**: 768px
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

### Mobile-First Approach
```jsx
// Default is mobile, then scale up
<div className="text-body-md sm:text-body-lg lg:text-heading-md">
  Responsive text
</div>

// Spacing scales with screen size
<div className="px-md sm:px-lg lg:px-xl">
  Responsive padding
</div>
```

---

## Usage Guidelines

### DO ✓
- Use semantic color tokens (`dark-bg-primary` not `#0a0e1a`)
- Use spacing scale tokens (`gap-md` not `gap-4`)
- Use typography scale (`text-heading-lg` not `text-2xl`)
- Use consistent border radius (`rounded-card` not `rounded-xl`)
- Include dark mode variants for all components
- Ensure minimum touch targets on mobile

### DON'T ✗
- Use arbitrary values unless absolutely necessary
- Mix spacing scales inconsistently
- Forget dark mode variants
- Use gradient text (accessibility concern)
- Create touch targets smaller than 44px
- Use animations that can cause motion sickness

---

## File Reference

### Core Design System Files
1. **globals.css** - Base styles, CSS variables, typography, utilities
2. **tailwind.config.ts** - Design tokens, spacing, colors, typography
3. **components/layout/header.tsx** - Consistent header implementation
4. **components/layout/footer.tsx** - Consistent footer implementation
5. **components/ui/metric-card.tsx** - Card component pattern
6. **components/ui/stats-dashboard.tsx** - Dashboard layout pattern

---

## Maintenance

### Adding New Colors
1. Add to `tailwind.config.ts` under `extend.colors`
2. Add CSS variable in `globals.css` if needed
3. Document in this file
4. Test in both light and dark modes

### Adding New Components
1. Follow existing patterns
2. Use design system tokens
3. Include dark mode variants
4. Test accessibility
5. Document usage if complex

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Next Themes**: https://github.com/pacocoursey/next-themes
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Framer Motion**: https://www.framer.com/motion/

---

**Last Updated**: February 2026
**Version**: 1.0.0
