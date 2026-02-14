# Quick Start: UX Context Features

Get your crime data from "meaningless numbers" to "actionable insights" in 5 minutes.

---

## 1. Import the Utilities

```typescript
import {
  getSafetyScore,
  getComparisonMetrics,
  getMetricComparison,
  getCrimeTooltip,
} from '@/lib/utils/safety-scoring'

import { SafetyBadge } from '@/components/ui/safety-badge'
import { MetricCard } from '@/components/ui/metric-card'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
```

---

## 2. Get Your Data

```typescript
// Single neighborhood
const neighborhood = laNeighborhoods.features.find(
  f => f.properties.name === 'Beverly Hills'
)?.properties

// All neighborhoods (for comparisons)
const allNeighborhoods = laNeighborhoods.features.map(f => f.properties)
```

---

## 3. Calculate Safety Score

```typescript
// Get complete safety score with grade and styling
const safetyScore = getSafetyScore(neighborhood)

console.log(safetyScore)
// {
//   score: 95,
//   letterGrade: 'A',
//   color: { light: '#22c55e', dark: '#10b981', ... },
//   description: 'Very Safe - Excellent safety record...'
// }
```

---

## 4. Display Safety Badge

```typescript
// Compact badge
<SafetyBadge
  safetyScore={safetyScore}
  showDescription={true}
  size="md"
/>

// Full card with description
<SafetyBadgeWithDescription safetyScore={safetyScore} />
```

**Result:**
```
🛡️ [A] (95) [i]
```

---

## 5. Add Context to Metric Cards

```typescript
import { AlertTriangle } from 'lucide-react'

// Get comparison for violent crime
const comparison = getMetricComparison(
  neighborhood.violentCrime,
  'violentCrime',
  allNeighborhoods
)

// Get contextual tooltip
const tooltip = getCrimeTooltip('violentCrime', neighborhood.violentCrime)

// Render enhanced metric card
<MetricCard
  label="Violent Crime"
  value={neighborhood.violentCrime}
  icon={AlertTriangle}
  vsAverage={comparison.vsAverage}
  percentile={comparison.percentile}
  trafficLight={comparison.trafficLight}
  tooltip={tooltip}
/>
```

**Result:**
```
┌─────────────────────────────────┐
│ Violent Crime [i]      1        │
│                        per month│
│ 🟢 92% below average             │
│ ████████████████████░ 95%        │
└─────────────────────────────────┘
```

---

## 6. Complete Example: Neighborhood View

```tsx
'use client'

import { getSafetyScore, getMetricComparison, getCrimeTooltip } from '@/lib/utils/safety-scoring'
import { SafetyBadge } from '@/components/ui/safety-badge'
import { MetricCard } from '@/components/ui/metric-card'
import { AlertTriangle, Car, Home, ShoppingBag } from 'lucide-react'
import { laNeighborhoods } from '@/lib/data/neighborhoods'

export function NeighborhoodView({ neighborhoodName }: { neighborhoodName: string }) {
  // Get data
  const neighborhood = laNeighborhoods.features.find(
    f => f.properties.name === neighborhoodName
  )?.properties

  const allNeighborhoods = laNeighborhoods.features.map(f => f.properties)

  if (!neighborhood) return <div>Neighborhood not found</div>

  // Calculate safety score
  const safetyScore = getSafetyScore(neighborhood)

  // Helper to render metric card
  const renderMetric = (metric: 'violentCrime' | 'breakIns' | 'carTheft' | 'pettyTheft', label: string, icon: any) => {
    const comparison = getMetricComparison(neighborhood[metric], metric, allNeighborhoods)
    const tooltip = getCrimeTooltip(metric, neighborhood[metric])

    return (
      <MetricCard
        label={label}
        value={neighborhood[metric]}
        icon={icon}
        vsAverage={comparison.vsAverage}
        percentile={comparison.percentile}
        trafficLight={comparison.trafficLight}
        tooltip={tooltip}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with safety badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{neighborhood.name}</h1>
        <SafetyBadge safetyScore={safetyScore} showDescription />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetric('violentCrime', 'Violent Crime', AlertTriangle)}
        {renderMetric('breakIns', 'Break-ins', Home)}
        {renderMetric('carTheft', 'Car Theft', Car)}
        {renderMetric('pettyTheft', 'Petty Theft', ShoppingBag)}
      </div>
    </div>
  )
}
```

---

## 7. Common Patterns

### Pattern 1: Neighborhood Comparison

```tsx
function CompareNeighborhoods({ name1, name2 }: { name1: string, name2: string }) {
  const n1 = getNeighborhood(name1)
  const n2 = getNeighborhood(name2)
  const all = getAllNeighborhoods()

  const score1 = getSafetyScore(n1)
  const score2 = getSafetyScore(n2)

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2>{n1.name}</h2>
        <SafetyBadge safetyScore={score1} />
      </div>
      <div>
        <h2>{n2.name}</h2>
        <SafetyBadge safetyScore={score2} />
      </div>
    </div>
  )
}
```

### Pattern 2: Safety Score List

```tsx
function SafetyScoreList() {
  const neighborhoods = getAllNeighborhoods()
  const withScores = neighborhoods.map(n => ({
    ...n,
    safetyScore: getSafetyScore(n)
  }))

  // Sort by safety score
  const sorted = withScores.sort((a, b) => b.safetyScore.score - a.safetyScore.score)

  return (
    <div className="space-y-2">
      {sorted.map(n => (
        <div key={n.name} className="flex items-center justify-between">
          <span>{n.name}</span>
          <SafetyBadge safetyScore={n.safetyScore} size="sm" />
        </div>
      ))}
    </div>
  )
}
```

