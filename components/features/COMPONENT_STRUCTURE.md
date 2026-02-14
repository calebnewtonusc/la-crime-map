# Address Search - Component Structure

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     AddressSearch                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Hero Section                             │  │
│  │  "Search Your Address"                                │  │
│  │  "Find out which neighborhood..."                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Search Bar                               │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [Search] Enter address... [X] [Search Button]   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Recent Searches Dropdown (conditional)          │  │  │
│  │  │  • 123 Main St, LA                              │  │  │
│  │  │  • Hollywood Blvd, LA                           │  │  │
│  │  │  [Clear All]                                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Error Message (if error)                    │  │
│  │  [!] Search Error: Address not found...              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       AddressSearchResult (if found)                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Location Header                                 │  │  │
│  │  │  [Pin] 123 Main St, Los Angeles, CA             │  │  │
│  │  │  Your address is in Beverly Hills               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Safety Score Card                               │  │  │
│  │  │  [Shield] Very Safe          85/100             │  │  │
│  │  │  ████████████░░░░░░░░░ Progress Bar             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Crime Breakdown (2x2 Grid)                      │  │  │
│  │  │  ┌────────────────┐  ┌────────────────┐         │  │  │
│  │  │  │ Violent Crime  │  │   Car Theft    │         │  │  │
│  │  │  │      3         │  │       4        │         │  │  │
│  │  │  │  ▼ 25% LA avg  │  │  ▲ 15% LA avg  │         │  │  │
│  │  │  └────────────────┘  └────────────────┘         │  │  │
│  │  │  ┌────────────────┐  ┌────────────────┐         │  │  │
│  │  │  │   Break-ins    │  │  Petty Theft   │         │  │  │
│  │  │  │      3         │  │       5        │         │  │  │
│  │  │  │  ▼ 30% LA avg  │  │  ▼ 20% LA avg  │         │  │  │
│  │  │  └────────────────┘  └────────────────┘         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Safety Verdict                                  │  │  │
│  │  │  Is it safe?                                    │  │  │
│  │  │  Generally Safe Area                            │  │  │
│  │  │  This neighborhood has lower crime rates...     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ Disclaimer                                      │  │  │
│  │  │  [i] Remember: Crime statistics are...         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       Info Tips (when no result)                      │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                │  │
│  │  │ Search  │  │  Find   │  │  Quick  │                │  │
│  │  │  Any    │  │  Your   │  │ Access  │                │  │
│  │  │ Address │  │ Neighb. │  │         │                │  │
│  │  └─────────┘  └─────────┘  └─────────┘                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Files

### Core Components (887 lines total)

```
components/features/
├── address-search.tsx (385 lines)
│   ├── Search input with icon
│   ├── Clear button
│   ├── Search button
│   ├── History dropdown
│   ├── Error display
│   ├── Result display
│   └── Info tips
│
├── address-search-result.tsx (321 lines)
│   ├── Location header
│   ├── Safety score card
│   ├── Crime breakdown grid
│   ├── Safety verdict
│   └── Disclaimer notice
│
└── search-with-map.tsx (181 lines)
    ├── Address search
    ├── Map container
    ├── Metric selector
    └── Map legend
```

### Utility Functions

```
lib/utils/
└── geocoding.ts (181 lines)
    ├── geocodeAddress()       - Convert address to coordinates
    ├── calculateDistance()    - Haversine distance formula
    ├── isPointInPolygon()    - Ray casting algorithm
    ├── getBoundingBox()      - Get polygon bounds
    └── getPolygonCenter()    - Get center point
```

## Data Flow Diagram

```
┌─────────────┐
│    User     │
│   Types     │
│  Address    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  AddressSearch Component            │
│  • Captures input                   │
│  • Manages state                    │
│  • Handles history                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  geocodeAddress()                   │
│  • Calls Nominatim API              │
│  • Validates response               │
│  • Returns {lat, lon, address}      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Validate Location                  │
│  • Check if in LA County            │
│  • Verify coordinates               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  findNeighborhood()                 │
│  • Loop through neighborhoods       │
│  • Check if point in polygon        │
│  • Return neighborhood data         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  AddressSearchResultData            │
│  • address: string                  │
│  • coordinates: {lat, lng}          │
│  • neighborhood: NeighborhoodData   │
│  • neighborhoodName: string         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  AddressSearchResult Component      │
│  • Calculate safety score           │
│  • Compare to LA average            │
│  • Generate verdict                 │
│  • Display results                  │
└─────────────────────────────────────┘
```

## State Management

