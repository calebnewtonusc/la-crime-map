/**
 * Example usage of utility functions
 * This file demonstrates how to use the various utilities
 * Remove this file once you've integrated the utilities into your components
 */

import {
  debounce,
  throttle,
  getColorMemoized,
  getAccessibleColor,
  getSeverityLevel,
  getColorStops,
  createPatternDefs,
  getSeverityDescription,
  calculateCrimeStats,
  createNeighborhoodData,
  type CrimeMetric,
  type AccessibilityOptions,
} from './index';

// ============================================================================
// PERFORMANCE UTILITIES EXAMPLES
// ============================================================================

// Example 1: Debounced search function
const handleSearchInput = debounce((searchQuery: string) => {
  console.log('Searching for:', searchQuery);
  // Perform search API call
}, 300);

// Example 2: Throttled scroll handler
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
  // Update UI based on scroll
}, 100);

// Example 3: Debounce with immediate execution
const handleClick = debounce(
  () => {
    console.log('Button clicked');
  },
  1000,
  true // Execute immediately on first call
);

// ============================================================================
// COLOR UTILITIES EXAMPLES
// ============================================================================

// Example 4: Get memoized color for crime data
const metric: CrimeMetric = 'violentCrime';
const crimeValue = 12;
const color = getColorMemoized(crimeValue, metric);
console.log('Crime color:', color); // Returns memoized color

// Example 5: Get color stops for legend
const legendStops = getColorStops('violentCrime');
console.log('Legend stops:', legendStops);
// Returns: [
//   { value: 0, color: '#4575b4' },
//   { value: 2, color: '#74add1' },
//   { value: 5, color: '#fee090' },
//   { value: 10, color: '#f46d43' },
//   { value: 15, color: '#d73027' }
// ]

// ============================================================================
// ACCESSIBILITY UTILITIES EXAMPLES
// ============================================================================

// Example 6: Get accessible color with high contrast
const accessibleColorOptions: AccessibilityOptions = {
  highContrast: true,
  colorblindMode: false,
};
const accessibleColor = getAccessibleColor(15, 'violentCrime', accessibleColorOptions);
console.log('Accessible color:', accessibleColor);
// Returns: { color: '#ff0000', pattern: undefined, description: '...' }

// Example 7: Get accessible color with colorblind mode
const colorblindOptions: AccessibilityOptions = {
  highContrast: false,
  colorblindMode: true,
};
const colorblindColor = getAccessibleColor(15, 'violentCrime', colorblindOptions);
console.log('Colorblind-safe color:', colorblindColor);
// Returns: { color: '#ff0000', pattern: 'crosshatch', description: '...' }

// Example 8: Get severity level
const severity = getSeverityLevel(12, 'violentCrime');
console.log('Severity level:', severity); // Returns: 'high'

// Example 9: Get severity description for screen readers
const description = getSeverityDescription(12, 'violentCrime', 'en');
console.log('Screen reader description:', description); // Returns: 'high severity'

// Example 10: Get Spanish description
const spanishDescription = getSeverityDescription(12, 'violentCrime', 'es');
console.log('Spanish description:', spanishDescription); // Returns: 'severidad alta'

// Example 11: Create SVG pattern definitions
const svgPatterns = createPatternDefs();
console.log('SVG Patterns:', svgPatterns);
// Use in SVG: <svg>{svgPatterns}<rect fill="url(#pattern-dots)" /></svg>

// ============================================================================
// NEIGHBORHOOD DATA EXAMPLES
// ============================================================================

// Example 12: Create neighborhood data with defaults
const basicNeighborhoodData = {
  name: 'Downtown LA',
  violentCrime: 45,
  carTheft: 23,
  breakIns: 12,
  pettyTheft: 67,
};

const neighborhoodData = createNeighborhoodData(basicNeighborhoodData);
console.log('Neighborhood data:', neighborhoodData);
// Returns object with all crime stats and default values for analytics fields

// ============================================================================
// CRIME STATISTICS EXAMPLES
// ============================================================================

// Example 13: Calculate crime statistics from GeoJSON data
// Note: calculateCrimeStats expects NeighborhoodGeoJSON type from API/data layer
// This example shows the shape of data it expects:
/*
const geoJsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Downtown LA',
        violentCrime: 45,
        carTheft: 23,
        breakIns: 12,
        pettyTheft: 67,
      },
      geometry: { ... }
    },
    // ... more neighborhoods
  ]
};

const stats = calculateCrimeStats(geoJsonData);
console.log('Crime statistics:', stats);
// Returns: {
//   totalNeighborhoods: number,
//   totalCrimes: number,
//   avgViolentCrime: number,
//   avgCarTheft: number,
//   avgBreakIns: number,
//   avgPettyTheft: number,
//   safestNeighborhood: string,
//   mostDangerous: string
// }
*/

// ============================================================================
// REACT COMPONENT USAGE EXAMPLES
// ============================================================================

/**
 * Example React component using debounce
 */
/*
'use client';

import { useState, useCallback } from 'react';
import { debounce } from '@/lib/utils';

export function SearchBar() {
  const [query, setQuery] = useState('');

  const performSearch = useCallback(
    debounce((searchTerm: string) => {
      // API call or search logic
      console.log('Searching for:', searchTerm);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  return <input type="text" value={query} onChange={handleChange} />;
}
*/

/**
 * Example React component using color utilities
 */
/*
'use client';

import { getAccessibleColor } from '@/lib/utils';

interface CrimeMapMarkerProps {
  value: number;
  metric: 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
  highContrast?: boolean;
  colorblindMode?: boolean;
}

export function CrimeMapMarker({
  value,
  metric,
  highContrast = false,
  colorblindMode = false,
}: CrimeMapMarkerProps) {
  const { color, pattern, description } = getAccessibleColor(value, metric, {
    highContrast,
    colorblindMode,
  });

  return (
    <div
      className="marker"
      style={{ backgroundColor: color }}
      aria-label={description}
      title={description}
    >
      {value}
    </div>
  );
}
*/

/**
 * Example Server Component using color utilities
 */
/*
import { getColorMemoized } from '@/lib/utils';

interface CrimeHeatmapProps {
  crimeData: Array<{
    neighborhood: string;
    violentCrime: number;
  }>;
}

export default function CrimeHeatmap({ crimeData }: CrimeHeatmapProps) {
  return (
    <div className="heatmap">
      {crimeData.map((data) => {
        const color = getColorMemoized(data.violentCrime, 'violentCrime');
        return (
          <div
            key={data.neighborhood}
            className="heatmap-cell"
            style={{ backgroundColor: color }}
          >
            {data.neighborhood}: {data.violentCrime}
          </div>
        );
      })}
    </div>
  );
}
*/

export default {
  debounce,
  throttle,
  getColorMemoized,
  getAccessibleColor,
  getSeverityLevel,
  getColorStops,
  createPatternDefs,
  getSeverityDescription,
  calculateCrimeStats,
  createNeighborhoodData,
};
