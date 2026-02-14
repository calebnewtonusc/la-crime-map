# Quick Reference Guide

## Import Statement

```tsx
import {
  // localStorage
  useLocalStorage,
  useDebouncedLocalStorage,

  // Crime Stats
  useCrimeStats,
  useCrimeMetric,
  useCrimeTrends,

  // Responsive
  useMediaQuery,
  useBreakpoint,
  useResponsive,
  useDeviceType,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersHighContrast,
  useCustomBreakpoint,
} from '@/lib/hooks'
```

## Common Patterns

### Save User Preferences

```tsx
const [prefs, setPrefs] = useLocalStorage('prefs', {
  metric: 'violentCrime',
  theme: 'light',
})
```

### Get Crime Statistics

```tsx
const { stats, neighborhoods, getSafestNeighborhoods } = useCrimeStats(data)
```

### Responsive Layout

```tsx
const { isMobile, isTablet, isDesktop } = useResponsive()
```

### Check Breakpoint

```tsx
const isMd = useBreakpoint('md') // >= 768px
```

### Search & Filter

```tsx
const { searchNeighborhoods, getNeighborhoodsByMetric } = useCrimeStats(data)
const results = searchNeighborhoods('downtown')
const sorted = getNeighborhoodsByMetric('violentCrime', true)
```

## Cheat Sheet

| Hook | Purpose | Returns |
|------|---------|---------|
| `useLocalStorage` | Persist data in localStorage | `[value, setValue, remove]` |
| `useDebouncedLocalStorage` | Persist with debounce delay | `[value, setValue, remove]` |
| `useCrimeStats` | Manage crime data & stats | Object with stats, neighborhoods, utilities |
| `useCrimeMetric` | Track selected metric | Object with metric state & sorted data |
| `useCrimeTrends` | Analyze crime trends | Trend analysis object |
| `useMediaQuery` | Match media query | `boolean` |
| `useBreakpoint` | Check Tailwind breakpoint | `boolean` |
| `useResponsive` | Full responsive state | Object with breakpoints, dimensions |
| `useDeviceType` | Detect device type | Object with device flags |
| `usePrefersReducedMotion` | Check motion preference | `boolean` |
| `usePrefersDarkMode` | Check dark mode preference | `boolean` |

## Breakpoints

| Name | Min Width |
|------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Type Definitions

```tsx
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft'
type DateRange = '1week' | '1month' | '3months' | '1year'
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

## Common Use Cases

### 1. Save Form State
```tsx
const [filters, setFilters] = useLocalStorage('filters', defaultFilters)
```

### 2. Responsive Navigation
```tsx
const { isMobile } = useResponsive()
return isMobile ? <MobileNav /> : <DesktopNav />
```

### 3. Crime Level Badge
```tsx
const { getCrimeLevel } = useCrimeStats(data)
const level = getCrimeLevel(neighborhood, 'violentCrime') // 'low' | 'medium' | 'high'
```

### 4. Top/Bottom Lists
```tsx
const { getSafestNeighborhoods, getMostDangerousNeighborhoods } = useCrimeStats(data)
const safest = getSafestNeighborhoods(5)
const dangerous = getMostDangerousNeighborhoods(5)
```

### 5. Dark Mode
```tsx
const prefersDark = usePrefersDarkMode()
const [theme, setTheme] = useLocalStorage('theme', prefersDark ? 'dark' : 'light')
```

### 6. Touch Optimized
```tsx
const { isTouch } = useDeviceType()
const buttonSize = isTouch ? 'large' : 'medium'
```

## Performance Tips

1. **Memoize expensive computations:**
   ```tsx
   const sorted = useMemo(() => data.sort(...), [data])
   ```

2. **Use debounced storage for frequently changing values:**
   ```tsx
   const [search, setSearch] = useDebouncedLocalStorage('search', '', 500)
   ```

3. **Filter data early:**
   ```tsx
   useCrimeStats(data, { minDataQuality: 0.7 })
   ```

4. **Memoize callbacks:**
   ```tsx
   const handleClick = useCallback(() => {...}, [deps])
   ```

## Troubleshooting

### Hook returns undefined during SSR
- Set `defaultValue` option in media query hooks
- Set `initializeOnServer: false` in localStorage hooks

### localStorage not syncing across tabs
- Ensure `syncTabs: true` (default)
- Check browser privacy settings

### TypeScript errors
- Import types: `import type { CrimeMetric } from '@/lib/data/types'`
- Use generics: `useLocalStorage<MyType>(...)`

### Performance issues
- Use `useMemo` for expensive computations
- Use `useDebouncedLocalStorage` for frequently changing values
- Filter data with hook options: `minDataQuality`, `requireSufficientData`
