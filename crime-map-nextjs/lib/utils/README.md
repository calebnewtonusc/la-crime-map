# Utility Functions

This directory contains shared utility functions for the LA Crime Map Next.js application.

## Modules

### Performance Utilities (`debounce.ts`)

Performance optimization utilities for handling frequent function calls.

```typescript
import { debounce, throttle } from '@/lib/utils';

// Debounce search input
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// Throttle scroll handler
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

### Accessibility Colors (`accessibility-colors.ts`)

WCAG AA compliant color schemes with support for high contrast and colorblind modes.

```typescript
import { getAccessibleColor, getSeverityLevel } from '@/lib/utils';

// Get accessible color for a crime value
const { color, pattern, description } = getAccessibleColor(
  15,
  'violentCrime',
  {
    highContrast: true,
    colorblindMode: true,
  }
);

// Get severity level
const severity = getSeverityLevel(15, 'violentCrime'); // 'veryHigh'
```

### Color Utilities (`color-utils.ts`)

Memoized color calculations with colorblind-safe palette.

```typescript
import { getColorMemoized, getColorStops } from '@/lib/utils';

// Get color with caching for performance
const color = getColorMemoized(12, 'violentCrime');

// Get color legend data
const stops = getColorStops('violentCrime');
```

### Crime Statistics (`crime-stats.ts`)

Crime data calculation utilities.

```typescript
import { calculateCrimeStats } from '@/lib/utils';

const stats = calculateCrimeStats(crimeData);
```

### Neighborhood Initialization (`neighborhood-initializer.ts`)

Create neighborhood data structures with default values.

```typescript
import { createNeighborhoodData } from '@/lib/utils';

const neighborhoodData = createNeighborhoodData(basicData);
```

## Usage

All utilities can be imported from the barrel export:

```typescript
import {
  debounce,
  throttle,
  getColorMemoized,
  getAccessibleColor,
  calculateCrimeStats,
} from '@/lib/utils';
```

## TypeScript Types

All utilities include full TypeScript type definitions:

- `CrimeMetric`: 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft'
- `SeverityLevel`: 'low' | 'moderate' | 'high' | 'veryHigh'
- `ColorScheme`: Interface for color scheme definitions
- `AccessibleColorResult`: Return type for accessible color functions
- `AccessibilityOptions`: Configuration for accessibility features
