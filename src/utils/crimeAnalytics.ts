// Crime Analytics Utilities
// Provides statistically meaningful analysis of crime data

import { getPopulation, getDataConfidence } from './populationData';

export interface CrimeStats {
  violentCrime: number;
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
}

export interface EnhancedCrimeData {
  // Raw counts (per week)
  violentCrime: number;
  carTheft: number;
  breakIns: number;
  pettyTheft: number;

  // Per capita rates (per 1000 residents per year)
  violentCrimePerCapita: number | null;
  carTheftPerCapita: number | null;
  breakInsPerCapita: number | null;
  pettyTheftPerCapita: number | null;
  totalCrimePerCapita: number | null;

  // Percentile rankings (0-100)
  violentCrimePercentile: number | null;
  carTheftPercentile: number | null;
  breakInsPercentile: number | null;
  pettyTheftPercentile: number | null;
  overallSafetyPercentile: number | null; // Higher = safer

  // Safety score (0-100, higher is safer)
  safetyScore: number | null;

  // Trend indicators
  trendIndicator: 'increasing' | 'stable' | 'decreasing' | 'insufficient_data';
  trendConfidence: number; // 0-1

  // Data quality metrics
  dataQualityScore: number; // 0-100
  hasSufficientData: boolean;
  populationDataAvailable: boolean;
  lastUpdated: Date;

  // Comparison to county average
  vsCountyAverage: {
    violentCrime: number; // multiplier (e.g., 1.5 = 50% higher than average)
    carTheft: number;
    breakIns: number;
    pettyTheft: number;
    overall: number;
  } | null;

  // Confidence intervals (95% CI for rates)
  confidenceIntervals: {
    violentCrimeLower: number | null;
    violentCrimeUpper: number | null;
    totalCrimeLower: number | null;
    totalCrimeUpper: number | null;
  } | null;
}

/**
 * Calculate per capita crime rate (per 1000 residents per year)
 * @param weeklyCount - Number of crimes per week
 * @param population - Total population
 * @returns Rate per 1000 residents per year
 */
export function calculatePerCapitaRate(weeklyCount: number, population: number | null): number | null {
  if (!population || population === 0) return null;

  // Convert weekly to annual rate per 1000 residents
  const annualCount = weeklyCount * 52; // 52 weeks per year
  return (annualCount / population) * 1000;
}

/**
 * Calculate percentile ranking for a value in a dataset
 * @param value - The value to rank
 * @param allValues - All values in the dataset
 * @returns Percentile (0-100)
 */
export function calculatePercentile(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 50;

  const sorted = [...allValues].sort((a, b) => a - b);
  const smallerCount = sorted.filter(v => v < value).length;

  return Math.round((smallerCount / allValues.length) * 100);
}

/**
 * Calculate safety score based on weighted crime metrics
 * Lower crime = higher score (0-100)
 */
