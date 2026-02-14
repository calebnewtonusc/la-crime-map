/**
 * Color utilities with memoization for performance
 * Provides colorblind-safe palette and efficient color caching
 */

import { CrimeMetric } from './accessibility-colors';

/**
 * Memoized color calculation cache
 */
const colorCache = new Map<string, string>();

/**
 * Colorblind-safe color palette thresholds for different crime metrics
 */
const COLOR_THRESHOLDS: Record<CrimeMetric, number[]> = {
  violentCrime: [2, 5, 10, 15],
  carTheft: [5, 10, 15, 20],
  breakIns: [5, 10, 15, 20],
  pettyTheft: [10, 20, 30, 40],
};

/**
 * Colorblind-safe color palette (blue to amber to red-purple)
 * Based on ColorBrewer sequential schemes
 */
const COLOR_PALETTE = {
  veryLow: '#4575b4', // Deep blue
  low: '#74add1', // Light blue
  moderate: '#fee090', // Light amber
  high: '#f46d43', // Coral
  veryHigh: '#d73027', // Red-purple
} as const;

/**
 * Get color for a crime value with memoization for performance
 *
 * @param value The crime statistic value
 * @param metric The type of crime metric
 * @returns Hex color code
 *
 * @example
 * ```ts
 * const color = getColorMemoized(12, 'violentCrime');
 * // Returns '#fee090' (moderate severity)
 * ```
 */
export function getColorMemoized(value: number, metric: CrimeMetric): string {
  const key = `${metric}-${value}`;

  if (colorCache.has(key)) {
    return colorCache.get(key)!;
  }

  const thresholds = COLOR_THRESHOLDS[metric];
  let color: string;

  if (value < thresholds[0]) {
    color = COLOR_PALETTE.veryLow;
  } else if (value < thresholds[1]) {
    color = COLOR_PALETTE.low;
  } else if (value < thresholds[2]) {
    color = COLOR_PALETTE.moderate;
  } else if (value < thresholds[3]) {
    color = COLOR_PALETTE.high;
  } else {
    color = COLOR_PALETTE.veryHigh;
  }

  colorCache.set(key, color);
  return color;
}

/**
 * Clear the color cache (useful when switching themes or metrics)
 */
export function clearColorCache(): void {
  colorCache.clear();
}

/**
 * Get color without memoization (for one-time use)
 */
export function getColor(value: number, metric: CrimeMetric): string {
  const thresholds = COLOR_THRESHOLDS[metric];

  if (value < thresholds[0]) return COLOR_PALETTE.veryLow;
  if (value < thresholds[1]) return COLOR_PALETTE.low;
  if (value < thresholds[2]) return COLOR_PALETTE.moderate;
  if (value < thresholds[3]) return COLOR_PALETTE.high;
  return COLOR_PALETTE.veryHigh;
}

/**
 * Get all color stops for a metric (useful for legends)
 */
export function getColorStops(metric: CrimeMetric): Array<{ value: number; color: string }> {
  const thresholds = COLOR_THRESHOLDS[metric];
  return [
    { value: 0, color: COLOR_PALETTE.veryLow },
    { value: thresholds[0], color: COLOR_PALETTE.low },
    { value: thresholds[1], color: COLOR_PALETTE.moderate },
    { value: thresholds[2], color: COLOR_PALETTE.high },
    { value: thresholds[3], color: COLOR_PALETTE.veryHigh },
  ];
}

/**
 * Get cache statistics (for debugging/monitoring)
 */
export function getColorCacheStats(): { size: number; entries: string[] } {
  return {
    size: colorCache.size,
    entries: Array.from(colorCache.keys()),
  };
}
