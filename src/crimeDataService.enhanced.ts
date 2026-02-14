// Enhanced LA Crime Data Service with robust error handling and resilience
// API: https://data.lacity.org/resource/2nrs-mtv8.json
import cache from './utils/cacheService';
import { fetchWithRetry, ApiError } from './utils/apiService';
import { logError, logMediumError, logHighError } from './utils/errorLogger';
import { networkMonitor } from './utils/networkStatus';

export interface NeighborhoodData {
  name: string;
  violentCrime: number; // per week
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
}

export interface DataFetchResult {
  data: NeighborhoodData[];
  source: 'api' | 'cache' | 'stale-cache' | 'fallback';
  isStale: boolean;
  error?: string;
  lastUpdated?: Date;
}

const CACHE_KEY = 'la-crime-data';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

interface CrimeRecord {
  area_name: string;
  crm_cd_desc: string;
  date_occ: string;
}

// Categorize crime descriptions into our 4 metrics
function categorizeCrime(description: string): keyof Omit<NeighborhoodData, 'name'> | null {
  const desc = description.toUpperCase();

  // Violent crimes: assault, robbery, rape, homicide, battery with weapon
  if (
    desc.includes('ASSAULT') ||
    desc.includes('ROBBERY') ||
    desc.includes('RAPE') ||
    desc.includes('HOMICIDE') ||
    desc.includes('MURDER') ||
    desc.includes('MANSLAUGHTER') ||
    desc.includes('LYNCHING') ||
    desc.includes('SHOTS FIRED') ||
    desc.includes('KIDNAPPING') ||
    desc.includes('WEAPON')
  ) {
    return 'violentCrime';
  }

  // Car theft: vehicle stolen
  if (
    desc.includes('VEHICLE - STOLEN') ||
    desc.includes('VEHICLE, STOLEN') ||
    desc.includes('VEHICLE - ATTEMPT STOLEN')
  ) {
    return 'carTheft';
  }

  // Break-ins: burglary
  if (desc.includes('BURGLARY') && !desc.includes('VEHICLE')) {
    return 'breakIns';
  }

  // Petty theft: all other theft, shoplifting, etc
  if (
    desc.includes('THEFT') ||
    desc.includes('SHOPLIFT') ||
    desc.includes('BURGLARY FROM VEHICLE') ||
    desc.includes('PICKPOCKET') ||
    desc.includes('PURSE SNATCH') ||
    desc.includes('TILL TAP') ||
    desc.includes('EMBEZZLE')
  ) {
    return 'pettyTheft';
  }

  return null;
}

// Get fallback mock data
export function getMockData(): NeighborhoodData[] {
  return [
    { name: 'Central', violentCrime: 15, carTheft: 12, breakIns: 18, pettyTheft: 45 },
    { name: 'Hollywood', violentCrime: 12, carTheft: 15, breakIns: 14, pettyTheft: 38 },
    { name: '77th Street', violentCrime: 18, carTheft: 14, breakIns: 16, pettyTheft: 35 },
    { name: 'Pacific', violentCrime: 8, carTheft: 10, breakIns: 12, pettyTheft: 28 },
    { name: 'Wilshire', violentCrime: 10, carTheft: 11, breakIns: 13, pettyTheft: 32 },
    { name: 'West LA', violentCrime: 4, carTheft: 6, breakIns: 8, pettyTheft: 18 },
  ];
}

/**
 * Fetch crime data with enhanced error handling and fallback strategies
 */
