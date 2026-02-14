# Quick Start: Enable Error Handling & Resilience

This guide will help you enable all the new error handling and resilience features in 5 minutes.

## Step 1: Enable Enhanced Components (2 minutes)

### Option A: Rename Files (Recommended)

```bash
cd /Users/joelnewton/Desktop/2026-Code/la-crime-map

# Backup current files
cp src/App.tsx src/App.backup.tsx
cp src/crimeDataService.ts src/crimeDataService.backup.ts

# Enable enhanced versions
mv src/App.enhanced.tsx src/App.tsx
mv src/crimeDataService.enhanced.ts src/crimeDataService.ts
```

### Option B: Update Imports

Modify your imports in the relevant files:

```typescript
// Old
import { fetchCrimeData } from './crimeDataService';

// New
import { fetchCrimeData } from './crimeDataService.enhanced';
```

## Step 2: Verify Installation (1 minute)

All necessary files are already created. Verify they exist:

```bash
# Core utilities
ls src/utils/apiService.ts
ls src/utils/errorLogger.ts
ls src/utils/networkStatus.ts
ls src/utils/healthCheck.ts

# Components
ls src/components/ErrorBoundary.tsx
ls src/components/NetworkStatus.tsx
ls src/components/ErrorDisplay.tsx

# Health endpoint
ls public/health.json
```

## Step 3: Test the Features (2 minutes)

### Test Offline Mode
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Refresh the page
5. ✅ Should show: "You're offline" banner with cached data

### Test Slow Connection
1. Set throttling to "Slow 3G"
2. Refresh the page
3. ✅ Should show: "Slow Connection" indicator and loading states

### Test Error Boundary
1. Open browser console
2. Type: `window.testError = () => { throw new Error('Test') }`
3. Create a component that calls `window.testError()`
4. ✅ Should show: Error boundary UI with recovery options

### Test Health Check
1. Open browser console
2. Type:
```javascript
import('./utils/healthCheck').then(async (h) => {
  const health = await h.healthChecker.runHealthChecks();
  console.log('Health Status:', health);
});
```
3. ✅ Should show: Health check results with all service statuses

## What You Get

### 1. Error Boundaries
- Catches all component crashes
- Shows user-friendly error page
- Provides recovery options

### 2. Network Resilience
- Automatic retry on failures (3 attempts)
- 30-second timeout handling
- Exponential backoff

### 3. Offline Support
- Automatic offline detection
- Falls back to cached data
- Visual offline indicator

### 4. Smart Caching
- Multi-level fallback strategy
- Stale data warnings
- Automatic refresh

### 5. User Feedback
- Loading states for all operations
- Clear error messages
- Actionable recovery buttons

### 6. Developer Tools
- Comprehensive error logging
- Health monitoring
- Error statistics

## Component Usage Examples

### Add Network Status Indicator

```tsx
import NetworkStatus from './components/NetworkStatus';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <NetworkStatus showDetails={true} />
    </header>
  );
}
```

### Show Error Messages

```tsx
import ErrorDisplay from './components/ErrorDisplay';

function MyComponent() {
  const [error, setError] = useState(null);

  return (
    <>
      {error && (
        <ErrorDisplay
          type="error"
          message={error}
          actions={[
            { label: 'Retry', onClick: handleRetry, primary: true },
            { label: 'Dismiss', onClick: () => setError(null) }
          ]}
        />
      )}
    </>
  );
}
```

### Wrap Components with Error Boundary

```tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Use Enhanced API Service

```tsx
import { fetchWithRetry } from './utils/apiService';

async function loadData() {
  try {
    const data = await fetchWithRetry(url, {}, {
      timeout: 30000,
      retries: 3
    });
    return data;
  } catch (error) {
    // Handle error
    console.error('Failed to load data:', error);
  }
}
```

### Log Errors

```tsx
import { logError } from './utils/errorLogger';

try {
  // Your code
} catch (error) {
  logError(error, {
    component: 'MyComponent',
    action: 'loadData'
  }, 'high');
}
```

### Check Network Status

```tsx
import { useNetworkStatus } from './utils/networkStatus';

function MyComponent() {
  const network = useNetworkStatus();

  if (!network.isOnline) {
    return <div>You're offline!</div>;
  }

  return <div>You're online!</div>;
}
```

## Troubleshooting

### Issue: Can't find module errors

**Solution:** Make sure all files are in the correct locations:
```bash
# Check if files exist
ls src/utils/apiService.ts
ls src/components/ErrorBoundary.tsx
```

### Issue: TypeScript errors

**Solution:** The files are already TypeScript-compatible. If you see errors:
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm install
```

### Issue: App not loading

**Solution:** Check browser console for errors and revert to backup:
```bash
# Revert to backup
cp src/App.backup.tsx src/App.tsx
cp src/crimeDataService.backup.ts src/crimeDataService.ts
```

## Configuration

### Adjust Timeouts

Edit `src/utils/apiService.ts`:
```typescript
const DEFAULT_CONFIG: Required<ApiConfig> = {
  timeout: 60000,  // Change to 60 seconds
  retries: 5,      // Change to 5 retries
  retryDelay: 2000, // Change to 2 second base delay
  // ...
};
```

### Adjust Cache Duration

Edit `src/crimeDataService.enhanced.ts`:
```typescript
const CACHE_DURATION = 2 * 60 * 60 * 1000; // Change to 2 hours
```

### Customize Error Messages

Edit `src/components/ErrorDisplay.tsx` to change default messages.

## Next Steps

1. **Monitor Errors:**
   ```javascript
   // In browser console
   import('./utils/errorLogger').then(e => {
     console.log(e.errorLogger.getStats());
   });
   ```

2. **Export Error Logs:**
   ```javascript
   import('./utils/errorLogger').then(e => {
     e.errorLogger.downloadLogs();
   });
   ```

3. **Run Health Checks:**
   ```javascript
   import('./utils/healthCheck').then(async h => {
     const health = await h.healthChecker.getHealthSummary();
     console.log(health);
   });
   ```

4. **Set Up External Logging:**
   - Sign up for Sentry or LogRocket
   - Update `errorLogger.ts` with your API key
   - Errors will automatically be sent to your service

## Full Documentation

For complete documentation, see:
- `ERROR_HANDLING_GUIDE.md` - Comprehensive guide
- `RESILIENCE_IMPLEMENTATION_SUMMARY.md` - Implementation details

## Support

If you encounter issues:
1. Check browser console for errors
2. Review error logs: `errorLogger.getLogs()`
3. Run health check: `healthChecker.runHealthChecks()`
4. Refer to full documentation

---

**That's it!** You now have production-ready error handling and resilience. 🚀

All features are enabled and ready to use. Test them out and enjoy a more reliable application!
