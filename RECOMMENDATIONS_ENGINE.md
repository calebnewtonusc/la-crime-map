# Smart Recommendations Engine

## Overview
A comprehensive AI-powered neighborhood recommendation system for the LA Crime Map application. This feature helps users find their perfect Los Angeles neighborhood based on budget, lifestyle, and personal priorities.

## File Location
`/Users/joelnewton/Desktop/2026-Code/la-crime-map/components/features/recommendations.tsx`

## Features Implemented

### 1. Find Your Perfect Neighborhood Wizard
An interactive, step-by-step wizard that collects user preferences:

**Budget Slider**
- Range: $1,000 - $5,000/month
- Beautiful gradient slider with real-time value display
- Responsive design with smooth animations

**Priorities (Multi-select)**
- Safety - prioritizes low-crime neighborhoods
- Nightlife - looks for vibrant entertainment scenes
- Schools - focuses on high-rated educational institutions
- Transit - emphasizes public transportation access

**Lifestyle Selection**
- Family - optimizes for safety, schools, and peaceful environments
- Student - prioritizes affordability, transit, and nightlife
- Professional - balances walkability, transit, and social amenities
- Retiree - focuses on safety, peace, and accessibility

**Commute Location (Optional)**
- Placeholder for future geocoding integration
- Can be used to calculate distance/transit time to workplace

### 2. AI-Powered Recommendation Algorithm

**Sophisticated Scoring System**
- Safety Score (40% weight) - Most important factor
- Budget Match (20% weight) - How well rent fits user budget
- Priorities Match (30% weight) - Distributed across selected priorities
- Lifestyle Match (10% weight) - Customized scoring per lifestyle type

**Smart Features**
- Shows top 5 neighborhoods by default
- Real-time calculation based on user preferences
- Considers crime trends (improving/worsening)
- Balances multiple factors intelligently

### 3. Comprehensive Neighborhood Cards

Each recommendation shows:

**Prominent Safety Score**
- Large, eye-catching badge (0-100 scale)
- Color-coded: green for safe, red for higher crime
- Calculated from actual crime data

**Match Score**
- Overall compatibility rating (0-100)
- Based on user's complete preference profile

**Why Recommended**
- Up to 3 AI-generated reasons
- Examples: "Excellent safety record", "Great value for your budget", "Perfect for young professionals"

**Pros & Cons**
- Honest assessment of each neighborhood
- Pros: Up to 5 positive attributes
- Cons: Up to 3 drawbacks
- Helps users make informed decisions

**Quick Stats Grid**
- Walk Score (0-100)
- Transit Score (0-100)
- School Rating (0-10)
- Nightlife Rating (0-10)

**Similar Neighborhoods**
- "Similar to" comparisons
- Shows 3 most similar areas
- Calculated based on rent, amenities, and crime levels

**Monthly Rent**
- Clear pricing information
- Indicates if over/under budget

### 4. Quick Filters
Six instant recommendation modes:

**Safest Overall**
- Top 5 neighborhoods by safety score
- Perfect for security-conscious users

**Best Value**
- Safe + Affordable combination
- Safety score >= 70/100
- Rent <= $2,500/month
- Optimizes safety per dollar spent

**Improving Areas**
- Neighborhoods with declining crime rates
- Great for investment-minded renters
- Shows positive trends

**Family-Friendly**
- School rating >= 8/10
- Safety score >= 70/100
- Sorted by school quality

**Student Areas**
- Rent <= $2,200/month
- Transit score >= 75/100
- High nightlife ratings
- Affordable + Social focus

**Discover Random**
- Random safe neighborhood (score >= 70)
- Fun exploration mode
- Leads to special Discover view

### 5. Discover Mode
A beautiful full-screen view for random neighborhood exploration:

**Features**
- Large, immersive card design
- Prominent safety score display
- Complete pros/cons breakdown
- All amenity scores visible
- "Similar to" comparisons
- Save functionality
- "Discover Another" shuffle button
- Gradient header with animations

**Perfect For**
- Users who want serendipity
- Discovering hidden gems
- Exploring without specific criteria
- Learning about LA neighborhoods

### 6. Save & Share Functionality

**Save Recommendations**
- Click save icon on any neighborhood card
- Stores in local state (can be extended to localStorage)
- Build a favorites list
- Timestamp tracking

**Share Feature**
- Generates shareable text with top 5 picks
- Native share API support (mobile)
- Clipboard fallback (desktop)
- Format: "My top LA neighborhoods: 1. Beverly Hills (Score: 95/100)..."

### 7. Map View (Placeholder)
- Dedicated section in results view
- Beautiful placeholder with icon
- Ready for Leaflet/Google Maps integration
- Shows all recommended neighborhoods on map

## Technical Implementation

### Data Structure
```typescript
interface UserPreferences {
  budget: number
  priorities: Priority[]
  lifestyle: Lifestyle | null
  commuteLocation: { lat: number; lng: number } | null
}

interface NeighborhoodWithScore extends NeighborhoodData {
  score: number
  reasons: string[]
  pros: string[]
  cons: string[]
  similarTo: string[]
  rent: number
  walkScore: number
  transitScore: number
  schoolRating: number
  nightlifeRating: number
}
```

