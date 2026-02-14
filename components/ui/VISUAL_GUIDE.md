# UI Components Visual Guide

A visual reference guide showing what each component looks like and when to use it.

---

## 1. Legend Component

### Collapsed State (Default)
```
┌─────────────────────────────────┐
│ Crime Level Legend         [i]  │
├─────────────────────────────────┤
│ [🟢] Low Crime    0-5 incidents │
│ ─────────────────────────────── │
│ [🟠] Medium Crime 6-12 incidents│
│ ─────────────────────────────── │
│ [🔴] High Crime   13+ incidents │
└─────────────────────────────────┘
```

### Expanded State
```
┌─────────────────────────────────────────┐
│ Crime Level Legend              [i]     │
├─────────────────────────────────────────┤
│ [🟢] Low Crime    0-5 incidents         │
│     Safest areas with minimal reported  │
│     incidents                           │
│ ───────────────────────────────────────│
│ [🟠] Medium Crime 6-12 incidents        │
│     Moderate crime levels requiring     │
│     awareness                           │
│ ───────────────────────────────────────│
│ [🔴] High Crime   13+ incidents         │
│     Higher crime rates requiring extra  │
│     caution                             │
├─────────────────────────────────────────┤
│ Crime levels are calculated based on    │
│ reported incidents per neighborhood.    │
│ Data is updated regularly for accuracy. │
└─────────────────────────────────────────┘
```

**When to use:**
- Display next to maps
- In sidebars
- As a permanent reference for users

---

## 2. InfoCard Component

### Info Variant (Blue)
```
┌──────────────────────────────────────┐
│ [ℹ️] Information Title          [X]  │
│                                      │
│ This is an informational message     │
│ that provides helpful context to     │
│ the user.                            │
│                                      │
│ ──────────────────────────────────  │
│ [Learn More Button]                  │
└──────────────────────────────────────┘
```

### Success Variant (Green)
```
┌──────────────────────────────────────┐
│ [✓] Success Message             [X]  │
│                                      │
│ Operation completed successfully!    │
│ Your changes have been saved.        │
└──────────────────────────────────────┘
```

### Warning Variant (Amber)
```
┌──────────────────────────────────────┐
│ [⚠️] Warning Message             [X]  │
│                                      │
│ Please be aware of this important    │
│ information before proceeding.       │
└──────────────────────────────────────┘
```

### Error Variant (Red)
```
┌──────────────────────────────────────┐
│ [❌] Error Message              [X]  │
│                                      │
│ An error occurred. Please try again  │
│ or contact support.                  │
└──────────────────────────────────────┘
```

**When to use:**
- Form validation feedback
- System notifications
- Help tooltips
- Onboarding messages
- Error states

---

## 3. SearchBar Component

### Default State
```
┌────────────────────────────────────────┐
│ [🔍] Search neighborhoods...           │
└────────────────────────────────────────┘
```

### With Text
```
┌────────────────────────────────────────┐
│ [🔍] Beverly Hills                 [X] │
└────────────────────────────────────────┘
```

### With Dropdown (Search Results)
```
┌────────────────────────────────────────┐
│ [🔍] Beverly                       [X] │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ [📍] Beverly Hills                     │
│     Safety Score: 85 • Total: 15       │
│                              [Safe]    │
│ ────────────────────────────────────── │
│ [📍] Beverly Glen                      │
│     Safety Score: 78 • Total: 22       │
│                          [Moderate]    │
└────────────────────────────────────────┘
```

### With Popular Searches (Empty State)
```
┌────────────────────────────────────────┐
│ [🔍] Search neighborhoods...           │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ [📈] Popular Neighborhoods             │
├────────────────────────────────────────┤
│ [📍] Beverly Hills                     │
│     Safety Score: 85 • Total: 15       │
│                              [Safe]    │
│ ────────────────────────────────────── │
│ [📍] Manhattan Beach                   │
│     Safety Score: 82 • Total: 18       │
│                              [Safe]    │
│ ────────────────────────────────────── │
│ [📍] Bel Air                          │
│     Safety Score: 80 • Total: 13       │
│                              [Safe]    │
└────────────────────────────────────────┘
```

**When to use:**
- Primary navigation/search interface
- Quick neighborhood lookup
- Discovery of safe areas

**Features:**
- ⌨️ Keyboard navigation: ↑ ↓ Enter Esc
- 🎯 Smart matching algorithm
- 🏆 Shows popular/safest neighborhoods
- 📊 Preview statistics in results

---

## 4. FilterPanel Component

### Collapsed State
```
┌─────────────────────────────────────────┐
│ [⚙️] Filters        [Active] [↻] [▼]    │
└─────────────────────────────────────────┘
```