export async function fetchCrimeData(weeksBack: number = 1): Promise<DataFetchResult> {
  const startTime = performance.now();

  try {
    // Step 1: Check fresh cache first
    const cachedResult = cache.getWithMetadata<NeighborhoodData[]>(CACHE_KEY);

    if (cachedResult && !cachedResult.metadata.isExpired) {
      console.log('Using fresh cached crime data');
      return {
        data: cachedResult.data,
        source: 'cache',
        isStale: cachedResult.metadata.isStale,
        lastUpdated: new Date(Date.now() - cachedResult.metadata.age * 1000)
      };
    }

    // Step 2: Check network status
    if (!networkMonitor.isOnline()) {
      console.warn('Offline: Attempting to use stale cache');
      const staleData = cache.getStale<NeighborhoodData[]>(CACHE_KEY);

      if (staleData) {
        logMediumError('Using stale cache data due to offline status', {
          cacheKey: CACHE_KEY,
          dataLength: staleData.length
        });

        return {
          data: staleData,
          source: 'stale-cache',
          isStale: true,
          error: 'Device is offline. Showing cached data.'
        };
      }

      // No cache available and offline
      logHighError('No cache available while offline', { cacheKey: CACHE_KEY });
      return {
        data: getMockData(),
        source: 'fallback',
        isStale: true,
        error: 'Device is offline and no cached data available. Showing sample data.'
      };
    }

    // Step 3: Attempt to fetch from API
    console.log('Cache miss or stale - fetching fresh data from API');

    const endDate = new Date('2024-12-01');
    const startDate = new Date('2024-12-01');
    startDate.setDate(startDate.getDate() - (weeksBack * 7));

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$where=date_occ>='${startDateStr}T00:00:00.000' AND date_occ<='${endDateStr}T23:59:59.999'&$limit=50000&$select=area_name,crm_cd_desc,date_occ`;

    console.log('Fetching crime data from:', url);

    let rawData: CrimeRecord[];
    let retryCount = 0;

    try {
      rawData = await fetchWithRetry<CrimeRecord[]>(url, {}, {
        timeout: API_TIMEOUT,
        retries: MAX_RETRIES,
        onRetry: (attempt, error) => {
          retryCount = attempt;
          console.log(`Retry attempt ${attempt}/${MAX_RETRIES}:`, error.message);
        }
      });
    } catch (apiError) {
      const error = apiError as ApiError;

      // Log the API error
      logHighError('API request failed after retries', {
        url,
        retries: retryCount,
        status: error.status,
        isTimeout: error.isTimeout,
        isNetworkError: error.isNetworkError,
        message: error.message
      });

      // Try to use stale cache as fallback
      const staleData = cache.getStale<NeighborhoodData[]>(CACHE_KEY);
      if (staleData) {
        console.warn('API failed, using stale cache as fallback');
        return {
          data: staleData,
          source: 'stale-cache',
          isStale: true,
          error: error.isTimeout
            ? 'API request timed out. Showing cached data.'
            : error.isNetworkError
            ? 'Network error. Showing cached data.'
            : `API error (${error.status || 'unknown'}). Showing cached data.`
        };
      }

      // No cache available, use mock data
      console.error('No cache available, falling back to mock data');
      return {
        data: getMockData(),
        source: 'fallback',
        isStale: true,
        error: error.isTimeout
          ? 'API request timed out. Showing sample data.'
          : error.isNetworkError
          ? 'Network error. Showing sample data.'
          : `API error (${error.status || 'unknown'}). Showing sample data.`
      };
    }

    // Step 4: Process the data
    console.log(`Fetched ${rawData.length} crime records in ${Math.round(performance.now() - startTime)}ms`);

    if (rawData.length === 0) {
      logMediumError('API returned empty data', { url, weeksBack });

      // Try stale cache first
      const staleData = cache.getStale<NeighborhoodData[]>(CACHE_KEY);
      if (staleData) {
        return {
          data: staleData,
          source: 'stale-cache',
          isStale: true,
          error: 'API returned no data. Showing cached data.'
        };
      }

      return {
        data: getMockData(),
        source: 'fallback',
        isStale: true,
        error: 'No data available from API. Showing sample data.'
      };
    }

    // Aggregate data by neighborhood
    const neighborhoodMap = new Map<string, {
      violentCrime: number;
      carTheft: number;
      breakIns: number;
      pettyTheft: number;
    }>();

    rawData.forEach(record => {
      if (!record.area_name || !record.crm_cd_desc) return;

      const category = categorizeCrime(record.crm_cd_desc);
      if (!category) return;

      if (!neighborhoodMap.has(record.area_name)) {
        neighborhoodMap.set(record.area_name, {
          violentCrime: 0,
          carTheft: 0,
          breakIns: 0,
          pettyTheft: 0
        });
      }

      const stats = neighborhoodMap.get(record.area_name)!;
      stats[category]++;
    });

    // Convert to array and calculate per-week rates
    const neighborhoods: NeighborhoodData[] = Array.from(neighborhoodMap.entries())
      .map(([name, stats]) => ({
        name,
        violentCrime: Math.round(stats.violentCrime / weeksBack),
        carTheft: Math.round(stats.carTheft / weeksBack),
        breakIns: Math.round(stats.breakIns / weeksBack),
        pettyTheft: Math.round(stats.pettyTheft / weeksBack)
      }))
      .filter(n =>
        n.violentCrime > 0 || n.carTheft > 0 || n.breakIns > 0 || n.pettyTheft > 0
      )
      .sort((a, b) => {
        const totalA = a.violentCrime + a.carTheft + a.breakIns + a.pettyTheft;
        const totalB = b.violentCrime + b.carTheft + b.breakIns + b.pettyTheft;
        return totalB - totalA;
      });

    console.log(`Processed ${neighborhoods.length} neighborhoods in ${Math.round(performance.now() - startTime)}ms`);

    // Cache the processed data
    cache.set(CACHE_KEY, neighborhoods, CACHE_DURATION);

    return {
      data: neighborhoods,
      source: 'api',
      isStale: false,
      lastUpdated: new Date()
    };

  } catch (error) {
    // Catch-all error handler
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logHighError('Critical error in fetchCrimeData', {
      error: errorMessage,
      weeksBack,
      duration: Math.round(performance.now() - startTime)
    });

    // Last resort: try stale cache
    const staleData = cache.getStale<NeighborhoodData[]>(CACHE_KEY);
    if (staleData) {
      return {
        data: staleData,
        source: 'stale-cache',
        isStale: true,
        error: `An error occurred: ${errorMessage}. Showing cached data.`
      };
    }

    // Absolute fallback
    return {
      data: getMockData(),
      source: 'fallback',
      isStale: true,
      error: `An error occurred: ${errorMessage}. Showing sample data.`
    };
  }
}

/**
 * Clear the crime data cache
 */
export function clearCrimeCache(): void {
  cache.remove(CACHE_KEY);
  console.log('Crime data cache cleared');
}

/**
 * Prefetch data in the background
 */
export async function prefetchCrimeData(weeksBack: number = 1): Promise<void> {
  try {
    await fetchCrimeData(weeksBack);
    console.log('Data prefetched successfully');
  } catch (error) {
    console.warn('Prefetch failed:', error);
  }
}

export default {
  fetchCrimeData,
  clearCrimeCache,
  getMockData,
  prefetchCrimeData
};
