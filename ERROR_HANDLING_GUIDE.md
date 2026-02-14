# Error Handling & Resilience Guide

This document describes the comprehensive error handling and resilience features implemented in the LA Crime Map application.

## Table of Contents

1. [Overview](#overview)
2. [Features Implemented](#features-implemented)
3. [Architecture](#architecture)
4. [Usage Guide](#usage-guide)
5. [Testing](#testing)
6. [Monitoring & Debugging](#monitoring--debugging)

## Overview

The LA Crime Map now includes production-ready error handling and resilience features to ensure a reliable user experience even when things go wrong. The application gracefully handles:

- Network failures
- API timeouts
- Slow connections
- Offline mode
- Cache failures
- Component crashes
- Unexpected errors

## Features Implemented

### 1. React Error Boundaries ✅

**Location:** `/src/components/ErrorBoundary.tsx`

Error Boundaries catch JavaScript errors in the component tree and display a fallback UI instead of crashing the entire application.

**Features:**
- Catches and logs all component errors
- Provides user-friendly error messages
- Offers multiple recovery options (Try Again, Reload, Go Home)
- Shows technical details for debugging
- Tracks error count to detect recurring issues

**Usage:**
```tsx
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. Retry Logic for Failed API Calls ✅

**Location:** `/src/utils/apiService.ts`

Enhanced API service with automatic retry logic, exponential backoff, and timeout handling.

**Features:**
- Automatic retry with exponential backoff
- Configurable timeout (default: 30 seconds)
- Configurable retry attempts (default: 3)
- Retries on specific HTTP status codes (408, 429, 500-504)
- Jitter to prevent thundering herd

**Usage:**
```typescript
import { fetchWithRetry } from './utils/apiService';

const data = await fetchWithRetry(url, {}, {
  timeout: 30000,
  retries: 3,
  onRetry: (attempt, error) => {
    console.log(`Retry attempt ${attempt}`);
  }
});
```

### 3. Loading States for All Async Operations ✅

**Location:** Throughout the application

All async operations now have proper loading states:
- Main data fetching: Shows skeleton loader
- Map loading: Lazy-loaded with Suspense fallback
- Analytics loading: Dedicated loading spinner

### 4. Timeout Handling ✅

**Location:** `/src/utils/apiService.ts`

All API requests have configurable timeouts:
- Default: 30 seconds
- Uses AbortController for clean cancellation
- Provides clear timeout error messages

### 5. Fallback to Cached Data ✅

**Location:** `/src/crimeDataService.enhanced.ts`, `/src/utils/cacheService.ts`

Multi-level fallback strategy:

1. **Fresh Cache** - Use if available and not expired
2. **API** - Try to fetch new data
3. **Stale Cache** - Use expired cache if API fails
4. **Mock Data** - Use sample data as last resort

**Cache Enhancement:**
```typescript
// Get data with metadata
const cached = cache.getWithMetadata(key);
if (cached) {
  console.log('Age:', cached.metadata.age);
  console.log('Is stale:', cached.metadata.isStale);
}

// Get stale data (even if expired)
const stale = cache.getStale(key);
```

### 6. "Data May Be Stale" Warnings ✅

**Location:** `/src/components/ErrorDisplay.tsx`

Visual indicators when displaying cached or outdated data:

```tsx
<StaleDataWarning
  message="Data may be outdated. You are viewing cached information."
  onRefresh={handleRefresh}
/>
```

### 7. Offline Mode with Last Known Data ✅

**Location:** `/src/utils/networkStatus.ts`, `/src/crimeDataService.enhanced.ts`

The app detects offline status and automatically:
- Shows cached data
- Displays offline warning banner
- Disables features requiring network
- Queues data updates for when online

### 8. Network Status Indicator ✅

**Location:** `/src/components/NetworkStatus.tsx`

Real-time network status monitoring:

**Features:**
- Shows current connection status (Online, Slow, Offline)
- Animated dot indicator
- Toast notifications on status change
- Connection quality detection (2G, 3G, 4G)
- Round-trip time (RTT) monitoring

**Usage:**
```tsx
import NetworkStatus from './components/NetworkStatus';

<NetworkStatus showDetails={true} />
```

### 9. Helpful Error Messages ✅

**Location:** `/src/components/ErrorDisplay.tsx`

User-friendly error messages that:
- Explain what went wrong in plain language
- Avoid technical jargon in main message
- Provide technical details in expandable section
- Suggest next steps

**Types:**
- **Error** (red) - Critical failures
- **Warning** (orange) - Degraded functionality
- **Info** (blue) - Informational messages

### 10. User Actions for Every Error ✅

All error displays include actionable buttons:
- **Retry** - Try the operation again
- **Refresh** - Reload the page
- **Dismiss** - Close the error message
- **Go Home** - Navigate to safe state
- **Report Issue** - Link to GitHub issues

**Example:**
```tsx
<ErrorDisplay
  type="error"
  message="Failed to load data"
  actions={[
    { label: 'Retry', onClick: handleRetry, primary: true },
    { label: 'Use Cached Data', onClick: useCached },
    { label: 'Dismiss', onClick: onDismiss }
  ]}
/>
```

### 11. Error Logging for Debugging ✅

**Location:** `/src/utils/errorLogger.ts`

Comprehensive error logging system:

**Features:**
- Centralized error logging
- Severity levels (low, medium, high, critical)
- Persistent storage in localStorage
- Error statistics and analytics
- Export logs as JSON
- Ready for integration with external services (Sentry, LogRocket)

**Usage:**
```typescript
import { logError, logHighError } from './utils/errorLogger';

// Log with severity
logHighError('API request failed', {
  url,
  status: 500,
  timestamp: new Date()
});

// Get error statistics
const stats = errorLogger.getStats();
console.log('Total errors:', stats.total);
console.log('Last 24h:', stats.last24Hours);

// Export logs
errorLogger.downloadLogs();
```

### 12. Health Check Endpoint ✅

**Location:** `/public/health.json`, `/src/utils/healthCheck.ts`

Comprehensive health monitoring:

**Checks:**
- Network connectivity
- LocalStorage availability
- IndexedDB availability
- App health endpoint
- LA Crime Data API
- Map tile service

**Usage:**
```typescript
import { healthChecker } from './utils/healthCheck';

const health = await healthChecker.runHealthChecks();
console.log('Overall status:', health.overall); // 'healthy' | 'degraded' | 'unhealthy'

health.checks.forEach(check => {
  console.log(`${check.name}: ${check.status}`);
});
```

## Architecture

### Error Handling Flow

```
User Action
    ↓
Component (with Error Boundary)
    ↓
API Service (with retry & timeout)
    ↓
Network Check → Online?
    ↓           ↓
   Yes         No → Use Stale Cache → Available? → Yes → Return Data
    ↓                                     ↓
API Request                              No
    ↓                                     ↓
Success? → Yes → Cache → Return          Mock Data
    ↓
   No
    ↓
Retry (3x with backoff)
    ↓
Still Failed?
    ↓
Check Stale Cache → Available? → Yes → Return with Warning
    ↓
   No
    ↓
Return Mock Data + Error Message
```

### Component Hierarchy

```
index.tsx (Root Error Boundary)
    ↓
AppWrapper
    ↓
App (Enhanced Error Handling)
    ↓
├── NetworkStatus (Real-time network monitoring)
├── ErrorDisplay (User-friendly errors)
├── StaleDataWarning (Cache notifications)
└── Error Boundary (Map & Analytics)
        ↓
        └── Child Components
```

## Usage Guide

### Integrating Error Handling in New Components

1. **Wrap with Error Boundary:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

2. **Use Enhanced API Service:**
```tsx
import { fetchWithRetry } from './utils/apiService';

try {
  const data = await fetchWithRetry(url, {}, {
    timeout: 30000,
    retries: 3
  });
} catch (error) {
  // Handle error with fallback
}
```

3. **Show Loading States:**
```tsx
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorDisplay message={error} onRetry={retry} />
) : (
  <YourContent />
)}
```

4. **Log Errors:**
```tsx
import { logError } from './utils/errorLogger';

catch (error) {
  logError(error, { component: 'YourComponent' }, 'high');
}
```

### Migration from Old App to Enhanced App

To use the new error handling:

1. **Replace imports in `index.tsx`:**
```tsx
// Old
import App from './App';

// New
import App from './App.enhanced';
```

2. **Or rename files:**
```bash
mv src/App.tsx src/App.backup.tsx
mv src/App.enhanced.tsx src/App.tsx
```

3. **Update crimeDataService:**
```tsx
// Old
import { fetchCrimeData } from './crimeDataService';

// New
import { fetchCrimeData } from './crimeDataService.enhanced';
```

## Testing

### Test Error Scenarios

1. **Test Network Errors:**
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Reload the app
   - Verify offline mode activates

2. **Test Slow Network:**
   - Set throttling to "Slow 3G"
   - Verify slow connection warning
   - Check loading states

3. **Test API Failures:**
   - Block LA Crime Data API in DevTools
   - Verify fallback to cached data
   - Check error messages

4. **Test Component Errors:**
   - Throw error in component
   - Verify Error Boundary catches it
   - Test recovery actions

5. **Test Cache:**
   - Load app with internet
   - Go offline
   - Reload
   - Verify cached data loads

### Manual Testing Checklist

- [ ] App loads without errors
- [ ] Network status indicator shows correct status
- [ ] Offline mode displays cached data
- [ ] Error boundaries catch component errors
- [ ] API retries work correctly
- [ ] Loading states display properly
- [ ] Stale data warnings appear when appropriate
- [ ] All error messages are user-friendly
- [ ] All errors have actionable buttons
- [ ] Error logs are being saved
- [ ] Health checks report correct status

## Monitoring & Debugging

### View Error Logs

```typescript
import { errorLogger } from './utils/errorLogger';

// Get all logs
const logs = errorLogger.getLogs();

// Get statistics
const stats = errorLogger.getStats();

// Download logs
errorLogger.downloadLogs();

// Clear logs
errorLogger.clearLogs();
```

### Run Health Checks

```typescript
import { healthChecker } from './utils/healthCheck';

// Full health check
const health = await healthChecker.getHealthSummary();
console.log(health.message);

// Quick check
import { quickHealthCheck } from './utils/healthCheck';
const isHealthy = await quickHealthCheck();
```

### Monitor Network Status

```typescript
import { useNetworkStatus } from './utils/networkStatus';

function MyComponent() {
  const networkInfo = useNetworkStatus();

  console.log('Online:', networkInfo.isOnline);
  console.log('Status:', networkInfo.status);
  console.log('Connection:', networkInfo.effectiveType);
  console.log('RTT:', networkInfo.rtt);
}
```

### Integration with External Services

To integrate with Sentry, LogRocket, or similar:

**1. Update errorLogger.ts:**
```typescript
private async sendToLoggingService(errorLog: ErrorLog): Promise<void> {
  // Sentry example
  Sentry.captureException(new Error(errorLog.message), {
    level: errorLog.severity,
    extra: errorLog.context
  });
}
```

**2. Update Error Boundary:**
```typescript
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Send to Sentry
  Sentry.captureException(error, {
    contexts: {
      react: { componentStack: errorInfo.componentStack }
    }
  });
}
```

## Best Practices

1. **Always use Error Boundaries** around lazy-loaded components
2. **Log errors with appropriate severity** - don't over-log
3. **Provide fallback data** when API fails
4. **Show user-friendly messages** - hide technical details by default
5. **Make errors actionable** - always provide a way forward
6. **Test offline scenarios** regularly
7. **Monitor error logs** in production
8. **Keep cache duration reasonable** (1 hour default)
9. **Use health checks** before critical operations
10. **Update stale data** in the background when possible

## Production Deployment

Before deploying to production:

1. **Review all error messages** for user-friendliness
2. **Set up external error tracking** (Sentry/LogRocket)
3. **Configure appropriate cache durations**
4. **Test all error scenarios**
5. **Monitor error rates** after deployment
6. **Set up alerts** for high error rates
7. **Document error handling** for your team
8. **Review and clean error logs** periodically

## Support

For issues or questions about error handling:

1. Check error logs: `errorLogger.downloadLogs()`
2. Run health check: `healthChecker.getHealthSummary()`
3. Review this guide
4. Open an issue on GitHub

---

**Last Updated:** 2026-02-14

**Version:** 1.0.0

**Status:** Production Ready ✅
