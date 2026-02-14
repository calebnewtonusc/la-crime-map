# Error Handling & Resilience Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Application                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          Root Error Boundary (index.tsx)                  │  │
│  │  • Catches all unhandled errors                          │  │
│  │  • Logs critical errors                                  │  │
│  │  • Shows fallback UI                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                │                                 │
│                                ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              App Component (App.enhanced.tsx)             │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │         Network Status Monitor                      │ │  │
│  │  │  • Real-time online/offline detection             │ │  │
│  │  │  • Connection quality monitoring                  │ │  │
│  │  │  • Visual status indicator                        │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │         Error Display System                        │ │  │
│  │  │  • User-friendly messages                          │ │  │
│  │  │  • Action buttons (Retry, Refresh, etc)           │ │  │
│  │  │  • Stale data warnings                            │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │    Child Components (Error Boundary Wrapped)        │ │  │
│  │  │  • Map Component                                   │ │  │
│  │  │  • Analytics Dashboard                             │ │  │
│  │  │  • Stats Panel                                     │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │        Crime Data Service (crimeDataService.enhanced)     │  │
│  │                                                            │  │
│  │  Fallback Strategy:                                       │  │
│  │  1. Check Fresh Cache ──> Available? ──> Return Data     │  │
│  │         │                      │                          │  │
│  │         No                    Yes                         │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  2. Check Network ──> Offline? ──> Use Stale Cache       │  │
│  │         │                  │            │                │  │
│  │       Online              Yes          No                │  │
│  │         │                  │            │                │  │
│  │         ▼                  │            ▼                │  │
│  │  3. API Request            │       Mock Data             │  │
│  │         │                  │                             │  │
│  │      Success               │                             │  │
│  │         │                  │                             │  │
│  │         ▼                  │                             │  │
│  │  4. Cache & Return ────────┴─────────────────────────────│  │
│  │         │                                                │  │
│  │       Failed                                             │  │
│  │         │                                                │  │
│  │         ▼                                                │  │
│  │  5. Use Stale Cache ──> Available? ──> Return with Warn │  │
│  │         │                      │                         │  │
│  │         No                    Yes                        │  │
│  │         │                                                │  │
│  │         ▼                                                │  │
│  │  6. Return Mock Data                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Service Layer                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          Enhanced API Service (apiService.ts)             │  │
│  │                                                            │  │
│  │  Request Flow:                                            │  │
│  │  1. Create Request                                        │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  2. Set Timeout (30s) ──> AbortController                │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  3. Send Request                                          │  │
│  │         │                                                 │  │
│  │      Success? ──> Yes ──> Return Data                    │  │
│  │         │                                                 │  │
│  │         No                                                │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  4. Check Retryable? ──> No ──> Throw Error              │  │
│  │         │                                                 │  │
│  │        Yes                                                │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  5. Wait (Exponential Backoff + Jitter)                  │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  6. Retry (Max 3 attempts) ──> Back to Step 3            │  │
│  │         │                                                 │  │
│  │    All Failed                                             │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  7. Throw Error with Context                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Storage & Monitoring                          │
│  ┌────────────────────┬──────────────────┬───────────────────┐  │
│  │   Cache Service    │   Error Logger   │  Health Monitor   │  │
│  │  (cacheService.ts) │ (errorLogger.ts) │(healthCheck.ts)   │  │
│  │                    │                  │                   │  │
│  │  • Store data      │  • Log errors    │ • Check services  │  │
│  │  • Track age       │  • Severity      │ • Network status  │  │
│  │  • Detect stale    │  • Statistics    │ • API health      │  │
│  │  • Fallback to     │  • Export logs   │ • Storage health  │  │
│  │    expired data    │  • localStorage  │ • Overall status  │  │
│  │  • localStorage    │                  │                   │  │
│  └────────────────────┴──────────────────┴───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌────────────────────┬──────────────────┬───────────────────┐  │
│  │   LA Crime API     │  OpenStreetMap   │  Health Endpoint  │  │
│  │  (data.lacity.org) │  (Tiles)         │  (/health.json)   │  │
│  │                    │                  │                   │  │
│  │  • Crime records   │  • Map tiles     │  • Status info    │  │
│  │  • Timeout: 30s    │  • Cached        │  • Version        │  │
│  │  • Retry: 3x       │  • Fallback      │  • Services       │  │
│  └────────────────────┴──────────────────┴───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Error Flow Diagram

```
┌──────────────┐
│ Error Occurs │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ Component Error Boundary?   │◄─── React Component Errors
└──────┬──────────────────────┘
       │
     Caught
       │
       ▼
┌─────────────────────────────┐
│  Show Fallback UI           │
│  • Error icon               │
│  • User-friendly message    │
│  • Recovery actions         │
│  • Technical details        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Log Error                  │
│  • errorLogger.log()        │
│  • Severity level           │
│  • Context data             │
│  • Stack trace              │
└─────────────────────────────┘


┌──────────────┐
│ API Request  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ Network Available?          │◄─── Check navigator.onLine
└──────┬──────────────────────┘
       │
      Yes
       │
       ▼
┌─────────────────────────────┐
│ Make Request with Timeout   │
└──────┬──────────────────────┘
       │
    Success? ──Yes──> Return Data
       │
      No
       │
       ▼
┌─────────────────────────────┐
│ Error Type?                 │
└──────┬──────────────────────┘
       │
       ├─── Timeout ────────────┐
       │                        │
       ├─── Network Error ──────┤
       │                        │
       ├─── 500-504 ────────────┤
       │                        │
       └─── Other ──────────────┤
                                │
                                ▼
                        ┌───────────────┐
                        │  Retryable?   │
                        └───────┬───────┘
                                │
                              Yes
                                │
                                ▼
                        ┌───────────────┐
                        │ Attempts < 3? │
                        └───────┬───────┘
                                │
                              Yes
                                │
                                ▼
                        ┌───────────────┐
                        │ Wait + Retry  │
                        └───────┬───────┘
                                │
                                ▼
                        (Back to Request)
                                │
                              No
                                │
                                ▼
                        ┌───────────────┐
                        │ Check Cache   │
                        └───────┬───────┘
                                │
                         Available? ──Yes──> Return Cached + Warning
                                │
                               No
                                │
                                ▼
                        ┌───────────────┐
                        │ Return Mock   │
                        │ + Error Msg   │
                        └───────────────┘
```

