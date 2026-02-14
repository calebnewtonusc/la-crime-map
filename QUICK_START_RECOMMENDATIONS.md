# Quick Start: Smart Recommendations Engine

## What Was Built

A complete AI-powered neighborhood recommendation system with three main views:

### 1. Wizard View (Main Entry Point)
**Location:** Initial view when component loads

**Features:**
- Budget slider ($1,000 - $5,000)
- Priority checkboxes (Safety, Nightlife, Schools, Transit)
- Lifestyle buttons (Family, Student, Professional, Retiree)
- Optional commute location
- "Get Recommendations" button

**Quick Filters Section:**
- Safest Overall
- Best Value (Safe + Affordable)
- Improving Areas (Crime ↓)
- Family-Friendly
- Student Areas
- Discover Random (Special mode)

### 2. Results View
**Triggered by:** Clicking "Get Recommendations" or any quick filter

**Shows:**
- Top 5 neighborhoods ranked by match score
- Each card displays:
  - Rank number (1-5)
  - Neighborhood name
  - Match score (0-100)
  - **PROMINENT Safety Score** (large green badge)
  - Monthly rent
  - Why recommended (up to 3 reasons)
  - Quick stats (Walk, Transit, Schools, Nightlife)
  - "Similar to" neighborhoods
  - Save button

**Additional:**
- Share button (top right) - shares top 5 list
- Back button to return to wizard
- Map view placeholder (ready for integration)

### 3. Discover View
**Triggered by:** Clicking "Discover Random" quick filter

**Features:**
- Full-screen immersive card
- Random safe neighborhood (score >= 70)
- Large gradient header with neighborhood name
- Prominent safety score display
- Complete pros/cons breakdown
- All amenity scores
- Similar neighborhoods
- "Save" button
- "Discover Another" shuffle button
- Back to wizard button

## File Locations

```
/Users/joelnewton/Desktop/2026-Code/la-crime-map/
├── components/features/
│   └── recommendations.tsx          (Main component - 1,129 lines)
├── app/recommendations/
│   └── page.tsx                     (Route page)
├── RECOMMENDATIONS_ENGINE.md        (Full documentation)
└── QUICK_START_RECOMMENDATIONS.md   (This file)
```

## How to Use

### Option 1: Visit the Route
1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/recommendations`
3. Start using the wizard!

### Option 2: Import in Any Page
```tsx
import { SmartRecommendationsEngine } from '@/components/features/recommendations'

export default function MyPage() {
  return <SmartRecommendationsEngine />
}
```

### Option 3: Add to Navigation
```tsx
// In your navigation component
<Link
  href="/recommendations"
  className="nav-link"
>
  Find Your Neighborhood
</Link>
```

## Quick Test Scenarios

### Test 1: Budget-Conscious Student
1. Set budget to $1,800
2. Select priorities: Transit, Nightlife
3. Choose lifestyle: Student
4. Click "Get Recommendations"
5. **Expected:** Van Nuys, North Hollywood, Pasadena, Palms, Glendale

### Test 2: Safety-First Family
1. Set budget to $3,000
2. Select priorities: Safety, Schools
3. Choose lifestyle: Family
4. Click "Get Recommendations"
5. **Expected:** Beverly Hills, Bel Air, Studio City, Encino, Torrance

### Test 3: Professional on Budget
1. Set budget to $2,500
2. Select priorities: Safety, Transit
3. Choose lifestyle: Professional
4. Click "Get Recommendations"
5. **Expected:** Culver City, Palms, Pasadena, Sherman Oaks, Burbank

### Test 4: Quick Filters
1. Click "Safest Overall"
2. **Expected:** Beverly Hills, Bel Air, Manhattan Beach, Marina del Rey, West LA

1. Click "Best Value"
2. **Expected:** Palms, Torrance, Sherman Oaks, Redondo Beach, Burbank

1. Click "Discover Random"
2. **Expected:** Random safe neighborhood in full-screen discover view

## Data Structure

### User Input
- Budget: Number (1000-5000)
- Priorities: Array of 'safety' | 'nightlife' | 'schools' | 'transit'
- Lifestyle: 'family' | 'student' | 'professional' | 'retiree' | null

### Algorithm Output (per neighborhood)
- Match Score: 0-100 (higher = better match)
- Safety Score: 0-100 (calculated from crime data)
- Reasons: Array of strings (why recommended)
- Pros: Array of positive attributes
- Cons: Array of drawbacks
- Similar To: Array of 3 neighborhood names

### Scoring Weights
- Safety: 40% (most important)
- Budget Match: 20%
- Priorities: 30% (split among selected)
- Lifestyle: 10%

## Customization Guide

### Change Default Budget
```tsx
// In recommendations.tsx, line ~155
const [preferences, setPreferences] = useState<UserPreferences>({
  budget: 3000, // Change this
  priorities: ['safety'],
  lifestyle: null,
  commuteLocation: null
})
```

### Adjust Safety Weight
```tsx
// In getRecommendations function, line ~251
score += safetyScore * 0.5 // Change from 0.4 to increase safety importance
```

### Modify Quick Filter Thresholds
```tsx
// In getBestValue function, line ~376
return getRecommendations.filter(n =>
  calculateSafetyScore(n) >= 80 && // Change threshold
  n.rent <= 3000                    // Change max rent
)
```

### Add New Priority
1. Update type: `type Priority = 'safety' | 'nightlife' | 'schools' | 'transit' | 'parking'`
2. Add button in wizard:
```tsx
<PriorityButton
  icon={Car}
  label="Parking"
  selected={preferences.priorities.includes('parking')}
  onClick={() => togglePriority('parking')}
