/**
 * Enhanced API Service with retry logic, timeout handling, and error recovery
 */

export interface ApiConfig {
  timeout?: number; // milliseconds
  retries?: number;
  retryDelay?: number; // milliseconds
  retryOnStatusCodes?: number[]; // HTTP status codes to retry on
  onRetry?: (attempt: number, error: Error) => void;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  isTimeout?: boolean;
  isNetworkError?: boolean;
  retryCount?: number;
}

const DEFAULT_CONFIG: Required<ApiConfig> = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  retryOnStatusCodes: [408, 429, 500, 502, 503, 504], // Request timeout, rate limit, server errors
  onRetry: () => {}
};

/**
 * Delay helper for retry logic
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create an API error with additional context
 */
const createApiError = (
  message: string,
  options: Partial<ApiError> = {}
): ApiError => {
  const error = new Error(message) as ApiError;
  Object.assign(error, options);
  return error;
};

/**
 * Fetch with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw createApiError('Request timeout', {
          isTimeout: true,
          status: 408
        });
      }

      // Network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw createApiError('Network error - please check your connection', {
          isNetworkError: true
        });
      }
    }

    throw error;
  }
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: ApiError, retryOnStatusCodes: number[]): boolean => {
  // Retry on timeout
  if (error.isTimeout) {
    return true;
  }

  // Retry on network errors
  if (error.isNetworkError) {
    return true;
  }

  // Retry on specific status codes
  if (error.status && retryOnStatusCodes.includes(error.status)) {
    return true;
  }

  return false;
};

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number, baseDelay: number): number => {
  // Exponential backoff: baseDelay * 2^attempt with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // Add random jitter up to 1 second
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
};

/**
 * Enhanced fetch with retry logic, timeout, and error handling
 */
export async function fetchWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  config: ApiConfig = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= finalConfig.retries; attempt++) {
    try {
      // Add delay before retry (except first attempt)
      if (attempt > 0) {
        const retryDelay = getRetryDelay(attempt - 1, finalConfig.retryDelay);
        console.log(`Retrying request (attempt ${attempt}/${finalConfig.retries}) after ${Math.round(retryDelay)}ms...`);
        await delay(retryDelay);

        if (finalConfig.onRetry) {
          finalConfig.onRetry(attempt, lastError!);
        }
      }

      // Make the request with timeout
      const response = await fetchWithTimeout(url, options, finalConfig.timeout);

      // Check for HTTP errors
      if (!response.ok) {
        const error = createApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
            retryCount: attempt
          }
        );

        // Only retry if this is a retryable status code
        if (isRetryableError(error, finalConfig.retryOnStatusCodes) && attempt < finalConfig.retries) {
          lastError = error;
          continue;
        }

        throw error;
      }

      // Parse JSON response
      const data = await response.json();
      return data;

    } catch (error) {
      lastError = error instanceof Error ? error as ApiError : createApiError('Unknown error');
      lastError.retryCount = attempt;

      // If this is the last attempt or error is not retryable, throw
      if (attempt >= finalConfig.retries || !isRetryableError(lastError, finalConfig.retryOnStatusCodes)) {
        console.error(`Request failed after ${attempt + 1} attempt(s):`, lastError);
        throw lastError;
      }
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || createApiError('Request failed');
}

/**
 * Check API health
 */
export async function checkApiHealth(url: string, timeout: number = 5000): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(url, {}, timeout);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

/**
 * Batch API requests with concurrency control
 */
export async function batchRequests<T>(
  urls: string[],
  options: RequestInit = {},
  config: ApiConfig = {},
  maxConcurrent: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const errors: ApiError[] = [];

  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const promises = batch.map(url =>
      fetchWithRetry<T>(url, options, config).catch(error => {
        errors.push(error);
        return null;
      })
    );

    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter(Boolean) as T[]);
  }

  if (errors.length > 0) {
    console.warn(`Batch requests completed with ${errors.length} error(s)`);
  }

  return results;
}

/**
 * Simple cache for API responses
 */
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const apiCache = new ApiCache();

/**
 * Fetch with cache support
 */
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  config: ApiConfig = {},
  cacheTTL: number = 60000
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check cache first
  const cached = apiCache.get<T>(cacheKey);
  if (cached) {
    console.log('Returning cached response for:', url);
    return cached;
  }

  // Fetch and cache
  const data = await fetchWithRetry<T>(url, options, config);
  apiCache.set(cacheKey, data, cacheTTL);

  return data;
}

export default {
  fetchWithRetry,
  fetchWithCache,
  checkApiHealth,
  batchRequests,
  apiCache
};
