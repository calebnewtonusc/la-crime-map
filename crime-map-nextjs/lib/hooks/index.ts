/**
 * Custom React hooks for LA Crime Map
 *
 * @module lib/hooks
 */

// Local Storage hooks
export {
  useLocalStorage,
  useDebouncedLocalStorage,
  type UseLocalStorageOptions,
  type SetValue,
} from './useLocalStorage'

// Crime Statistics hooks
export {
  useCrimeStats,
  useCrimeMetric,
  useCrimeTrends,
  type UseCrimeStatsOptions,
  type UseCrimeStatsReturn,
} from './useCrimeStats'

// Media Query & Responsive hooks
export {
  useMediaQuery,
  useBreakpoint,
  useResponsive,
  useDeviceType,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersHighContrast,
  useCustomBreakpoint,
  breakpoints,
  type Breakpoint,
  type UseMediaQueryOptions,
  type UseResponsiveReturn,
} from './useMediaQuery'
