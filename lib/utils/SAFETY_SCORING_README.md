# Safety Scoring System - User Context Features

## Overview

This safety scoring system transforms raw crime numbers into meaningful insights that users can actually understand and use. It addresses the user complaint: **"IT IS NOT USEFUL AT ALL"** by adding contextual information to raw crime data.

## The Problem

Raw crime numbers like "12 violent crimes" or "25 petty thefts" mean nothing to users without context:
- Is 12 violent crimes a lot or a little?
- How does this compare to other neighborhoods?
- What does this mean for my safety?

## The Solution

### 1. Safety Score (0-100) with Letter Grades (A-F)

**Weighted Algorithm:**
- Violent Crime: 40% (highest weight - most serious)
- Break-ins: 25% (property crime affecting homes)
- Car Theft: 20% (property crime affecting vehicles)
- Petty Theft: 15% (lowest weight - least serious)

**Letter Grades:**
- **A (85-100)**: Very Safe - Excellent safety record with minimal crime
- **B (70-84)**: Safe - Good safety record with below-average crime
- **C (55-69)**: Moderately Safe - Average safety with some crime concerns
- **D (40-54)**: Less Safe - Above-average crime levels, exercise caution
- **F (0-39)**: High Crime - Significantly elevated crime levels

**Color Coding:**
- Grade A: Green
- Grade B: Blue
- Grade C: Yellow
- Grade D: Orange
- Grade F: Red

### 2. Comparison Metrics

**vs LA Average:**
- "20% safer than average"
- "15% less safe than average"
- "About average for LA"

**Percentile Ranking:**
- "Safer than 75% of LA"
- Shows what percentage of LA neighborhoods this area is safer than

**Traffic Light Indicators:**
- 🟢 Green: Score ≥70 (Safe)
- 🟡 Yellow: Score 50-69 (Moderate)
- 🔴 Red: Score <50 (High Crime)

### 3. Contextual Tooltips

Each crime metric includes a tooltip that explains:
- What the number represents (e.g., "12 violent crimes per month")
- What types of crimes are included
- How common this is in LA

## Usage

### Basic Safety Score

```tsx
import { getSafetyScore } from '@/lib/utils/safety-scoring'
import { SafetyBadge } from '@/components/ui/safety-badge'

const safetyScore = getSafetyScore(neighborhood)

<SafetyBadge safetyScore={safetyScore} showDescription />
```

### Enhanced Metric Card

```tsx
import { MetricCard } from '@/components/ui/metric-card'
import { getMetricComparison, getCrimeTooltip } from '@/lib/utils/safety-scoring'
import { AlertTriangle } from 'lucide-react'

const comparison = getMetricComparison(
  neighborhood.violentCrime,
  'violentCrime',
  allNeighborhoods
)

<MetricCard
  label="Violent Crime"
  value={neighborhood.violentCrime}
  icon={AlertTriangle}
  vsAverage={comparison.vsAverage}
  percentile={comparison.percentile}
  trafficLight={comparison.trafficLight}
  tooltip={getCrimeTooltip('violentCrime', neighborhood.violentCrime)}
/>
```

### Full Comparison Metrics

```tsx
import { getComparisonMetrics } from '@/lib/utils/safety-scoring'

const comparison = getComparisonMetrics(neighborhood, allNeighborhoods)

console.log(comparison.vsLAAveragePercent) // "20% safer than average"
console.log(comparison.percentileText)     // "Safer than 75% of LA"
console.log(comparison.trafficLight)       // "green"
```

## Components

### SafetyBadge
Displays safety score with color-coded letter grade.

**Props:**
- `safetyScore`: SafetyScore object
- `showDescription`: boolean (default: false) - Shows info tooltip
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `animated`: boolean (default: true)

### SafetyBadgeWithDescription
Full card with safety badge, score, and description.

**Props:**
- `safetyScore`: SafetyScore object
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

### TrafficLight
Simple colored dot indicator.

**Props:**
- `color`: 'green' | 'yellow' | 'red'
- `size`: 'sm' | 'md' | 'lg' (default: 'sm')
- `label`: string (optional)
- `animated`: boolean (default: true)

### Enhanced MetricCard
Now supports contextual information.

**New Props:**
- `vsAverage`: string - Comparison to LA average
- `percentile`: number - Percentile ranking (0-100)
- `trafficLight`: 'green' | 'yellow' | 'red' - Safety indicator
- `tooltip`: string - Contextual explanation

## Functions

### calculateSafetyScore(neighborhood: NeighborhoodData): number
Returns safety score (0-100) using weighted algorithm.

### getLetterGrade(score: number): LetterGrade
Converts score to letter grade (A-F).

### getSafetyScore(neighborhood: NeighborhoodData): SafetyScore
Returns complete safety score object with grade, color, and description.

### getComparisonMetrics(neighborhood: NeighborhoodData, allNeighborhoods: NeighborhoodData[]): ComparisonMetrics
Returns comparison metrics vs LA average and percentile ranking.

### getMetricComparison(value: number, metric: CrimeMetric, allNeighborhoods: NeighborhoodData[])
Returns comparison for a specific crime metric.

### getCrimeTooltip(metric: CrimeMetric, value: number): string
Returns contextual tooltip text explaining what the number means.

## Example Integration

See `/components/ui/SAFETY_INTEGRATION_EXAMPLE.tsx` for a complete working example with:
- Side-by-side neighborhood comparisons
- All metric cards with context
- Safety badges in multiple sizes
- Traffic light indicators
- Code examples

## Data Thresholds

Based on LA crime data analysis:

| Metric | Min | Max | Average |
|--------|-----|-----|---------|
| Violent Crime | 1 | 16 | 6.5 |
| Break-ins | 3 | 19 | 9.5 |
| Car Theft | 3 | 18 | 8.5 |
| Petty Theft | 5 | 28 | 14 |

## Benefits

✅ **Transforms raw numbers into actionable insights**
- Users immediately understand "Grade A" vs "Grade F"
- No need to interpret what "12 violent crimes" means

✅ **Provides meaningful comparisons**
- "20% safer than average" is clear and useful
- Percentile rankings show relative safety

✅ **Color-coded visual feedback**
- Traffic lights and color grades are universally understood
- Quick visual scanning of safety levels

✅ **Contextual tooltips**
- Users learn what each metric means
- Explains frequency and severity

✅ **Weighted by severity**
- Violent crime weighted higher than petty theft
- Reflects real-world impact on safety

## Future Enhancements

Potential improvements:
- Time-based trends (improving/worsening over time)
- Neighborhood clustering (similar safety profiles)
- Custom weight preferences (let users prioritize what matters to them)
- Historical safety score tracking
- Confidence intervals for scores

---

**Before:** "12 violent crimes" - meaningless number
**After:** "Grade A - Very Safe - 85% safer than LA average - Safer than 92% of LA" - actionable insight
