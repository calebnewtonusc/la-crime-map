/**
 * Utility functions barrel export
 * Provides centralized access to all utility modules
 */

// Performance utilities
export { debounce, throttle } from './debounce';

// Color and accessibility utilities
export {
  type CrimeMetric,
  type SeverityLevel,
  type ColorScheme,
  type AccessibleColorResult,
  type AccessibilityOptions,
  accessibilityColorSchemes,
  createPatternDefs,
  getSeverityLevel,
  getAccessibleColor,
  getPatternCSS,
  getSeverityDescription,
} from './accessibility-colors';

export {
  getColorMemoized,
  clearColorCache,
  getColor,
  getColorStops,
  getColorCacheStats,
} from './color-utils';

// Crime statistics utilities
export { calculateCrimeStats } from './crime-stats';

// Safety scoring utilities
export {
  type LetterGrade,
  type SafetyScore,
  type ComparisonMetrics,
  calculateSafetyScore,
  getLetterGrade,
  getSafetyScore,
  getComparisonMetrics,
  getMetricComparison,
  getCrimeTooltip,
} from './safety-scoring';

// Neighborhood data initialization
export { createNeighborhoodData } from './neighborhood-initializer';