### Pattern 3: Traffic Light Summary

```tsx
import { TrafficLight } from '@/components/ui/safety-badge'

function SafetySummary({ neighborhood }: { neighborhood: NeighborhoodData }) {
  const score = getSafetyScore(neighborhood)
  const metrics = getComparisonMetrics(neighborhood, allNeighborhoods)

  return (
    <div className="flex items-center gap-3">
      <TrafficLight color={metrics.trafficLight} />
      <div>
        <div className="font-semibold">Grade {score.letterGrade}</div>
        <div className="text-sm text-gray-600">{metrics.percentileText}</div>
      </div>
    </div>
  )
}
```

---

## 8. Customization

### Custom Color Scheme

```typescript
// Modify colors in safety-scoring.ts
const gradeColors: Record<LetterGrade, SafetyScore['color']> = {
  A: {
    light: '#your-color',
    dark: '#your-dark-color',
    bg: 'bg-your-100 dark:bg-your-900/30',
    text: 'text-your-700 dark:text-your-400',
  },
  // ... other grades
}
```

### Custom Weights

```typescript
// Modify weights in safety-scoring.ts
const CRIME_WEIGHTS = {
  violentCrime: 0.50,  // Increase importance
  breakIns: 0.25,
  carTheft: 0.15,
  pettyTheft: 0.10,    // Decrease importance
}
```

### Custom Thresholds

```typescript
// Modify thresholds in safety-scoring.ts
const THRESHOLDS = {
  violentCrime: { min: 1, max: 20, average: 8 },
  // ... adjust based on your data
}
```

---

## 9. TypeScript Types

```typescript
// Safety score result
type SafetyScore = {
  score: number              // 0-100
  letterGrade: LetterGrade   // 'A' | 'B' | 'C' | 'D' | 'F'
  color: {
    light: string
    dark: string
    bg: string
    text: string
  }
  description: string
}

// Comparison metrics
type ComparisonMetrics = {
  vsLAAverage: number               // Difference from average
  vsLAAveragePercent: string        // "20% safer than average"
  percentile: number                // 0-100
  percentileText: string            // "Safer than 75% of LA"
  trafficLight: 'green' | 'yellow' | 'red'
}

// Individual metric comparison
type MetricComparison = {
  vsAverage: string                 // "85% below average"
  trafficLight: 'green' | 'yellow' | 'red'
  percentile: number                // 0-100
}
```

---

## 10. Testing

```typescript
import { calculateSafetyScore, getLetterGrade } from '@/lib/utils/safety-scoring'

// Test safety score calculation
const testNeighborhood = {
  name: 'Test Area',
  violentCrime: 1,
  breakIns: 3,
  carTheft: 4,
  pettyTheft: 7,
}

const score = calculateSafetyScore(testNeighborhood)
console.log('Safety Score:', score)  // 95

const grade = getLetterGrade(score)
console.log('Letter Grade:', grade)  // 'A'
```

---

## 11. Performance Tips

### Memoize Calculations

```typescript
import { useMemo } from 'react'

function NeighborhoodCard({ neighborhood, allNeighborhoods }) {
  const safetyScore = useMemo(
    () => getSafetyScore(neighborhood),
    [neighborhood]
  )

  const comparison = useMemo(
    () => getComparisonMetrics(neighborhood, allNeighborhoods),
    [neighborhood, allNeighborhoods]
  )

  // ... render
}
```

### Precompute for Lists

```typescript
// When displaying many neighborhoods, precompute once
const neighborhoodsWithScores = useMemo(() =>
  neighborhoods.map(n => ({
    ...n,
    safetyScore: getSafetyScore(n),
    comparison: getComparisonMetrics(n, neighborhoods)
  })),
  [neighborhoods]
)
```

---

## 12. Common Issues

### Issue: "Cannot find module '@/lib/utils/safety-scoring'"
**Solution:** Check your TypeScript paths in `tsconfig.json`

### Issue: Colors not showing in dark mode
**Solution:** Ensure your Tailwind config includes dark mode classes

### Issue: Percentiles seem wrong
**Solution:** Make sure you're passing ALL neighborhoods, not filtered ones

### Issue: Scores don't add up to 100
**Solution:** Check that your weights sum to 1.0 (100%)

---

## 13. Reference Files

- **Documentation:** `/lib/utils/SAFETY_SCORING_README.md`
- **Working Example:** `/components/ui/SAFETY_INTEGRATION_EXAMPLE.tsx`
- **Before/After:** `/BEFORE_AFTER_COMPARISON.md`
- **Implementation Summary:** `/UX_CONTEXT_IMPLEMENTATION_SUMMARY.md`

---

## 14. Next Steps

1. ✅ Import utilities
2. ✅ Calculate safety scores
3. ✅ Display safety badges
4. ✅ Add context to metrics
5. 🚀 Customize for your use case
6. 🚀 Add to your map popups
7. 🚀 Integrate with search results
8. 🚀 Create comparison views

---

## Need Help?

See the complete working example:
```bash
# View the demo component
open components/ui/SAFETY_INTEGRATION_EXAMPLE.tsx
```

Read the detailed documentation:
```bash
# Full API reference
open lib/utils/SAFETY_SCORING_README.md
```

---

**That's it!** You've transformed meaningless crime numbers into actionable safety insights.

**Before:** "12 violent crimes" 🤷
**After:** "Grade A - Very Safe - 85% below average - Safer than 92% of LA" ✅
