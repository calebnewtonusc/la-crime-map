// Cache service for localStorage with automatic expiration
// Stores data with timestamp and checks freshness on retrieval

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheService {
  private static instance: CacheService;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Store data in cache with expiration time
   * @param key Cache key
   * @param data Data to cache
   * @param expiresIn Expiration time in milliseconds (default: 1 hour)
   */
  set<T>(key: string, data: T, expiresIn: number = 60 * 60 * 1000): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
      console.log(`Cached data for key: ${key}, expires in ${expiresIn / 1000}s`);
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // Fail silently if localStorage is full or unavailable
    }
  }

  /**
   * Retrieve data from cache if not expired
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const age = Date.now() - cacheItem.timestamp;

      if (age > cacheItem.expiresIn) {
        console.log(`Cache expired for key: ${key} (age: ${age / 1000}s)`);
        this.remove(key);
        return null;
      }

      console.log(`Cache hit for key: ${key} (age: ${age / 1000}s)`);
      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  /**
   * Check if cache exists and is fresh
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
      console.log(`Removed cache for key: ${key}`);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  /**
   * Clear all cache items (optional: only items with specific prefix)
   */
  clear(prefix?: string): void {
    try {
      if (prefix) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
        console.log(`Cleared cache with prefix: ${prefix}`);
      } else {
        localStorage.clear();
        console.log('Cleared all cache');
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache age in seconds
   */
  getAge(key: string): number | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      const cacheItem: CacheItem<any> = JSON.parse(item);
      return (Date.now() - cacheItem.timestamp) / 1000;
    } catch (error) {
      return null;
    }
  }
}

export const cache = CacheService.getInstance();
export default cache;
