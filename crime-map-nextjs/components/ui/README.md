# UI Components

A collection of beautiful, accessible, and production-ready UI components for the LA Crime Map application. All components feature Framer Motion animations, dark mode support, and full accessibility (ARIA labels).

## Components

### 1. Legend

A map legend showing crime level colors with expandable details.

**Features:**
- Color-coded crime levels (Low/Green, Medium/Amber, High/Red)
- Expandable/collapsible details
- Framer Motion animations
- Dark mode support
- Full accessibility with ARIA labels

**Usage:**

```tsx
import { Legend } from '@/components/ui/legend'

// Basic usage
<Legend />

// With custom props
<Legend
  className="absolute top-4 right-4 w-64"
  showDetails={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `showDetails` | `boolean` | `false` | Show expanded details by default |

---

### 2. InfoCard

Reusable info/help card component with multiple variants.

**Features:**
- 4 variants: info, success, warning, error
- Customizable icons
- Closable with animation
- Footer support for actions
- Full accessibility

**Usage:**

```tsx
import { InfoCard, InfoCardHelp, InfoCardSuccess } from '@/components/ui/info-card'
import { AlertCircle } from 'lucide-react'

// Using base component
<InfoCard
  variant="info"
  title="Welcome"
  onClose={() => setShowInfo(false)}
  footer={
    <button className="text-sm text-blue-600">Learn More</button>
  }
>
  This is the LA Crime Map dashboard. Explore crime statistics across neighborhoods.
</InfoCard>

// Using preset variants
<InfoCardHelp
  title="How to Use"
  onClose={() => setShowHelp(false)}
>
  Click on any neighborhood to view detailed statistics.
</InfoCardHelp>

<InfoCardSuccess title="Data Updated">
  Crime data has been successfully refreshed.
</InfoCardSuccess>

<InfoCardWarning title="Limited Data">
  Some neighborhoods have insufficient data for accurate statistics.
</InfoCardWarning>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Card style variant |
| `title` | `string` | Required | Card title |
| `children` | `ReactNode` | Required | Card content |
| `onClose` | `() => void` | `undefined` | Close handler |
| `className` | `string` | `''` | Additional CSS classes |
| `icon` | `LucideIcon` | Auto | Custom icon (defaults by variant) |
| `footer` | `ReactNode` | `undefined` | Footer content |
| `isClosable` | `boolean` | `true` | Show close button |

---

### 3. SearchBar

Neighborhood search with autocomplete and keyboard navigation.

**Features:**
- Real-time search with fuzzy matching
- Keyboard navigation (Arrow keys, Enter, Escape)
- Popular neighborhoods suggestion
- Safety score indicators
- Click-outside to close
- Full accessibility with ARIA autocomplete

**Usage:**

```tsx
import { SearchBar } from '@/components/ui/search-bar'

<SearchBar
  onSelect={(neighborhood) => {
    console.log('Selected:', neighborhood.name)
    // Center map on neighborhood, show details, etc.
  }}
  placeholder="Search for a neighborhood..."
  showPopularSearches={true}
  className="max-w-md"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(neighborhood: NeighborhoodData) => void` | `undefined` | Selection handler |
| `placeholder` | `string` | `'Search neighborhoods...'` | Input placeholder |
| `className` | `string` | `''` | Additional CSS classes |
| `showPopularSearches` | `boolean` | `true` | Show popular neighborhoods when empty |

**Keyboard Navigation:**
- `↓` / `↑` - Navigate results
- `Enter` - Select highlighted result
- `Escape` - Close dropdown and blur input

---

### 4. FilterPanel

Advanced filtering options with multiple filter types.

**Features:**
- Crime type multi-select
- Date range selector
- Safety score range sliders
- Data quality toggle
- Collapsible panel
- Reset to defaults
- Active filter indicator
- Full accessibility

**Usage:**