```typescript
// Component State
const [searchQuery, setSearchQuery] = useState('')
const [isSearching, setIsSearching] = useState(false)
const [error, setError] = useState<string | null>(null)
const [searchResult, setSearchResult] = useState<AddressSearchResultData | null>(null)
const [showHistory, setShowHistory] = useState(false)
const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])

// LocalStorage State
localStorage.getItem('la-crime-map-search-history')
// Stores: [{ address: string, timestamp: number }, ...]
```

## Props Interface

```typescript
// AddressSearch Props
interface AddressSearchProps {
  onLocationFound?: (result: AddressSearchResultData) => void
  className?: string
}

// AddressSearchResult Props
interface AddressSearchResultProps {
  result: AddressSearchResultData
}

// SearchWithMap Props
interface SearchWithMapProps {
  defaultMetric?: CrimeMetric
  className?: string
}
```

## Event Flow

```
User Action          Component Method          Side Effects
───────────         ─────────────────         ─────────────
Type in input   →   onChange()            →   Update searchQuery
Click search    →   handleSubmit()        →   Call handleSearch()
                                          →   Set isSearching = true
                                          →   Call geocodeAddress()
                                          →   Check if in LA
                                          →   Find neighborhood
                                          →   Set searchResult
                                          →   Save to history
                                          →   Call onLocationFound()
                                          →   Set isSearching = false

Click history   →   handleHistoryClick()  →   Set searchQuery
                                          →   Call handleSearch()

Click clear     →   handleClear()         →   Reset state
                                          →   Focus input

Clear history   →   clearHistory()        →   Clear localStorage
                                          →   Update state
```

## Styling Architecture

```
Theme System
├── Light Mode
│   ├── Background: white/gray-50
│   ├── Text: gray-900/gray-700
│   └── Borders: gray-200/gray-300
│
└── Dark Mode
    ├── Background: dark-bg-primary/secondary
    ├── Text: dark-text-primary/secondary
    └── Borders: gray-700/gray-600

Color Coding
├── Safety Ratings
│   ├── Very Safe (75-100): Green
│   ├── Moderately Safe (50-74): Blue
│   ├── Caution (30-49): Yellow
│   └── High Crime (0-29): Red
│
└── Accents
    ├── Primary: Neon Cyan
    ├── Success: Green
    ├── Warning: Amber
    └── Error: Red

Responsive Breakpoints
├── Mobile: < 640px
├── Tablet: 640px - 1024px
└── Desktop: > 1024px

Touch Targets
├── Minimum: 48px
├── Search Button: 48px height
├── Clear Button: 40px
└── History Items: 48px height
```

## Performance Optimizations

```
1. API Rate Limiting
   - Track last request time
   - Wait if < 1 second
   - Prevent spam

2. Efficient Polygon Checks
   - Ray casting algorithm (O(n))
   - Early exit on match
   - No complex calculations

3. Memoized Calculations
   - Safety score cached
   - LA averages calculated once
   - Comparison percentages memoized

4. Lazy Animations
   - Framer Motion with delays
   - AnimatePresence for conditionals
   - Optimized re-renders

5. Local Storage
   - Cache search history
   - Limit to 5 items
   - JSON serialization
```

## Mobile Optimizations

```
Touch Targets
├── All buttons: min 48px
├── Input field: 64px (4rem) height
├── History items: 48px height
└── Icon buttons: 40px

Typography
├── Input text: 18px (prevent zoom)
├── Body text: 16px (1rem)
├── Headings: 24-32px (1.5-2rem)
└── Captions: 14px (0.875rem)

Layout
├── Full-width search bar
├── Single column results
├── Collapsible sections
└── Bottom sheet patterns

Interactions
├── Tap instead of hover
├── Swipe gestures ready
├── Pull to refresh ready
└── Touch-friendly spacing
```

## Accessibility Features

```
ARIA Labels
├── Search input: "Search address"
├── Clear button: "Clear search"
├── Search button: "Search"
└── History items: Descriptive text

Keyboard Navigation
├── Tab order: Logical flow
├── Enter: Submit search
├── Escape: Close dropdown
└── Arrow keys: Navigate history

Screen Reader
├── Live regions for results
├── Status messages
├── Error announcements
└── Success feedback

Visual
├── High contrast ratios
├── Focus indicators
├── Color + icon/text
└── Resizable text
```

## Testing Checklist

```
✓ Unit Tests
  - geocodeAddress()
  - isPointInPolygon()
  - calculateDistance()
  - Safety score calculation

✓ Integration Tests
  - Search flow
  - History management
  - Error handling
  - Map integration

✓ E2E Tests
  - Complete user journey
  - Mobile workflow
  - Error scenarios
  - Performance metrics

✓ Accessibility Tests
  - Keyboard navigation
  - Screen reader
  - Color contrast
  - Focus management

✓ Visual Tests
  - Responsive design
  - Dark mode
  - Animations
  - Loading states
```
