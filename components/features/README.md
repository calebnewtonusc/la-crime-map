# Address Search Feature

A powerful, mobile-optimized address search feature for the LA Crime Map application.

## Features

- **Autocomplete Search**: Fast address lookup using OpenStreetMap's Nominatim API
- **Neighborhood Detection**: Automatically determines which LA neighborhood contains the searched address
- **Crime Statistics**: Displays detailed crime data for the neighborhood
- **Safety Rating**: Color-coded safety score (0-100) with contextual information
- **Comparison to LA Average**: Shows how the neighborhood compares to LA County averages
- **Search History**: Recent searches saved in localStorage for quick access
- **Mobile-Optimized**: Large touch targets (min 48px) and responsive design
- **Error Handling**: Graceful handling of invalid addresses and out-of-bounds locations
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Components

### AddressSearch
Main search component with autocomplete and history.

```tsx
import { AddressSearch } from '@/components/features/address-search'

<AddressSearch
  onLocationFound={(result) => {
    // Handle location found
    console.log('Found:', result.neighborhood)
  }}
/>
```

### AddressSearchResult
Displays detailed results for a searched address.

```tsx
import { AddressSearchResult } from '@/components/features/address-search-result'

<AddressSearchResult result={searchResultData} />
```

## Integration Example

```tsx
'use client'

import { useState } from 'react'
import { AddressSearch } from '@/components/features/address-search'
import type { AddressSearchResultData } from '@/components/features/address-search'

export default function SearchPage() {
  const [selectedLocation, setSelectedLocation] = useState<AddressSearchResultData | null>(null)

  return (
    <div className="container mx-auto py-8">
      <AddressSearch
        onLocationFound={(result) => {
          setSelectedLocation(result)
          // Optionally: pan map to location
          // map.flyTo([result.coordinates.lat, result.coordinates.lng])
        }}
      />
    </div>
  )
}
```

## Usage with Map Integration

```tsx
'use client'

import { useState } from 'react'
import { AddressSearch } from '@/components/features/address-search'
import { MapWrapper } from '@/components/map/map-wrapper'
import type { AddressSearchResultData } from '@/components/features/address-search'

export default function MapWithSearch() {
  const [location, setLocation] = useState<AddressSearchResultData | null>(null)

  return (
    <div>
      <AddressSearch
        onLocationFound={(result) => {
          setLocation(result)
        }}
      />

      {location && (
        <div className="mt-8">
          <MapWrapper
            data={laNeighborhoods}
            selectedMetric="violentCrime"
            highlightNeighborhood={location.neighborhoodName}
            centerCoordinates={[location.coordinates.lat, location.coordinates.lng]}
          />
        </div>
      )}
    </div>
  )
}
```

## API

### AddressSearch Props

| Prop | Type | Description |
|------|------|-------------|
| `onLocationFound` | `(result: AddressSearchResultData) => void` | Optional callback when address is found |
| `className` | `string` | Optional CSS class name |

### AddressSearchResultData

```typescript
interface AddressSearchResultData {
  address: string                      // Full formatted address
  coordinates: { lat: number; lng: number }  // Geographic coordinates
  neighborhood: NeighborhoodData | null      // Crime data for the neighborhood
  neighborhoodName: string                   // Name of the neighborhood
}
```

### AddressSearchResult Props

| Prop | Type | Description |
|------|------|-------------|
| `result` | `AddressSearchResultData` | The search result to display |

## Styling

The components use Tailwind CSS with custom dark mode support. Color scheme:

- **Primary Accent**: `neon-cyan` (#00f5ff)
- **Success/Safe**: Green shades
- **Warning/Caution**: Yellow/Amber shades
- **Danger/High Crime**: Red shades
- **Neutral**: Gray shades with dark mode variants

## Local Storage

Search history is stored in localStorage under the key `la-crime-map-search-history`:

```typescript
interface SearchHistory {
  address: string
  timestamp: number
}
```

Maximum 5 recent searches are stored.

## Geocoding Service

Uses OpenStreetMap's Nominatim API:
- Free and open-source
- No API key required
- Rate limited to 1 request per second
- Automatically appends "Los Angeles, CA" to queries

## Safety Score Calculation

The safety score (0-100) is calculated by:
1. Summing all crime types for the neighborhood
2. Comparing to LA County average
3. Inverting and normalizing to 0-100 scale

**Ratings**:
- 75-100: Very Safe (Green)
- 50-74: Moderately Safe (Blue)
- 30-49: Exercise Caution (Yellow)
- 0-29: High Crime Area (Red)

## Accessibility

- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management
- Touch targets minimum 48px for mobile
- Color contrast ratios meet WCAG AA standards
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires localStorage for search history

## Performance

- Debounced geocoding requests
- Rate limiting to respect API usage
- Efficient polygon point-in-polygon checks
- Lazy animations with Framer Motion
- Optimized for mobile devices

## Error Handling

The component handles:
- Invalid addresses
- Addresses outside LA County
- Network failures
- API rate limiting
- Missing neighborhood data
- LocalStorage errors

## Future Enhancements

Potential improvements:
- Google Places API autocomplete integration
- Real-time crime incident data
- Street-level crime heatmaps
- Nearby amenities (schools, transit, etc.)
- Share search results
- Export neighborhood reports
- Multi-language support
