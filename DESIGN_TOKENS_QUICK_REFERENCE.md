# Design Tokens Quick Reference

> Quick copy-paste reference for LA Crime Map design system

---

## Spacing

### Gaps & Padding
```jsx
gap-xxs   // 4px   - Very tight
gap-xs    // 8px   - Tight
gap-sm    // 12px  - Compact
gap-md    // 16px  - Default ⭐
gap-lg    // 24px  - Generous ⭐
gap-xl    // 32px  - Section spacing
gap-2xl   // 40px  - Large sections
gap-3xl   // 48px  - Major sections
gap-4xl   // 64px  - Hero sections

p-sm      // 12px  - Compact cards
p-md      // 16px  - Default elements
p-lg      // 24px  - Cards ⭐
p-xl      // 32px  - Large cards
```

---

## Typography

### Quick Copy Classes
```jsx
// Headlines
text-display-lg      // 48px - Hero
text-display-md      // 40px - Page title
text-display-sm      // 32px - Major heading

// Headings
text-heading-xl      // 28px
text-heading-lg      // 24px ⭐
text-heading-md      // 20px ⭐
text-heading-sm      // 18px

// Body
text-body-lg         // 18px - Emphasized
text-body-md         // 16px - Default ⭐
text-body-sm         // 14px - Secondary ⭐
text-body-xs         // 12px - Fine print
```

---

## Colors

### LA Sunset (Primary Actions)
```jsx
// Gradient buttons
bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink

// Single colors
text-la-sunset-orange
text-la-sunset-pink
text-la-sunset-purple  // AI features
text-la-sunset-gold

// Subtle backgrounds
bg-la-sunset-orange/10
bg-gradient-to-br from-la-sunset-orange/10 to-la-sunset-pink/10
```

### Dark Mode Surfaces
```jsx
dark:bg-dark-bg-primary      // #0a0e1a - Main background ⭐
dark:bg-dark-bg-secondary    // #131827 - Cards ⭐
dark:bg-dark-bg-tertiary     // #1e293b - Nested elements
```

### Dark Mode Text
```jsx
dark:text-dark-text-primary    // #f8fafc - Headlines ⭐
dark:text-dark-text-secondary  // #cbd5e1 - Body ⭐
dark:text-dark-text-tertiary   // #94a3b8 - De-emphasized
```

### Status Colors
```jsx
text-status-success   // Green
text-status-warning   // Amber
text-status-error     // Red
text-status-info      // Blue
```

---

## Common Patterns

### Card
```jsx
<div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-card p-lg shadow-card hover:shadow-card-hover transition-all duration-base">
  Content
</div>
```

### Primary Button
```jsx
<button className="px-md py-sm text-body-sm font-semibold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white rounded-button hover:shadow-card-hover transition-all duration-base min-h-touch">
  Click Me
</button>
```

### Secondary Button
```jsx
<button className="px-md py-sm text-body-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-button transition-all duration-base min-h-touch">
  Click Me
</button>
```

### Section Heading
```jsx
<h2 className="text-heading-lg text-gray-900 dark:text-dark-text-primary mb-md">
  Section Title
</h2>
```

### Body Text
```jsx
<p className="text-body-md text-gray-600 dark:text-dark-text-secondary">
  Regular paragraph
</p>
```

### Icon Background
```jsx
<div className="bg-gradient-to-br from-la-sunset-orange/10 to-la-sunset-pink/10 dark:from-la-sunset-orange/20 dark:to-la-sunset-pink/20 p-sm rounded-button">
  <Icon className="w-6 h-6 text-la-sunset-orange" />
</div>
```

---

## Motion & Animation

### Framer Motion Standard Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -4 }}
>
  Content
</motion.div>
```

### Stagger Children
```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={container} initial="hidden" animate="visible">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
</motion.div>
```

### CSS Transitions
```jsx
// Standard
transition-all duration-base

// Fast (150ms)
transition-all duration-fast

// Slow (300ms)
transition-all duration-slow
```

---

## Border & Shadows

### Border Radius
```jsx
rounded-card      // 12px - Cards, panels ⭐
rounded-button    // 8px  - Buttons, inputs ⭐
rounded-badge     // Full - Pills, tags
rounded-modal     // 16px - Modals, dialogs
```

### Shadows
```jsx
shadow-card           // Default elevation ⭐
shadow-card-hover     // Hover state ⭐
shadow-elevated       // Modals
shadow-modal          // Maximum elevation
```

---

## Accessibility

### Touch Targets (Mobile)
```jsx
min-h-touch          // 44px minimum ⭐
min-w-touch          // 44px minimum ⭐
```

### Focus States
```jsx
focus:ring-2 focus:ring-la-sunset-orange
focus:outline-none
```

---

## Grid Layouts

### Common Grid Patterns
```jsx
// Responsive cards
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md

// Dashboard metrics
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg

// Two column split
grid grid-cols-1 md:grid-cols-2 gap-lg
```

---

## Responsive Spacing

### Section Padding
```jsx
// Mobile-first approach
py-3xl           // Mobile: 48px
sm:py-4xl        // Tablet+: 64px
```

### Container Padding
```jsx
px-md sm:px-lg lg:px-xl
// Mobile: 16px, Tablet: 24px, Desktop: 32px
```

---

## Dark Mode Template

```jsx
// Standard element
className="
  bg-white dark:bg-dark-bg-secondary
  text-gray-900 dark:text-dark-text-primary
  border-gray-200 dark:border-gray-700
"

// Subtle background
className="
  bg-gray-50 dark:bg-dark-bg-primary
  text-gray-600 dark:text-dark-text-secondary
"

// Interactive element
className="
  bg-white dark:bg-dark-bg-secondary
  hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary
  text-gray-700 dark:text-gray-300
"
```

---

## Most Common Combinations

### Standard Card
```jsx
bg-white dark:bg-dark-bg-secondary
border border-gray-200 dark:border-gray-700
rounded-card
p-lg
shadow-card
hover:shadow-card-hover
transition-all duration-base
```

### Standard Text
```jsx
text-body-md
text-gray-600 dark:text-dark-text-secondary
leading-relaxed
```

### Standard Heading
```jsx
text-heading-lg
text-gray-900 dark:text-dark-text-primary
font-bold
mb-md
```

### Standard Button
```jsx
px-md py-sm
text-body-sm font-semibold
rounded-button
min-h-touch
transition-all duration-base
```

---

**⭐ = Most frequently used**
**Last Updated**: February 2026