export function calculateSafetyScore(
  crimeStats: CrimeStats,
  population: number | null,
  countyAverages: CrimeStats
): number | null {
  if (!population) return null;

  // Weights for different crime types (higher weight = more important)
  const weights = {
    violentCrime: 4.0, // Most important
    carTheft: 1.5,
    breakIns: 2.0,
    pettyTheft: 1.0, // Least important
  };

  // Calculate per capita rates
  const rates = {
    violentCrime: calculatePerCapitaRate(crimeStats.violentCrime, population) || 0,
    carTheft: calculatePerCapitaRate(crimeStats.carTheft, population) || 0,
    breakIns: calculatePerCapitaRate(crimeStats.breakIns, population) || 0,
    pettyTheft: calculatePerCapitaRate(crimeStats.pettyTheft, population) || 0,
  };

  // Calculate county average rates (using median population as baseline)
  const medianPop = 50000; // Approximate median LA neighborhood population
  const avgRates = {
    violentCrime: calculatePerCapitaRate(countyAverages.violentCrime, medianPop) || 0,
    carTheft: calculatePerCapitaRate(countyAverages.carTheft, medianPop) || 0,
    breakIns: calculatePerCapitaRate(countyAverages.breakIns, medianPop) || 0,
    pettyTheft: calculatePerCapitaRate(countyAverages.pettyTheft, medianPop) || 0,
  };

  // Calculate weighted score components (inverted so lower crime = higher score)
  let totalScore = 0;
  let totalWeight = 0;

  Object.keys(weights).forEach(key => {
    const crimeType = key as keyof CrimeStats;
    const weight = weights[crimeType];
    const rate = rates[crimeType];
    const avgRate = avgRates[crimeType];

    // Score: 100 if no crime, decreases based on ratio to average
    // Using logarithmic scale to handle wide variation in crime rates
    const ratio = avgRate > 0 ? rate / avgRate : 0;
    const componentScore = Math.max(0, 100 - (ratio * 50));

    totalScore += componentScore * weight;
    totalWeight += weight;
  });

  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 50;
  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

/**
 * Calculate confidence intervals using Poisson distribution approximation
 * For rare events, uses normal approximation with continuity correction
 */
export function calculateConfidenceInterval(
  weeklyCount: number,
  population: number | null,
  confidenceLevel: number = 0.95
): { lower: number | null; upper: number | null } {
  if (!population || weeklyCount === 0) {
    return { lower: null, upper: null };
  }

  // Annual count for more stable estimates
  const annualCount = weeklyCount * 52;

  // Z-score for 95% confidence
  const z = 1.96;

  // Normal approximation for Poisson (works well for count > 10)
  const mean = annualCount;
  const stdDev = Math.sqrt(annualCount);

  const lowerCount = Math.max(0, mean - z * stdDev);
  const upperCount = mean + z * stdDev;

  // Convert to per capita rates
  const lower = (lowerCount / population) * 1000;
  const upper = (upperCount / population) * 1000;

  return {
    lower: Math.round(lower * 10) / 10,
    upper: Math.round(upper * 10) / 10
  };
}

/**
 * Calculate data quality score based on completeness and recency
 */
export function calculateDataQualityScore(
  neighborhood: string,
  crimeStats: CrimeStats,
  lastUpdated: Date
): number {
  let score = 100;

  // Population data availability (30 points)
  const hasPopulation = getPopulation(neighborhood) !== null;
  if (!hasPopulation) score -= 30;

  // Data confidence from population source (20 points)
  const confidence = getDataConfidence(neighborhood);
  if (confidence === 'medium') score -= 10;
  else if (confidence === 'low') score -= 15;
  else if (confidence === 'unknown') score -= 20;

  // Data recency (30 points)
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate > 30) score -= 30; // More than a month old
  else if (daysSinceUpdate > 14) score -= 20; // More than 2 weeks
  else if (daysSinceUpdate > 7) score -= 10; // More than a week

  // Data completeness (20 points) - check if there's any crime data
  const totalCrime = crimeStats.violentCrime + crimeStats.carTheft +
                     crimeStats.breakIns + crimeStats.pettyTheft;

  if (totalCrime === 0) score -= 20; // Likely incomplete data
  else if (totalCrime < 3) score -= 10; // Suspiciously low

  return Math.max(0, Math.min(100, score));
}

/**
 * Determine if a neighborhood has sufficient data for reliable analysis
 */
export function hasSufficientData(
  crimeStats: CrimeStats,
  population: number | null,
  dataQualityScore: number
): boolean {
  // Needs population data
  if (!population) return false;

  // Needs reasonable data quality
  if (dataQualityScore < 50) return false;

  // Needs at least some crime data (or very low crime is plausible)
  const totalCrime = crimeStats.violentCrime + crimeStats.carTheft +
                     crimeStats.breakIns + crimeStats.pettyTheft;

  // Very safe areas might have 0-5 crimes/week, but 0 across all categories is suspicious
  if (totalCrime === 0) return false;

  return true;
}

/**
 * Calculate comparison to county average
 */
export function calculateVsCountyAverage(
  crimeStats: CrimeStats,
  countyAverages: CrimeStats
): {
  violentCrime: number;
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
  overall: number;
} {
  const calculateRatio = (value: number, average: number): number => {
    if (average === 0) return value > 0 ? 999 : 1; // Handle division by zero
    return Math.round((value / average) * 100) / 100;
  };

  const totalCrime = crimeStats.violentCrime + crimeStats.carTheft +
                     crimeStats.breakIns + crimeStats.pettyTheft;
  const totalAvg = countyAverages.violentCrime + countyAverages.carTheft +
                   countyAverages.breakIns + countyAverages.pettyTheft;

  return {
    violentCrime: calculateRatio(crimeStats.violentCrime, countyAverages.violentCrime),
    carTheft: calculateRatio(crimeStats.carTheft, countyAverages.carTheft),
    breakIns: calculateRatio(crimeStats.breakIns, countyAverages.breakIns),
    pettyTheft: calculateRatio(crimeStats.pettyTheft, countyAverages.pettyTheft),
    overall: calculateRatio(totalCrime, totalAvg),
  };
}

