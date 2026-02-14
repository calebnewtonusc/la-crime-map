/**
 * Network Status Detector
 * Monitors online/offline status and connection quality
 */

import { useState, useEffect } from 'react';
import { logError } from './errorLogger';

export type NetworkStatus = 'online' | 'offline' | 'slow';

export interface NetworkInfo {
  isOnline: boolean;
  status: NetworkStatus;
  effectiveType?: string; // '4g', '3g', '2g', 'slow-2g'
  downlink?: number; // Mbps
  rtt?: number; // Round-trip time in ms
  saveData?: boolean;
}

class NetworkMonitor {
  private static instance: NetworkMonitor;
  private listeners: Set<(info: NetworkInfo) => void> = new Set();
  private currentInfo: NetworkInfo = {
    isOnline: navigator.onLine,
    status: navigator.onLine ? 'online' : 'offline'
  };

  private constructor() {
    this.initialize();
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private initialize(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Listen for connection changes (if supported)
    if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      if (connection) {
        connection.addEventListener('change', this.handleConnectionChange);
        this.updateConnectionInfo();
      }
    }

    // Initial check
    this.updateStatus();
  }

  private handleOnline = (): void => {
    console.log('Network status: ONLINE');
    this.updateStatus();
  };

  private handleOffline = (): void => {
    console.log('Network status: OFFLINE');
    logError('Network connection lost', {
      timestamp: new Date().toISOString()
    }, 'medium');
    this.updateStatus();
  };

  private handleConnectionChange = (): void => {
    console.log('Network connection changed');
    this.updateConnectionInfo();
    this.updateStatus();
  };

  private updateConnectionInfo(): void {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection) {
      this.currentInfo.effectiveType = connection.effectiveType;
      this.currentInfo.downlink = connection.downlink;
      this.currentInfo.rtt = connection.rtt;
      this.currentInfo.saveData = connection.saveData;
    }
  }

  private updateStatus(): void {
    const isOnline = navigator.onLine;
    let status: NetworkStatus = isOnline ? 'online' : 'offline';

    // Check for slow connection
    if (isOnline && this.currentInfo.effectiveType) {
      if (this.currentInfo.effectiveType === 'slow-2g' || this.currentInfo.effectiveType === '2g') {
        status = 'slow';
      }
    }

    // Check RTT (round-trip time)
    if (isOnline && this.currentInfo.rtt && this.currentInfo.rtt > 500) {
      status = 'slow';
    }

    this.currentInfo = {
      ...this.currentInfo,
      isOnline,
      status
    };

    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentInfo);
      } catch (error) {
        console.error('Error in network status listener:', error);
      }
    });
  }

  /**
   * Subscribe to network status changes
   */
  subscribe(listener: (info: NetworkInfo) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current status
    listener(this.currentInfo);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current network info
   */
  getNetworkInfo(): NetworkInfo {
    return { ...this.currentInfo };
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return this.currentInfo.isOnline;
  }

  /**
   * Check if connection is slow
   */
  isSlow(): boolean {
    return this.currentInfo.status === 'slow';
  }

  /**
   * Ping test to verify connectivity
   */
  async ping(url: string = window.location.origin, timeout: number = 5000): Promise<number | null> {
    if (!this.currentInfo.isOnline) {
      return null;
    }

    try {
      const start = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const duration = performance.now() - start;
      return Math.round(duration);
    } catch (error) {
      return null;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.removeEventListener('change', this.handleConnectionChange);
    }

    this.listeners.clear();
  }
}

export const networkMonitor = NetworkMonitor.getInstance();

/**
 * React hook for network status
 */
export function useNetworkStatus(): NetworkInfo {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(
    networkMonitor.getNetworkInfo()
  );

  useEffect(() => {
    const unsubscribe = networkMonitor.subscribe(setNetworkInfo);
    return unsubscribe;
  }, []);

  return networkInfo;
}

/**
 * React hook for online status (simpler version)
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default networkMonitor;
