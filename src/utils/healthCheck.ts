/**
 * Health Check Utility
 * Monitors application and API health status
 */

import { checkApiHealth } from './apiService';
import { logError } from './errorLogger';

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    timestamp: string;
  }[];
  timestamp: string;
}

class HealthChecker {
  private static instance: HealthChecker;

  private constructor() {}

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  /**
   * Check if localStorage is available
   */
  private async checkLocalStorage(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return { status: 'pass' };
    } catch (error) {
      return {
        status: 'fail',
        message: 'localStorage not available'
      };
    }
  }

  /**
   * Check if IndexedDB is available
   */
  private async checkIndexedDB(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      if (!window.indexedDB) {
        return {
          status: 'fail',
          message: 'IndexedDB not supported'
        };
      }
      return { status: 'pass' };
    } catch (error) {
      return {
        status: 'fail',
        message: 'IndexedDB check failed'
      };
    }
  }

  /**
   * Check LA Crime Data API
   */
  private async checkCrimeAPI(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      const isHealthy = await checkApiHealth(
        'https://data.lacity.org/resource/2nrs-mtv8.json?$limit=1',
        5000
      );

      if (isHealthy) {
        return { status: 'pass' };
      } else {
        return {
          status: 'fail',
          message: 'API returned non-200 status'
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: error instanceof Error ? error.message : 'API check failed'
      };
    }
  }

  /**
   * Check map tile service
   */
  private async checkMapTiles(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      const isHealthy = await checkApiHealth(
        'https://tile.openstreetmap.org/0/0/0.png',
        5000
      );

      if (isHealthy) {
        return { status: 'pass' };
      } else {
        return {
          status: 'fail',
          message: 'Map tiles unavailable'
        };
      }
    } catch (error) {
      return {
        status: 'fail',
        message: 'Map tile check failed'
      };
    }
  }

  /**
   * Check network connectivity
   */
  private async checkNetwork(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    if (!navigator.onLine) {
      return {
        status: 'fail',
        message: 'No network connection'
      };
    }
    return { status: 'pass' };
  }

  /**
   * Check app health endpoint
   */
  private async checkAppHealth(): Promise<{ status: 'pass' | 'fail'; message?: string }> {
    try {
      const response = await fetch('/health.json', {
        cache: 'no-cache'
      });

      if (!response.ok) {
        return {
          status: 'fail',
          message: 'Health endpoint returned non-200'
        };
      }

      const data = await response.json();
      if (data.status !== 'healthy') {
        return {
          status: 'fail',
          message: `Health status: ${data.status}`
        };
      }

      return { status: 'pass' };
    } catch (error) {
      return {
        status: 'fail',
        message: 'Health endpoint unreachable'
      };
    }
  }

  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const checks: HealthStatus['checks'] = [];

    // Run all checks in parallel
    const [
      networkResult,
      localStorageResult,
      indexedDBResult,
      appHealthResult,
      crimeAPIResult,
      mapTilesResult
    ] = await Promise.all([
      this.checkNetwork(),
      this.checkLocalStorage(),
      this.checkIndexedDB(),
      this.checkAppHealth(),
      this.checkCrimeAPI(),
      this.checkMapTiles()
    ]);

    // Network check
    checks.push({
      name: 'Network Connectivity',
      status: networkResult.status,
      message: networkResult.message,
      timestamp
    });

    // LocalStorage check
    checks.push({
      name: 'LocalStorage',
      status: localStorageResult.status,
      message: localStorageResult.message,
      timestamp
    });

    // IndexedDB check
    checks.push({
      name: 'IndexedDB',
      status: indexedDBResult.status,
      message: indexedDBResult.message,
      timestamp
    });

    // App health check
    checks.push({
      name: 'App Health',
      status: appHealthResult.status,
      message: appHealthResult.message,
      timestamp
    });

    // Crime API check
    checks.push({
      name: 'LA Crime Data API',
      status: crimeAPIResult.status,
      message: crimeAPIResult.message,
      timestamp
    });

    // Map tiles check
    checks.push({
      name: 'Map Tiles',
      status: mapTilesResult.status,
      message: mapTilesResult.message,
      timestamp
    });

    // Determine overall status
    const failedChecks = checks.filter(check => check.status === 'fail');
    let overall: HealthStatus['overall'] = 'healthy';

    if (failedChecks.length > 0) {
      // Critical checks (network, localStorage)
      const criticalFailed = failedChecks.some(
        check => check.name === 'Network Connectivity' || check.name === 'LocalStorage'
      );

      if (criticalFailed) {
        overall = 'unhealthy';
      } else {
        overall = 'degraded';
      }

      // Log failures
      failedChecks.forEach(check => {
        logError(
          `Health check failed: ${check.name}`,
          { check },
          overall === 'unhealthy' ? 'high' : 'medium'
        );
      });
    }

    return {
      overall,
      checks,
      timestamp
    };
  }

  /**
   * Run health checks and return summary
   */
  async getHealthSummary(): Promise<{
    isHealthy: boolean;
    message: string;
    details: HealthStatus;
  }> {
    const health = await this.runHealthChecks();

    let message = 'All systems operational';
    if (health.overall === 'degraded') {
      message = 'Some services are experiencing issues';
    } else if (health.overall === 'unhealthy') {
      message = 'Critical services are unavailable';
    }

    return {
      isHealthy: health.overall === 'healthy',
      message,
      details: health
    };
  }
}

export const healthChecker = HealthChecker.getInstance();

/**
 * Quick health check for critical services only
 */
export async function quickHealthCheck(): Promise<boolean> {
  try {
    // Check network
    if (!navigator.onLine) {
      return false;
    }

    // Check localStorage
    const testKey = '__quick_health__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);

    return true;
  } catch (error) {
    return false;
  }
}

export default healthChecker;
