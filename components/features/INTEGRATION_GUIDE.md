# Quick Integration Guide

## Add Address Search to Existing Pages

### Option 1: Add to Home Page (app/page.tsx)

Add the search feature above the map on the home page:

```tsx
// Add import at the top
import { AddressSearch } from '@/components/features/address-search'
import type { AddressSearchResultData } from '@/components/features'

// Inside your component, add state
const [searchLocation, setSearchLocation] = useState<AddressSearchResultData | null>(null)

// Add before the map section (around line 88)
{/* Address Search Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15, duration: 0.5 }}
>
  <AddressSearch
    onLocationFound={(result) => {
      setSearchLocation(result)
      // Optionally change metric based on highest crime in neighborhood
      if (result.neighborhood) {
        // Find highest crime type
        const crimes = {
          violentCrime: result.neighborhood.violentCrime,
          carTheft: result.neighborhood.carTheft,
          breakIns: result.neighborhood.breakIns,
          pettyTheft: result.neighborhood.pettyTheft
        }
        const highest = Object.keys(crimes).reduce((a, b) =>
          crimes[a as CrimeMetric] > crimes[b as CrimeMetric] ? a : b
        ) as CrimeMetric
        setSelectedMetric(highest)
      }
    }}
  />
</motion.div>
```

### Option 2: Create Dedicated Search Page

The search page is already created at `/app/search/page.tsx`.

Access it at: `http://localhost:3000/search`

### Option 3: Add to Navigation

Update the header to include a search link:

```tsx
// In components/layout/header.tsx or navigation
<Link
  href="/search"
  className="text-gray-700 dark:text-gray-300 hover:text-neon-cyan transition-colors"
>
  Search Address
</Link>
```

### Option 4: Search with Map Integration

Replace the entire main page content with the integrated version:

```tsx
import { SearchWithMap } from '@/components/features'

export default function Home() {
  return (
    <ErrorBoundary>
      <MainLayout>
        <SearchWithMap defaultMetric="violentCrime" />
      </MainLayout>
    </ErrorBoundary>
  )
}
```

## Testing Your Integration

### 1. Start the development server
```bash
cd /Users/joelnewton/Desktop/2026-Code/la-crime-map
npm run dev
```

### 2. Test addresses
Try these sample addresses:
- `1200 Getty Center Dr, Los Angeles` (Bel Air - Safe)
- `Hollywood Blvd, Los Angeles` (Hollywood - Moderate)
- `Compton, CA` (Compton - Higher crime)
- `Santa Monica, CA` (Santa Monica - Safe)

### 3. Test error cases
- Invalid address: `asdfjkl123`
- Out of bounds: `123 Main St, San Francisco`
- Empty search

### 4. Test mobile
- Open dev tools
- Toggle device toolbar
- Test on 375px (iPhone) and 768px (iPad)
- Verify touch targets are large enough

## Common Issues

### Issue: "Module not found" error
**Solution**: Ensure all imports use the correct paths with `@/` alias

### Issue: Map not showing
**Solution**:
1. Check that Leaflet CSS is imported
2. Verify map container has explicit height
3. Ensure component is client-side (`'use client'`)

### Issue: Dark mode colors wrong
**Solution**: Check `next-themes` is configured in layout.tsx

### Issue: Geocoding not working
**Solution**:
1. Check network tab for API calls
2. Verify no CORS errors
3. Check rate limiting (1 req/sec)

### Issue: Neighborhood not detected
**Solution**:
1. Verify coordinates are in LA County
2. Check polygon data in neighborhoods.ts
3. Ensure point-in-polygon algorithm is working

## Next Steps

1. **Customize Styling**: Update colors in `address-search.tsx` to match your brand
2. **Add Analytics**: Track searches (see USAGE_EXAMPLES.md)
3. **Enhance Map**: Add markers, highlight neighborhoods
4. **Add Features**: Nearby incidents, crime trends, comparisons
5. **Optimize**: Add caching, reduce API calls

## Production Checklist

Before deploying:
- [ ] Test on multiple devices
- [ ] Verify error handling
- [ ] Check accessibility (keyboard nav, screen readers)
- [ ] Test with slow network
- [ ] Verify localStorage works
- [ ] Test all example addresses
- [ ] Check dark mode
- [ ] Verify SEO meta tags
- [ ] Test performance (Lighthouse)
- [ ] Check console for errors

## Need Help?

Refer to:
- `README.md` - Feature overview
- `USAGE_EXAMPLES.md` - Code examples
- `ADDRESS_SEARCH_IMPLEMENTATION.md` - Technical details