/>
```
3. Add scoring logic in getRecommendations function

## Visual Design

### Color Palette
- Primary Gradient: Neon Cyan → Neon Purple
- Safety: Green (#10b981, #22c55e)
- Warning: Orange/Amber
- Danger: Red (#ef4444, #dc2626)
- Neutral: Gray scale

### Animations
- Page transitions: 0.4s fade + slide
- Card hover: lift 4px + shadow
- Button interactions: scale + spring
- Stagger children: 0.1s delay between items

### Responsive Breakpoints
- Mobile: Single column
- Tablet (sm): 2 columns for buttons/filters
- Desktop (lg): 3-4 columns for grids

## Future Integration Ideas

### 1. Connect to Main Map
```tsx
// When user clicks a neighborhood card
onClick={() => {
  // Navigate to main map
  router.push(`/?neighborhood=${neighborhood.name}`)
  // Or open modal with map
  setMapModal({ show: true, neighborhood })
}}
```

### 2. Save to Local Storage
```tsx
// In SmartRecommendationsEngine component
useEffect(() => {
  localStorage.setItem('savedNeighborhoods', JSON.stringify(savedRecommendations))
}, [savedRecommendations])

// On mount
useEffect(() => {
  const saved = localStorage.getItem('savedNeighborhoods')
  if (saved) setSavedRecommendations(JSON.parse(saved))
}, [])
```

### 3. Add Real Rent Data
```tsx
// Create API endpoint
// app/api/rent-data/route.ts
export async function GET() {
  const rentData = await fetch('https://api.zillow.com/...')
  return Response.json(rentData)
}

// Use in component
const { data: rentData } = useSWR('/api/rent-data', fetcher)
```

### 4. Email Results
```tsx
const emailResults = async () => {
  await fetch('/api/email-recommendations', {
    method: 'POST',
    body: JSON.stringify({
      email: userEmail,
      recommendations: getRecommendations.slice(0, 5)
    })
  })
}
```

## Troubleshooting

### Issue: No neighborhoods show up
**Check:** Ensure laNeighborhoods data is loaded
**Fix:** Add loading state and error handling

### Issue: Scores seem off
**Check:** NEIGHBORHOOD_AMENITIES has data for all neighborhoods
**Fix:** Add default values fallback (already implemented)

### Issue: Quick filters return empty results
**Check:** Filter thresholds might be too strict
**Fix:** Lower threshold values (e.g., safety >= 60 instead of >= 70)

### Issue: Animations are laggy
**Check:** Too many simultaneous animations
**Fix:** Reduce stagger delay or disable some animations

## Performance Tips

1. **useMemo** already implemented for recommendations calculation
2. Recommendations only recalculate when preferences change
3. Consider pagination if showing more than 10 results
4. Use React.memo for NeighborhoodCard if list gets long
5. Lazy load Discover view images if added

## Accessibility Notes

- All buttons have visible labels
- Color is not the only indicator (icons + text)
- Keyboard navigation works (native button elements)
- Consider adding:
  - ARIA labels for sliders
  - Screen reader announcements for score changes
  - Focus management for view transitions

## Mobile Experience

- Touch-optimized button sizes (p-4)
- Responsive grid layouts
- Swipe gestures ready (Framer Motion supports)
- Horizontal scrolling prevented
- Text remains readable on small screens

## Next Steps

1. **Test on all devices** (mobile, tablet, desktop)
2. **Gather user feedback** on algorithm accuracy
3. **A/B test** different scoring weights
4. **Add analytics** to track popular filters
5. **Integrate with real data** (Zillow, Yelp, etc.)
6. **Add user accounts** for saving preferences
7. **Implement map view** with Leaflet

## Support

For questions or issues:
- Read full docs: `RECOMMENDATIONS_ENGINE.md`
- Check component code: `components/features/recommendations.tsx`
- Review data structure: `lib/data/neighborhoods.ts`
- Examine types: `lib/data/types.ts`

---

**Built with:** React, TypeScript, Framer Motion, Tailwind CSS, Lucide Icons

**Status:** Production-ready with placeholder amenity data

**Version:** 1.0.0

**Last Updated:** February 14, 2026
