'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * Custom hook for responsive media queries with SSR support
 * Tracks window size changes and matches against media query strings
 */

export type UseMediaQueryOptions = {
  /** Default value during SSR (default: false) */
  defaultValue?: boolean
  /** Initialize during SSR (default: false) */
  initializeWithValue?: boolean
}

/**
 * Hook for matching media queries
 *
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @param options - Configuration options
 * @returns Boolean indicating if the media query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 640px)')
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 * ```
 */
export function useMediaQuery(
  query: string,
  options?: UseMediaQueryOptions
): boolean {
  const { defaultValue = false, initializeWithValue = false } = options || {}

  const isClient = typeof window !== 'undefined'

  // Get initial match state
  const getMatches = useCallback(
    (query: string): boolean => {
      if (!isClient) {
        return initializeWithValue ? defaultValue : defaultValue
      }

      return window.matchMedia(query).matches
    },
    [isClient, initializeWithValue, defaultValue]
  )

  const [matches, setMatches] = useState<boolean>(() => getMatches(query))

  useEffect(() => {
    if (!isClient) return

    const mediaQueryList = window.matchMedia(query)

    // Update state if query changed
    setMatches(mediaQueryList.matches)

    // Modern event listener (MediaQueryList.addEventListener)
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQueryList.addEventListener('change', handleChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query, isClient])

  return matches
}

/**
 * Tailwind CSS breakpoints
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Hook for Tailwind breakpoint detection
 *
 * @param breakpoint - Tailwind breakpoint name
 * @param options - Configuration options
 * @returns Boolean indicating if viewport is at or above the breakpoint
 *
 * @example
 * ```tsx
 * const isMobile = useBreakpoint('md', { defaultValue: false }) // true if < md
 * const isDesktop = useBreakpoint('lg') // true if >= lg
 * ```
 */
export function useBreakpoint(
  breakpoint: Breakpoint,
  options?: UseMediaQueryOptions
): boolean {
  const breakpointValue = breakpoints[breakpoint]
  return useMediaQuery(`(min-width: ${breakpointValue}px)`, options)
}

/**
 * Return type for useResponsive hook
 */
export type UseResponsiveReturn = {
  /** Current breakpoint */
  breakpoint: Breakpoint | null
  /** Is mobile viewport (< md) */
  isMobile: boolean
  /** Is tablet viewport (>= md and < lg) */
  isTablet: boolean
  /** Is desktop viewport (>= lg) */
  isDesktop: boolean
  /** Is small mobile (< sm) */
  isSmall: boolean
  /** Is extra large desktop (>= 2xl) */
  is2XL: boolean
  /** Viewport width */
  width: number
  /** Viewport height */
  height: number
  /** Is portrait orientation */
  isPortrait: boolean
  /** Is landscape orientation */
  isLandscape: boolean
}

/**
 * Comprehensive hook for responsive design
 * Provides current breakpoint and various viewport information
 *
 * @param options - Configuration options
 * @returns Object with responsive state
 *
 * @example
 * ```tsx
 * const { isMobile, isDesktop, breakpoint, width } = useResponsive()
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileNav /> : <DesktopNav />}
 *     <p>Current breakpoint: {breakpoint}</p>
 *     <p>Viewport width: {width}px</p>
 *   </div>
 * )
 * ```
 */
export function useResponsive(
  options?: UseMediaQueryOptions
): UseResponsiveReturn {
  const isClient = typeof window !== 'undefined'

  // Track window dimensions
  const [dimensions, setDimensions] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  })

  // Breakpoint matches
  const isSm = useBreakpoint('sm', options)
  const isMd = useBreakpoint('md', options)
  const isLg = useBreakpoint('lg', options)
  const isXl = useBreakpoint('xl', options)
  const is2Xl = useBreakpoint('2xl', options)

  // Orientation
  const isPortrait = useMediaQuery('(orientation: portrait)', options)
  const isLandscape = useMediaQuery('(orientation: landscape)', options)

  // Determine current breakpoint
  const breakpoint = useMemo((): Breakpoint | null => {
    if (!isClient) return null
    if (is2Xl) return '2xl'
    if (isXl) return 'xl'
    if (isLg) return 'lg'
    if (isMd) return 'md'
    if (isSm) return 'sm'
    return null
  }, [isSm, isMd, isLg, isXl, is2Xl, isClient])

  // Update dimensions on resize
  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Use ResizeObserver if available for better performance
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(document.documentElement)

      return () => {
        resizeObserver.disconnect()
      }
    } else {
      // Fallback to resize event
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isClient])

  return {
    breakpoint,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
    isSmall: !isSm,
    is2XL: is2Xl,
    width: dimensions.width,
    height: dimensions.height,
    isPortrait,
    isLandscape,
  }
}

/**
 * Hook for detecting device type
 *
 * @returns Device type information
 */
export function useDeviceType() {
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)')
  const isMouse = useMediaQuery('(hover: hover) and (pointer: fine)')
  const { isMobile, isTablet, isDesktop } = useResponsive()

  return {
    /** Is touch device (mobile/tablet) */
    isTouch,
    /** Is mouse/pointer device */
    isMouse,
    /** Is mobile phone */
    isMobilePhone: isMobile && isTouch,
    /** Is tablet */
    isTabletDevice: isTablet && isTouch,
    /** Is desktop computer */
    isDesktopDevice: isDesktop && isMouse,
  }
}

/**
 * Hook for prefers-reduced-motion detection
 *
 * @returns Boolean indicating if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Hook for dark mode preference detection
 *
 * @returns Boolean indicating if user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * Hook for high contrast mode detection
 *
 * @returns Boolean indicating if user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)')
}

/**
 * Custom breakpoint hook with min/max width
 *
 * @param minWidth - Minimum width in pixels
 * @param maxWidth - Maximum width in pixels (optional)
 * @returns Boolean indicating if viewport is within range
 */
export function useCustomBreakpoint(
  minWidth?: number,
  maxWidth?: number
): boolean {
  const queries: string[] = []

  if (minWidth !== undefined) {
    queries.push(`(min-width: ${minWidth}px)`)
  }

  if (maxWidth !== undefined) {
    queries.push(`(max-width: ${maxWidth}px)`)
  }

  const query = queries.length > 0 ? queries.join(' and ') : 'all'

  return useMediaQuery(query)
}