### Algorithm Highlights

**Safety Score Calculation**
```typescript
safetyScore = 100 - (totalCrime * 1.5)
// Scales inversely with crime count
// Range: 0-100
```

**Budget Scoring**
```typescript
budgetDiff = abs(rent - userBudget)
budgetScore = 100 - (budgetDiff / userBudget * 100)
// Penalizes deviation from budget
```

**Similarity Algorithm**
- Compares rent, walk score, transit score, and total crime
- Normalizes differences to 0-100 scale
- Returns top 3 most similar neighborhoods

### Placeholder Data
Comprehensive amenity data for all 35 LA neighborhoods:
- Realistic rent prices ($1,300 - $5,000)
- Walk scores (60-95)
- Transit scores (50-90)
- School ratings (4-10)
- Nightlife ratings (3-9)

## Animations & UX

### Framer Motion Animations
- Smooth page transitions
- Stagger effects on card lists
- Hover interactions (scale, lift)
- Spring animations on buttons
- Fade in/out transitions between views

### Design Patterns
- Gradient accents (neon-cyan to neon-purple)
- Consistent card-based layout
- Dark mode support throughout
- Responsive grid layouts
- Icon-driven visual hierarchy

## Usage Example

```tsx
import { SmartRecommendationsEngine } from '@/components/features/recommendations'

export default function RecommendationsPage() {
  return (
    <main>
      <SmartRecommendationsEngine />
    </main>
  )
}
```

## Future Enhancements

### Potential Additions
1. **Real API Integration**
   - Replace placeholder rent data with real listings
   - Integrate with Zillow/Redfin APIs
   - Live crime data updates

2. **Interactive Map**
   - Show all recommendations on Leaflet map
   - Click neighborhoods for details
   - Visual clustering by score
   - Heat map overlay

3. **Saved Lists**
   - Persist to localStorage/database
   - Named lists (e.g., "Safe Options", "Budget Friendly")
   - Compare saved neighborhoods side-by-side

4. **Commute Calculator**
   - Google Maps Distance Matrix API
   - Calculate drive time and transit time
   - Visualize commute on map
   - Factor into recommendation score

5. **More Filters**
   - Pet-friendly
   - Parking availability
   - Air quality
   - Green spaces
   - Restaurant density

6. **User Accounts**
   - Save preferences
   - Track search history
   - Email alerts for new matching listings

7. **Social Features**
   - Share specific neighborhoods
   - Compare recommendations with friends
   - Community ratings/reviews

8. **Advanced Scoring**
   - Machine learning for personalization
   - Learn from user interactions
   - A/B test different algorithms

## Dependencies Used
- `framer-motion` - Animations and transitions
- `lucide-react` - Icon library
- `react` - Core framework
- Existing LA Crime Map data structure

## Styling
- Tailwind CSS classes
- Custom dark mode support
- Gradient backgrounds
- Responsive breakpoints
- Hover/focus states

## Performance Considerations
- `useMemo` for expensive calculations
- Recommendations recalculated only when preferences change
- Efficient similarity algorithm
- Minimal re-renders with proper state management

## Accessibility
- Semantic HTML structure
- ARIA labels ready to add
- Keyboard navigation support
- Color contrast compliance
- Clear visual hierarchy

## Testing Recommendations
1. Test all quick filters produce results
2. Verify budget slider updates correctly
3. Check priority combinations
4. Test save/share functionality
5. Validate scoring algorithm accuracy
6. Mobile responsive testing
7. Dark mode appearance
8. Animation performance

## Integration Steps

To integrate into the LA Crime Map app:

1. **Add to Navigation**
```tsx
// In app/layout.tsx or navigation component
<Link href="/recommendations">Find Your Neighborhood</Link>
```

2. **Create Route**
```tsx
// app/recommendations/page.tsx
import { SmartRecommendationsEngine } from '@/components/features/recommendations'

export default function RecommendationsPage() {
  return (
    <MainLayout>
      <SmartRecommendationsEngine />
    </MainLayout>
  )
}
```

3. **Optional: Add to Homepage**
```tsx
// app/page.tsx
<section className="py-12">
  <h2>Not sure where to live?</h2>
  <Link href="/recommendations">
    <button>Find Your Perfect Neighborhood</button>
  </Link>
</section>
```

## Summary

This Smart Recommendations Engine provides a comprehensive, user-friendly way for people to discover LA neighborhoods that match their needs. The AI-powered algorithm balances safety (the top priority) with budget, lifestyle, and personal preferences to deliver personalized recommendations.

Key strengths:
- Safety-first approach with prominent scoring
- Honest pros/cons for informed decisions
- Multiple entry points (wizard, quick filters, discover)
- Beautiful, animated UI
- Intelligent similarity matching
- Save and share capabilities
- Ready for real data integration

The system makes apartment hunting in LA less overwhelming by cutting through 35+ neighborhoods to show only the top 5 matches, with clear reasoning for each recommendation.
