# Smart Recommendations Engine - Visual Guide

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ENTRY POINT                          │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Direct    │  │  Quick     │  │  Discover  │            │
│  │  URL       │  │  Filters   │  │  Random    │            │
│  │  Navigate  │  │  Click     │  │  Click     │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │               │               │                    │
└────────┼───────────────┼───────────────┼────────────────────┘
         │               │               │
         ▼               ▼               ▼
┌────────────────────────────────────────────────────────────┐
│                     WIZARD VIEW                             │
│  ╔══════════════════════════════════════════════════════╗  │
│  ║  🌟 Find Your Perfect Neighborhood                   ║  │
│  ╚══════════════════════════════════════════════════════╝  │
│                                                             │
│  ┌─────────────────── Quick Filters ───────────────────┐   │
│  │ [🛡️ Safest] [💰 Value] [📉 Improving]              │   │
│  │ [👶 Family] [🎓 Student] [🎲 Discover]              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────── Wizard Form ─────────────────────┐   │
│  │ 💰 Budget Slider                                     │   │
│  │ [$1,000] ━━━━●━━━━━━━━━ [$5,000]                    │   │
│  │           $2,500                                     │   │
│  │                                                      │   │
│  │ ⭐ Priorities (Multi-select)                        │   │
│  │ [✓ Safety] [ Nightlife] [✓ Schools] [ Transit]     │   │
│  │                                                      │   │
│  │ 👥 Lifestyle (Single select)                        │   │
│  │ [ Family] [✓ Student] [ Professional] [ Retiree]   │   │
│  │                                                      │   │
│  │ ┌────────────────────────────────────────┐          │   │
│  │ │ 🌟 Get Recommendations          →      │          │   │
│  │ └────────────────────────────────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────────┬───────────────────┘
                    │                     │
        ┌───────────┘                     └──────────┐
        │                                            │
        ▼                                            ▼