## Network Status Flow

```
┌─────────────────────────────┐
│  Network Monitor Starts     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Subscribe to Events        │
│  • online                   │
│  • offline                  │
│  • connection change        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Check Current Status       │
│  • navigator.onLine         │
│  • connection.effectiveType │
│  • connection.rtt           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Determine Status           │
└──────┬──────────────────────┘
       │
       ├──> Offline (red)
       │
       ├──> Slow (orange)
       │    • effectiveType: '2g', 'slow-2g'
       │    • rtt > 500ms
       │
       └──> Online (green)
              • All others
```

## Data Freshness Flow

```
┌─────────────────────────────┐
│  Request Data               │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Get Cache Metadata         │
│  • Age                      │
│  • Expiry time              │
│  • Staleness threshold      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Age < 80% of Expiry?       │
└──────┬──────────────────────┘
       │
     Yes ──────> FRESH ──────> Return Data
       │                       (no warning)
       No
       │
       ▼
┌─────────────────────────────┐
│  Age < 100% of Expiry?      │
└──────┬──────────────────────┘
       │
     Yes ──────> STALE ──────> Return Data
       │                       (show warning)
       No
       │
       ▼
     EXPIRED ──────> Try API ──────> Success? ──Yes──> Return Fresh
                          │                              (cache it)
                          No
                          │
                          ▼
                    Return Stale + Warning
```

## Component Hierarchy

```
index.tsx (Root)
│
├─ <ErrorBoundary> ─────────────── Catches all errors
│   │
│   └─ <AccessibilityProvider>
│       │
│       └─ <AppWrapper>
│           │
│           ├─ <InfoModal>
│           ├─ <Footer>
│           │
│           └─ <App.enhanced>
│               │
│               ├─ <NetworkStatus> ── Shows connection status
│               │
│               ├─ <ErrorDisplay> ─── Shows API errors
│               │
│               ├─ <StaleDataWarning> ─ Shows cache warnings
│               │
│               └─ <ErrorBoundary> ───── Catches child errors
│                   │
│                   ├─ <CrimeMap>
│                   │   └─ <Suspense fallback={<MapSkeleton>}>
│                   │
│                   └─ <DataVisualization>
│                       └─ Charts & Analytics
```

## Key Integration Points

### 1. Error Boundary Integration
```
User Interaction
    │
    ▼
Component Throws Error
    │
    ▼
Error Boundary Catches
    │
    ├──> Log Error (errorLogger)
    │
    ├──> Show Fallback UI
    │
    └──> Provide Recovery Actions
```

### 2. API Request Integration
```
Component Requests Data
    │
    ▼
crimeDataService.fetchCrimeData()
    │
    ├──> Check Network Status
    │
    ├──> Check Cache
    │
    ├──> API Request (apiService.fetchWithRetry)
    │    │
    │    ├──> Timeout after 30s
    │    │
    │    ├──> Retry 3x with backoff
    │    │
    │    └──> Log Errors
    │
    └──> Return Result + Metadata
         (source, isStale, error)
```

### 3. Cache Integration
```
Data Requested
    │
    ▼
Cache Check
    │
    ├──> Fresh Data? ──Yes──> Return (no warning)
    │        │
    │       No
    │        │
    ├──> Stale Data? ──Yes──> Return (with warning)
    │        │
    │       No
    │        │
    └──> Fetch Fresh ──> Success? ──Yes──> Cache & Return
             │              │
             │             No
             │              │
             └──> Use Stale ──> Return (with error)
                      │
                     None
                      │
                      └──> Mock Data
```

## Legend

```
┌────────┐
│ Process│  = Processing step
└────────┘

┌────────┐
│Question│  = Decision point
└────────┘

  ──>      = Flow direction

  ◄──      = Reference/Callback

  │
  ├──      = Branch/Multiple paths
  │
  └──      = Branch end
```

## Summary

This architecture provides:

1. **Multiple layers of protection**
   - Error Boundaries catch component errors
   - API Service handles network errors
   - Cache provides fallback data

2. **Graceful degradation**
   - Fresh data → Stale data → Mock data
   - Online → Slow → Offline
   - Working → Degraded → Fallback

3. **User awareness**
   - Network status indicator
   - Error messages
   - Stale data warnings
   - Loading states

4. **Developer tools**
   - Error logging
   - Health monitoring
   - Performance tracking
   - Debug information

---

**Architecture Version:** 1.0

**Last Updated:** 2026-02-14

**Status:** Production Ready ✅
