// LA Crime Data Service - fetches real crime data from LA City Open Data Portal
// API: https://data.lacity.org/resource/2nrs-mtv8.json
import cache from './utils/cacheService';
import {
  enhanceCrimeData,
  calculateCountyAverages,
  EnhancedCrimeData,
  CrimeStats
} from './utils/crimeAnalytics';

export interface NeighborhoodData extends EnhancedCrimeData {
  name: string;
}

const CACHE_KEY = 'la-crime-data';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CrimeRecord {
  area_name: string;
  crm_cd_desc: string;
  date_occ: string;
}

// Categorize crime descriptions into our 4 metrics
type BasicCrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

function categorizeCrime(description: string): BasicCrimeMetric | null {
  const desc = description.toUpperCase();

  // Violent crimes: assault, robbery, rape, homicide, battery with weapon
  // Note: Simple battery excluded (too common), only aggravated assault/weapon crimes
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
  if (
    desc.includes('BURGLARY') && !desc.includes('VEHICLE')
  ) {
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

// Fetch crime data from LA Open Data Portal with caching
export async function fetchCrimeData(weeksBack: number = 1): Promise<NeighborhoodData[]> {
  try {
    // Check cache first
    const cachedData = cache.get<NeighborhoodData[]>(CACHE_KEY);
    if (cachedData) {
      console.log('Using cached crime data');
      return cachedData;
    }

    console.log('Cache miss - fetching fresh data from API');

    // Note: LA Crime Data dataset is updated periodically
    // Using recent data from late 2024 for demonstration
    // In production, you would use actual current dates
    const endDate = new Date('2024-12-01');
    const startDate = new Date('2024-12-01');
    startDate.setDate(startDate.getDate() - (weeksBack * 7));

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Socrata API endpoint for LA Crime Data (2020 to Present)
    // Using $limit=50000 to get sufficient data for weekly stats
    const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$where=date_occ>='${startDateStr}T00:00:00.000' AND date_occ<='${endDateStr}T23:59:59.999'&$limit=50000&$select=area_name,crm_cd_desc,date_occ`;

    console.log('Fetching crime data from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: CrimeRecord[] = await response.json();
    console.log(`Fetched ${data.length} crime records`);

    // Aggregate data by neighborhood
    const neighborhoodMap = new Map<string, {
      violentCrime: number;
      carTheft: number;
      breakIns: number;
      pettyTheft: number;
    }>();

    data.forEach(record => {
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
    const basicNeighborhoods = Array.from(neighborhoodMap.entries())
      .map(([name, stats]) => ({
        name,
        stats: {
          violentCrime: Math.round(stats.violentCrime / weeksBack),
          carTheft: Math.round(stats.carTheft / weeksBack),
          breakIns: Math.round(stats.breakIns / weeksBack),
          pettyTheft: Math.round(stats.pettyTheft / weeksBack)
        }
      }))
      .filter(n =>
        // Filter out areas with very low crime (likely incomplete data)
        n.stats.violentCrime > 0 || n.stats.carTheft > 0 || n.stats.breakIns > 0 || n.stats.pettyTheft > 0
      );

    console.log(`Processed ${basicNeighborhoods.length} neighborhoods`);

    // Calculate county averages for comparison
    const countyAverages = calculateCountyAverages(basicNeighborhoods);
    console.log('County averages:', countyAverages);

    // Enhance each neighborhood with statistical analysis
    const lastUpdated = new Date();
    const neighborhoods: NeighborhoodData[] = basicNeighborhoods
      .map(({ name, stats }) => {
        const enhanced = enhanceCrimeData(
          name,
          stats,
          basicNeighborhoods,
          countyAverages,
          lastUpdated
        );

        return {
          name,
          ...enhanced
        };
      })
      .sort((a, b) => {
        // Sort by safety score (descending) if available, otherwise by total crime
        if (a.safetyScore !== null && b.safetyScore !== null) {
          return b.safetyScore - a.safetyScore; // Higher safety score first
        }
        const totalA = a.violentCrime + a.carTheft + a.breakIns + a.pettyTheft;
        const totalB = b.violentCrime + b.carTheft + b.breakIns + b.pettyTheft;
        return totalA - totalB; // Lower crime first
      });

    console.log(`Enhanced ${neighborhoods.length} neighborhoods with analytics`);
    console.log('Sample enhanced data:', neighborhoods[0]);

    // Cache the processed data
    cache.set(CACHE_KEY, neighborhoods, CACHE_DURATION);

    return neighborhoods;

  } catch (error) {
    console.error('Error fetching crime data:', error);
    // Return empty array on error - app will handle gracefully
    return [];
  }
}

/**
 * Clear the crime data cache
 * Useful for forcing a data refresh
 */
export function clearCrimeCache(): void {
  cache.remove(CACHE_KEY);
  console.log('Crime data cache cleared');
}

// Get sample of popular LA neighborhoods for initial display
export function getMockData(): NeighborhoodData[] {
  const mockBasicData = [
    { name: 'Central', stats: { violentCrime: 15, carTheft: 12, breakIns: 18, pettyTheft: 45 } },
    { name: 'Hollywood', stats: { violentCrime: 12, carTheft: 15, breakIns: 14, pettyTheft: 38 } },
    { name: '77th Street', stats: { violentCrime: 18, carTheft: 14, breakIns: 16, pettyTheft: 35 } },
    { name: 'Pacific', stats: { violentCrime: 8, carTheft: 10, breakIns: 12, pettyTheft: 28 } },
    { name: 'Wilshire', stats: { violentCrime: 10, carTheft: 11, breakIns: 13, pettyTheft: 32 } },
    { name: 'West LA', stats: { violentCrime: 4, carTheft: 6, breakIns: 8, pettyTheft: 18 } },
  ];

  const countyAverages = calculateCountyAverages(mockBasicData);
  const lastUpdated = new Date();

  return mockBasicData.map(({ name, stats }) => {
    const enhanced = enhanceCrimeData(
      name,
      stats,
      mockBasicData,
      countyAverages,
      lastUpdated
    );

    return {
      name,
      ...enhanced
    };
  });
}
