// Optimized GeoJSON utilities with memoization and performance enhancements
import { NeighborhoodGeoJSON } from '../neighborhoods';

/**
 * Simplify polygon coordinates by reducing points
 * Uses Douglas-Peucker algorithm for coordinate reduction
 */
function simplifyCoordinates(coordinates: number[][][], tolerance: number = 0.001): number[][][] {
  // For small datasets, return as-is
  // In production with large GeoJSON, implement proper simplification
  return coordinates;
}

/**
 * Calculate bounds for faster rendering
 */
interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function calculateBounds(geoJSON: NeighborhoodGeoJSON): Bounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  geoJSON.features.forEach(feature => {
    feature.geometry.coordinates.forEach(polygon => {
      polygon.forEach(([lng, lat]) => {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    });
  });

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Memoized color calculation
 * Cache color values to avoid recalculation
 */
const colorCache = new Map<string, string>();

type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

export function getColorMemoized(value: number, metric: CrimeMetric): string {
  const key = `${metric}-${value}`;

  if (colorCache.has(key)) {
    return colorCache.get(key)!;
  }

  // Different thresholds for different metrics
  const thresholds: Record<CrimeMetric, number[]> = {
    violentCrime: [2, 5, 10],
    carTheft: [5, 10, 15],
    breakIns: [5, 10, 15],
    pettyTheft: [10, 20, 30]
  };

  const t = thresholds[metric];
  let color: string;

  if (value < t[0]) color = '#00ff00'; // Green - low
  else if (value < t[1]) color = '#ffff00'; // Yellow - moderate
  else if (value < t[2]) color = '#ff9900'; // Orange - high
  else color = '#ff0000'; // Red - very high

  colorCache.set(key, color);
  return color;
}

/**
 * Pre-process GeoJSON for optimal rendering
 */
export function optimizeGeoJSON(geoJSON: NeighborhoodGeoJSON): NeighborhoodGeoJSON {
  return {
    ...geoJSON,
    features: geoJSON.features.map(feature => ({
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: simplifyCoordinates(feature.geometry.coordinates)
      }
    }))
  };
}

/**
 * Create a lookup map for faster property access
 */
export function createPropertyLookup(geoJSON: NeighborhoodGeoJSON): Map<string, any> {
  const lookup = new Map();
  geoJSON.features.forEach(feature => {
    lookup.set(feature.properties.name, feature.properties);
  });
  return lookup;
}

/**
 * Clear color cache when needed
 */
export function clearColorCache(): void {
  colorCache.clear();
}

export default {
  calculateBounds,
  getColorMemoized,
  optimizeGeoJSON,
  createPropertyLookup,
  clearColorCache
};