/**
 * Calculate trend indicator based on historical data
 * Note: This is a placeholder for when historical data is available
 */
export function calculateTrend(
  currentRate: number,
  historicalRates: number[]
): { indicator: 'increasing' | 'stable' | 'decreasing' | 'insufficient_data'; confidence: number } {
  if (historicalRates.length < 3) {
    return { indicator: 'insufficient_data', confidence: 0 };
  }

  // Simple linear regression
  const n = historicalRates.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const meanX = indices.reduce((a, b) => a + b, 0) / n;
  const meanY = historicalRates.reduce((a, b) => a + b, 0) / n;

  const numerator = indices.reduce((sum, x, i) => sum + (x - meanX) * (historicalRates[i] - meanY), 0);
  const denominator = indices.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);

  const slope = denominator !== 0 ? numerator / denominator : 0;

  // Calculate R-squared for confidence
  const yPredicted = indices.map(x => meanY + slope * (x - meanX));
  const ssRes = historicalRates.reduce((sum, y, i) => sum + Math.pow(y - yPredicted[i], 2), 0);
  const ssTot = historicalRates.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
  const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

  // Determine trend based on slope (as percentage of mean)
  const relativeSlope = meanY !== 0 ? (slope / meanY) * 100 : 0;

  let indicator: 'increasing' | 'stable' | 'decreasing';
  if (relativeSlope > 5) indicator = 'increasing'; // More than 5% increase per period
  else if (relativeSlope < -5) indicator = 'decreasing'; // More than 5% decrease per period
  else indicator = 'stable';

  return {
    indicator,
    confidence: Math.max(0, Math.min(1, Math.abs(rSquared)))
  };
}

/**
 * Enhanced crime analytics for a neighborhood
 */