```tsx
import { FilterPanel, FilterState } from '@/components/ui/filter-panel'
import { useState } from 'react'

function MyComponent() {
  const [filters, setFilters] = useState<FilterState>({
    crimeTypes: ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'],
    dateRange: '1month',
    safetyRange: [0, 100],
    showOnlySufficientData: false
  })

  return (
    <FilterPanel
      filters={filters}
      onChange={setFilters}
      isCollapsible={true}
      className="mb-4"
    />
  )
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `FilterState` | Required | Current filter state |
| `onChange` | `(filters: FilterState) => void` | Required | Filter change handler |
| `className` | `string` | `''` | Additional CSS classes |
| `isCollapsible` | `boolean` | `true` | Allow panel collapse |

**FilterState Type:**

```typescript
interface FilterState {
  crimeTypes: CrimeMetric[]              // Selected crime types
  dateRange: DateRange                    // Time period
  safetyRange: [number, number]          // Min and max safety scores
  showOnlySufficientData: boolean        // Data quality filter
}
```

---

## Common Features

All components include:

- **Framer Motion Animations**: Smooth enter/exit animations and hover effects
- **Dark Mode Support**: Automatic theme switching with Tailwind CSS dark mode
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML
- **TypeScript**: Full type safety with exported interfaces
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Professional Styling**: Consistent with the application's design system

---

## Design Tokens

Components use the following design tokens from `tailwind.config.ts`:

**Colors:**
- `neon-cyan`: Primary accent (light mode)
- `neon-purple`: Primary accent (dark mode)
- `dark-bg-primary`, `dark-bg-secondary`, `dark-bg-tertiary`: Dark mode backgrounds
- `dark-text-primary`, `dark-text-secondary`, `dark-text-tertiary`: Dark mode text

**Animations:**
- `fade-in`: Smooth opacity transitions
- `slide-up`: Bottom-to-top entrance
- `slide-in`: Left-to-right entrance

---

## Importing Components

You can import components individually or use the barrel export:

```tsx
// Individual imports
import { Legend } from '@/components/ui/legend'
import { SearchBar } from '@/components/ui/search-bar'

// Barrel export
import { Legend, SearchBar, FilterPanel, InfoCard } from '@/components/ui'
```

---

## Examples

### Complete Dashboard Example

```tsx
'use client'

import { useState } from 'react'
import {
  Legend,
  SearchBar,
  FilterPanel,
  InfoCardHelp,
  FilterState
} from '@/components/ui'
import { NeighborhoodData } from '@/lib/data/types'

export function CrimeDashboard() {
  const [showHelp, setShowHelp] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    crimeTypes: ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'],
    dateRange: '1month',
    safetyRange: [0, 100],
    showOnlySufficientData: false
  })

  const handleNeighborhoodSelect = (neighborhood: NeighborhoodData) => {
    console.log('Selected:', neighborhood.name)
    // Implement your logic here
  }

  return (
    <div className="p-4 space-y-4">
      {showHelp && (
        <InfoCardHelp
          title="How to Use This Dashboard"
          onClose={() => setShowHelp(false)}
        >
          Use the search bar to find neighborhoods, apply filters to refine
          your view, and check the legend for crime level colors.
        </InfoCardHelp>
      )}

      <SearchBar
        onSelect={handleNeighborhoodSelect}
        className="max-w-2xl mx-auto"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Your map component */}
        </div>

        <div className="space-y-4">
          <Legend showDetails={false} />
          <FilterPanel
            filters={filters}
            onChange={setFilters}
          />
        </div>
      </div>
    </div>
  )
}
```

---

## Browser Support

All components are tested and work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

When creating new components, follow these guidelines:

1. Use `'use client'` directive for client components
2. Include Framer Motion animations
3. Support dark mode with Tailwind classes
4. Add proper ARIA labels and semantic HTML
5. Export TypeScript interfaces for props
6. Write clear JSDoc comments
7. Test keyboard navigation
8. Ensure responsive design

---

## License

Part of the LA Crime Map project.