┌──────────────────────┐                  ┌──────────────────────┐
│   RESULTS VIEW       │                  │   DISCOVER VIEW      │
│  ═══════════════     │                  │  ═══════════════     │
│                      │                  │                      │
│  Top 5 Neighborhoods │                  │  ┌─────────────────┐ │
│                      │                  │  │  GRADIENT HEADER│ │
│  ┌────────────────┐  │                  │  │  🌟 Beverly     │ │
│  │ 1  Beverly     │  │                  │  │     Hills       │ │
│  │    Hills       │  │                  │  └─────────────────┘ │
│  │                │  │                  │                      │
│  │ 🛡️ 95/100     │  │                  │  🛡️ SAFETY: 95/100  │
│  │ 📊 Score: 92   │  │                  │  💰 $4,500/mo       │
│  │ 💰 $4,500     │  │                  │                      │
│  │                │  │                  │  ┌─ Quick Stats ──┐ │
│  │ Why:           │  │                  │  │ 🏠 Walk: 85    │ │
│  │ • Excellent    │  │                  │  │ 🚌 Transit: 65 │ │
│  │   safety       │  │                  │  │ 🎓 Schools: 10 │ │
│  │ • Top schools  │  │                  │  │ ☕ Night: 7    │ │
│  │                │  │                  │  └────────────────┘ │
│  │ 🏠85 🚌65      │  │                  │                      │
│  │ 🎓10 ☕7       │  │                  │  ✅ Pros:           │
│  │                │  │                  │  • Excellent safety │
│  │ Similar to:    │  │                  │  • Top schools      │
│  │ [Bel Air]...   │  │                  │                      │
│  └────────────────┘  │                  │  ⚠️ Cons:           │
│                      │                  │  • Above budget     │
│  ┌────────────────┐  │                  │                      │
│  │ 2  Bel Air     │  │                  │  Similar to:        │
│  │    ...         │  │                  │  [Bel Air]...       │
│  └────────────────┘  │                  │                      │
│                      │                  │  ┌────────────────┐ │
│  [3] [4] [5] ...     │                  │  │ 💾 Save        │ │
│                      │                  │  └────────────────┘ │
│  ┌───── Map ─────┐  │                  │  ┌────────────────┐ │
│  │  🗺️ Coming    │  │                  │  │ 🎲 Discover    │ │
│  │     Soon       │  │                  │  │    Another     │ │
│  └────────────────┘  │                  │  └────────────────┘ │
│                      │                  │                      │
│  [Share] [Back]      │                  │  [Back to Wizard]   │
└──────────────────────┘                  └──────────────────────┘
```

## Color Scheme

```
Primary Gradient:
  from-neon-cyan (#0ff) ────→ to-neon-purple (#b0f)

Safety Colors:
  🟢 High (80-100):   Green (#10b981)
  🟡 Medium (60-79):  Amber (#f59e0b)
  🔴 Low (0-59):      Red (#ef4444)

Backgrounds:
  Light Mode:  White (#fff), Gray-50 (#f9fafb)
  Dark Mode:   Dark-bg-primary, Dark-bg-secondary

Accents:
  Blue:   #3b82f6 (info, trust)
  Purple: #a855f7 (special features)
  Green:  #22c55e (success, safety)
```

## Component Hierarchy

```
SmartRecommendationsEngine
├── WizardView
│   ├── Header (with Sparkles icon)
│   ├── Quick Filters Section
│   │   └── QuickFilterButton × 6
│   └── Wizard Form
│       ├── Budget Slider
│       ├── Priorities Grid
│       │   └── PriorityButton × 4
│       ├── Lifestyle Grid
│       │   └── LifestyleButton × 4
│       └── Submit Button
│
├── ResultsView
│   ├── Header with Actions
│   │   ├── Share Button
│   │   └── Back Button
│   ├── Recommendations Grid
│   │   └── NeighborhoodCard × 5
│   │       ├── Rank Badge
│   │       ├── Safety Score (prominent)
│   │       ├── Match Score
│   │       ├── Rent
│   │       ├── Reasons List
│   │       ├── Quick Stats Grid
│   │       ├── Similar To Tags
│   │       └── Save Button
│   └── Map View Placeholder
│
└── DiscoverView
    └── Immersive Card
        ├── Gradient Header
        ├── Safety Score (large)
        ├── Quick Stats Grid
        ├── Pros/Cons Columns
        ├── Similar To Section
        └── Action Buttons
            ├── Save
            ├── Discover Another
            └── Back
```

## Animation Timeline

```
Page Load (Wizard View)
┌─────────────────────────────────────────────────────┐
│ 0ms   ▶ Page fade in (opacity 0 → 1)               │
│ 0ms   ▶ Sparkles icon scale (0 → 1) [spring]       │
│ 100ms ▶ Quick filters fade + slide up              │
│ 200ms ▶ Wizard form fade + slide up                │
└─────────────────────────────────────────────────────┘

Results Load
┌─────────────────────────────────────────────────────┐
│ 0ms   ▶ Header fade in                             │
│ 0ms   ▶ Card 1 fade + slide (delay 0ms)            │
│ 100ms ▶ Card 2 fade + slide (delay 100ms)          │
│ 200ms ▶ Card 3 fade + slide (delay 200ms)          │
│ 300ms ▶ Card 4 fade + slide (delay 300ms)          │
│ 400ms ▶ Card 5 fade + slide (delay 400ms)          │
│ 600ms ▶ Map placeholder fade in                    │
└─────────────────────────────────────────────────────┘

Hover Interactions
┌─────────────────────────────────────────────────────┐
│ Card:   y: 0 → -4px (lift effect)                  │
│ Button: scale: 1 → 1.02 (subtle grow)              │
│ Icon:   scale: 1 → 1.1 (emphasis)                  │
└─────────────────────────────────────────────────────┘

Transitions
┌─────────────────────────────────────────────────────┐
│ View changes: 300ms fade (opacity 0 ↔ 1)           │
│ State updates: Spring physics for natural feel     │
└─────────────────────────────────────────────────────┘
```

## Responsive Breakpoints

```
Mobile (< 640px)
┌──────────────────┐
│  [Filter 1]      │
│  [Filter 2]      │  Single column
│  [Filter 3]      │  Stack everything
│  ...             │  Full width cards
└──────────────────┘

Tablet (640px - 1024px)
┌─────────────────────────────┐
│ [Filter 1] [Filter 2]       │  2 columns
│ [Filter 3] [Filter 4]       │
│ [Filter 5] [Filter 6]       │
│                             │
│  [Card 1]                   │  Full width
│  [Card 2]                   │  cards
└─────────────────────────────┘

Desktop (> 1024px)
┌────────────────────────────────────────┐
│ [Filter 1] [Filter 2] [Filter 3]       │  3 columns
│ [Filter 4] [Filter 5] [Filter 6]       │  for filters
│                                        │
│  [────── Card 1 ──────]                │  Wide cards
│  [────── Card 2 ──────]                │  with all
│  [────── Card 3 ──────]                │  details
└────────────────────────────────────────┘
```

## Data Flow

```
User Input → Preferences State → Algorithm → Scored Results → UI Display

Example Flow:
┌─────────────────┐
│ Budget: $2,500  │
│ Priority: Safe  │──┐
│ Lifestyle: Fam  │  │
└─────────────────┘  │
                     ▼
         ┌──────────────────────┐
         │  Scoring Algorithm   │
         │  • Safety (40%)      │
         │  • Budget (20%)      │
         │  • Priority (30%)    │
         │  • Lifestyle (10%)   │
         └─────────┬────────────┘
                   ▼
         ┌──────────────────────┐
         │  Scored Neighborhoods│
         │  1. Beverly Hills 92 │
         │  2. Bel Air      90  │
         │  3. Studio City  88  │
         │  4. Encino       86  │
         │  5. Torrance     84  │
         └─────────┬────────────┘
                   ▼
         ┌──────────────────────┐
         │  UI Components       │
         │  • NeighborhoodCard  │
         │  • Safety Badge      │
         │  • Pros/Cons Lists   │
         └──────────────────────┘
```

## Scoring Algorithm Visual

```
For each neighborhood:

┌─────────────────────────────────────────┐
│                                         │
│  Total Score (0-100)                    │
│  ═══════════════════════════            │
│                                         │
│  ┌─ Safety Score (40%) ─────────────┐  │
│  │ 100 - (totalCrime × 1.5)         │  │
│  │ Weight: × 0.4                    │  │
│  └──────────────────────────────────┘  │
│           +                             │
│  ┌─ Budget Match (20%) ─────────────┐  │
│  │ 100 - (rentDiff/budget × 100)    │  │
│  │ Weight: × 0.2                    │  │
│  └──────────────────────────────────┘  │
│           +                             │
│  ┌─ Priorities (30%) ───────────────┐  │
│  │ Safety:   safetyScore            │  │
│  │ Transit:  transitScore           │  │
│  │ Schools:  schoolRating × 10      │  │
│  │ Nightlife: nightlife × 10        │  │
│  │ Weight: × (30/numPriorities/100) │  │
│  └──────────────────────────────────┘  │
│           +                             │
│  ┌─ Lifestyle (10%) ─────────────────┐ │
│  │ Custom formula per lifestyle     │  │
│  │ Weight: × 0.1                    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  = FINAL MATCH SCORE                    │
│                                         │
└─────────────────────────────────────────┘

Then sort by score (high to low) and return top 5.
```

## State Management

```
SmartRecommendationsEngine State:
┌──────────────────────────────────────┐
│ step: 'wizard' | 'results' | 'discover' │
│                                      │
│ preferences: {                       │
│   budget: 2500                       │
│   priorities: ['safety', 'schools']  │
│   lifestyle: 'family'                │
│   commuteLocation: null              │
│ }                                    │
│                                      │
│ savedRecommendations: [              │
│   { id, neighborhood, savedAt }      │
│ ]                                    │
│                                      │
│ selectedNeighborhood: {              │
│   ...neighborhoodData                │
│   score: 92                          │
│   reasons: [...]                     │
│ }                                    │
└──────────────────────────────────────┘

View determines which component renders:
- wizard  → WizardView
- results → ResultsView
- discover → DiscoverView
```

## Icon Reference

```
Component Icons:
🌟 Sparkles    - Main branding, special features
🛡️ Shield      - Safety, protection
💰 DollarSign  - Budget, rent, value
🏠 Home        - Walk score, housing
☕ Coffee      - Nightlife, entertainment
🎓 GraduationCap - Schools, education
🚌 Bus         - Transit, transportation
📉 TrendingDown - Improving (crime down)
📈 TrendingUp  - Worsening (crime up)
📍 MapPin      - Location, map view
⭐ Star        - Priorities, favorites
📤 Share2      - Share functionality
💾 Save        - Save to favorites
🎲 Shuffle     - Random discover
✓  Check       - Pros, selected
✗  X           - Cons, close
→  ChevronRight - Next, continue
👥 Users       - Lifestyle, community
💼 Briefcase   - Professional
👶 Baby        - Family
☀️ Sun         - Retiree
🗺️ Map         - Map view
```

## Quick Reference Table

| Feature | Location | Key Props | Output |
|---------|----------|-----------|--------|
| Wizard Form | WizardView | preferences, setPreferences | Updated preferences |
| Quick Filter | WizardView | onClick | Filtered results |
| Discover | DiscoverView | neighborhood, onShuffle | Random safe area |
| Results List | ResultsView | recommendations (top 5) | Ranked cards |
| Save Button | NeighborhoodCard | onSave | Add to saved list |
| Share Button | ResultsView | onShare | Native share/clipboard |

## Testing Checklist

Visual Tests:
- [ ] All icons display correctly
- [ ] Gradients render smoothly
- [ ] Dark mode colors are readable
- [ ] Animations are smooth (60fps)
- [ ] Cards align properly in grid
- [ ] Safety score is prominent
- [ ] Text is legible at all sizes

Functional Tests:
- [ ] Budget slider updates value
- [ ] Priorities toggle on/off
- [ ] Lifestyle selects correctly
- [ ] Quick filters return results
- [ ] Discover shows random neighborhood
- [ ] Save button adds to list
- [ ] Share copies/shares text
- [ ] Back button returns to wizard
- [ ] Scoring algorithm is accurate

Responsive Tests:
- [ ] Mobile (iPhone SE)
- [ ] Tablet (iPad)
- [ ] Desktop (1920px)
- [ ] Ultra-wide (2560px)

## Performance Benchmarks

Target metrics:
- Initial render: < 100ms
- State update: < 50ms
- Animation frame rate: 60fps
- Recommendation calculation: < 200ms
- Memory usage: < 50MB

Optimizations in place:
- useMemo for expensive calculations
- Lazy evaluation of results
- Efficient sorting algorithms
- Minimal re-renders
- Lightweight components

---

This visual guide provides a complete reference for understanding the Smart Recommendations Engine's structure, design, and behavior.