export function enhanceCrimeData(
  neighborhood: string,
  crimeStats: CrimeStats,
  allNeighborhoodStats: Array<{ name: string; stats: CrimeStats }>,
  countyAverages: CrimeStats,
  lastUpdated: Date = new Date()
): EnhancedCrimeData {
  const population = getPopulation(neighborhood);

  // Calculate per capita rates
  const violentCrimePerCapita = calculatePerCapitaRate(crimeStats.violentCrime, population);
  const carTheftPerCapita = calculatePerCapitaRate(crimeStats.carTheft, population);
  const breakInsPerCapita = calculatePerCapitaRate(crimeStats.breakIns, population);
  const pettyTheftPerCapita = calculatePerCapitaRate(crimeStats.pettyTheft, population);

  const totalCrime = crimeStats.violentCrime + crimeStats.carTheft +
                     crimeStats.breakIns + crimeStats.pettyTheft;
  const totalCrimePerCapita = calculatePerCapitaRate(totalCrime, population);

  // Calculate percentiles (only if we have population data)
  let violentCrimePercentile = null;
  let carTheftPercentile = null;
  let breakInsPercentile = null;
  let pettyTheftPercentile = null;
  let overallSafetyPercentile = null;

  if (population) {
    // Filter to only neighborhoods with population data for fair comparison
    const comparableNeighborhoods = allNeighborhoodStats.filter(n =>
      getPopulation(n.name) !== null
    );

    const violentRates = comparableNeighborhoods
      .map(n => calculatePerCapitaRate(n.stats.violentCrime, getPopulation(n.name)) || 0)
      .filter(r => r !== null);
    const carTheftRates = comparableNeighborhoods
      .map(n => calculatePerCapitaRate(n.stats.carTheft, getPopulation(n.name)) || 0)
      .filter(r => r !== null);
    const breakInsRates = comparableNeighborhoods
      .map(n => calculatePerCapitaRate(n.stats.breakIns, getPopulation(n.name)) || 0)
      .filter(r => r !== null);
    const pettyTheftRates = comparableNeighborhoods
      .map(n => calculatePerCapitaRate(n.stats.pettyTheft, getPopulation(n.name)) || 0)
      .filter(r => r !== null);
    const totalRates = comparableNeighborhoods
      .map(n => {
        const total = n.stats.violentCrime + n.stats.carTheft + n.stats.breakIns + n.stats.pettyTheft;
        return calculatePerCapitaRate(total, getPopulation(n.name)) || 0;
      })
      .filter(r => r !== null);

    violentCrimePercentile = violentCrimePerCapita !== null
      ? calculatePercentile(violentCrimePerCapita, violentRates)
      : null;
    carTheftPercentile = carTheftPerCapita !== null
      ? calculatePercentile(carTheftPerCapita, carTheftRates)
      : null;
    breakInsPercentile = breakInsPerCapita !== null
      ? calculatePercentile(breakInsPerCapita, breakInsRates)
      : null;
    pettyTheftPercentile = pettyTheftPerCapita !== null
      ? calculatePercentile(pettyTheftPerCapita, pettyTheftRates)
      : null;

    // Overall safety percentile (inverted - lower crime = higher percentile)
    overallSafetyPercentile = totalCrimePerCapita !== null
      ? 100 - calculatePercentile(totalCrimePerCapita, totalRates)
      : null;
  }

  // Calculate safety score
  const safetyScore = calculateSafetyScore(crimeStats, population, countyAverages);

  // Calculate data quality
  const dataQualityScore = calculateDataQualityScore(neighborhood, crimeStats, lastUpdated);

  // Determine if data is sufficient
  const sufficient = hasSufficientData(crimeStats, population, dataQualityScore);

  // Calculate comparison to county average
  const vsCountyAverage = calculateVsCountyAverage(crimeStats, countyAverages);

  // Calculate confidence intervals
  const violentCI = calculateConfidenceInterval(crimeStats.violentCrime, population);
  const totalCI = calculateConfidenceInterval(totalCrime, population);

  const confidenceIntervals = population ? {
    violentCrimeLower: violentCI.lower,
    violentCrimeUpper: violentCI.upper,
    totalCrimeLower: totalCI.lower,
    totalCrimeUpper: totalCI.upper,
  } : null;

  // Trend indicator (placeholder - would need historical data)
  const trendIndicator = 'insufficient_data' as const;
  const trendConfidence = 0;

  return {
    // Raw counts
    ...crimeStats,

    // Per capita rates
    violentCrimePerCapita,
    carTheftPerCapita,
    breakInsPerCapita,
    pettyTheftPerCapita,
    totalCrimePerCapita,

    // Percentiles
    violentCrimePercentile,
    carTheftPercentile,
    breakInsPercentile,
    pettyTheftPercentile,
    overallSafetyPercentile,

    // Safety score
    safetyScore,

    // Trend
    trendIndicator,
    trendConfidence,

    // Data quality
    dataQualityScore,
    hasSufficientData: sufficient,
    populationDataAvailable: population !== null,
    lastUpdated,

    // Comparisons
    vsCountyAverage,
    confidenceIntervals,
  };
}

/**
 * Calculate county-wide averages
 */
export function calculateCountyAverages(
  allNeighborhoodStats: Array<{ name: string; stats: CrimeStats }>
): CrimeStats {
  if (allNeighborhoodStats.length === 0) {
    return { violentCrime: 0, carTheft: 0, breakIns: 0, pettyTheft: 0 };
  }

  const totals = allNeighborhoodStats.reduce(
    (acc, n) => ({
      violentCrime: acc.violentCrime + n.stats.violentCrime,
      carTheft: acc.carTheft + n.stats.carTheft,
      breakIns: acc.breakIns + n.stats.breakIns,
      pettyTheft: acc.pettyTheft + n.stats.pettyTheft,
    }),
    { violentCrime: 0, carTheft: 0, breakIns: 0, pettyTheft: 0 }
  );

  const count = allNeighborhoodStats.length;

  return {
    violentCrime: Math.round(totals.violentCrime / count),
    carTheft: Math.round(totals.carTheft / count),
    breakIns: Math.round(totals.breakIns / count),
    pettyTheft: Math.round(totals.pettyTheft / count),
  };
}