### Expanded State
```
┌─────────────────────────────────────────────┐
│ [⚙️] Filters           [Active] [↻] [▲]     │
├─────────────────────────────────────────────┤
│ Crime Types                                 │
│ ┌──────────┐ ┌──────────┐                  │
│ │ [✓] 🛡️   │ │ [✓] 🚗   │                  │
│ │ Violent  │ │ Car Theft│                  │
│ │ Crime    │ │          │                  │
│ └──────────┘ └──────────┘                  │
│ ┌──────────┐ ┌──────────┐                  │
│ │ [✓] 🏠   │ │ [✓] 🛍️   │                  │
│ │ Break-ins│ │ Petty    │                  │
│ │          │ │ Theft    │                  │
│ └──────────┘ └──────────┘                  │
│                                             │
│ Time Period                                 │
│ [Last Week] [Last Month] [3 Months] [Year] │
│                                             │
│ Safety Score Range                          │
│ Minimum                Maximum              │
│ ────●──────────        ────────────●───     │
│      25                          75         │
│              25 — 75                        │
│                                             │
│ Show Only Sufficient Data         [◯]      │
│ Filter neighborhoods with high-quality data │
└─────────────────────────────────────────────┘
```

**When to use:**
- Advanced filtering in dashboards
- Sidebar controls
- Data refinement interfaces

**Features:**
- 🎯 Multi-select crime types
- 📅 Date range presets
- 🎚️ Dual range sliders
- 🔄 Reset to defaults
- ✨ Active filter indicator
- ♿ Full accessibility

---

## Layout Examples

### Map Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│                    Header & Search                  │
│  ┌───────────────────────────────────────────────┐  │
│  │ [🔍] Search neighborhoods...                  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────┬───────────────────────┐
│                             │  ┌─────────────────┐  │
│                             │  │   Legend        │  │
│                             │  │   [🟢][🟠][🔴]  │  │
│         Map View            │  └─────────────────┘  │
│                             │                       │
│                             │  ┌─────────────────┐  │
│                             │  │   Filters       │  │
│                             │  │   [Crime Types] │  │
│                             │  │   [Date Range]  │  │
│                             │  │   [Safety]      │  │
│                             │  └─────────────────┘  │
└─────────────────────────────┴───────────────────────┘
```

### Alert/Notification Stack
```
┌─────────────────────────────────────┐
│ [✓] Data updated successfully   [X] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [⚠️] Limited data available      [X] │
└─────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Filter panel: Expanded sidebar
- Search: Full width with suggestions
- Legend: Floating on map
- Info cards: Multiple columns

### Tablet (768px - 1024px)
- Filter panel: Collapsible sidebar
- Search: Full width
- Legend: Overlaid on map
- Info cards: 2 columns

### Mobile (< 768px)
- Filter panel: Bottom sheet or drawer
- Search: Full width with overlay
- Legend: Expandable card
- Info cards: Single column, full width

---

## Animation States

### Enter Animations
- **Fade In + Slide Up:** Info cards, filter options
- **Fade In + Slide Right:** Legend, side panels
- **Scale + Fade:** Dropdowns, popovers
- **Stagger:** List items, filter options

### Interactive Animations
- **Hover Scale:** Buttons, cards (1.02x)
- **Tap Scale:** Buttons (0.98x)
- **Rotate:** Icons on expand/collapse
- **Slide:** Toggle switches

### Exit Animations
- **Fade Out + Scale Down:** Closing modals
- **Slide Out:** Dismissing notifications
- **Collapse:** Closing accordions

---

## Color Coding Guide

### Crime Levels
- 🟢 **Green (#10b981)** - Low crime (0-5 incidents)
- 🟠 **Amber (#f59e0b)** - Medium crime (6-12 incidents)
- 🔴 **Red (#ef4444)** - High crime (13+ incidents)

### Safety Scores
- 🟢 **70-100** - Safe (green badge)
- 🟠 **40-69** - Moderate (amber badge)
- 🔴 **0-39** - Caution (red badge)

### Info Card Variants
- 🔵 **Blue** - Informational
- 🟢 **Green** - Success
- 🟠 **Amber** - Warning
- 🔴 **Red** - Error

### Dark Mode
- Neon cyan (#00f5ff) - Primary accent
- Neon purple (#b537f2) - Secondary accent
- Darker backgrounds with higher contrast
- Muted colors for better night viewing

---

## Accessibility Features

### Keyboard Navigation
- **Tab:** Navigate between interactive elements
- **Space/Enter:** Activate buttons and toggles
- **Arrow Keys:** Navigate dropdowns and sliders
- **Escape:** Close modals and dropdowns

### Screen Reader Support
- All components have ARIA labels
- Roles properly defined (alert, combobox, switch)
- Live regions for dynamic updates
- Clear focus indicators

### Visual Indicators
- High contrast borders on focus
- Color + text for all states
- Large touch targets (44x44px minimum)
- Clear hover states

---

## Best Practices

### Do's ✅
- Use Legend near maps and visualizations
- Place SearchBar prominently at top of page
- Stack InfoCards in notification area
- Put FilterPanel in sidebar or dedicated area
- Keep at least one crime type selected
- Provide onSelect callbacks
- Use semantic variants (success, error, etc.)

### Don'ts ❌
- Don't stack multiple legends
- Don't place search in hard-to-find areas
- Don't auto-dismiss important error messages
- Don't hide filters on complex data views
- Don't allow empty crime type selection
- Don't forget keyboard navigation
- Don't rely solely on color for meaning

---

## Performance Considerations

- Components use React.memo internally
- Framer Motion animations are GPU-accelerated
- Debounced search input (300ms)
- Lazy-loaded dropdown content
- Optimized re-renders with proper keys
- Efficient event listeners with cleanup

---

**Created:** February 14, 2026
**Last Updated:** February 14, 2026
