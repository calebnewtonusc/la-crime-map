// LA Neighborhood Population Data
// Sources: US Census Bureau, LA Times, City of LA demographic data
// Population estimates for 2024 (based on 2020 census with growth adjustments)

export interface PopulationData {
  neighborhood: string;
  population: number;
  area_sq_miles: number; // For density calculations
  source: string;
  confidence: 'high' | 'medium' | 'low'; // Data quality indicator
}

// Population data for LA neighborhoods
// Note: Some areas are police districts that cover multiple neighborhoods
// Populations are estimated based on census tract data aggregation
export const POPULATION_DATA: PopulationData[] = [
  // Central LA
  { neighborhood: 'Central', population: 54800, area_sq_miles: 2.1, source: 'LAPD District', confidence: 'high' },
  { neighborhood: 'Downtown LA', population: 58900, area_sq_miles: 5.9, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'Koreatown', population: 124200, area_sq_miles: 2.7, source: 'LA Times', confidence: 'high' },
  { neighborhood: 'Echo Park', population: 43800, area_sq_miles: 2.4, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'Silver Lake', population: 35000, area_sq_miles: 2.6, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Los Feliz', population: 35800, area_sq_miles: 2.5, source: 'Census 2020', confidence: 'medium' },

  // Hollywood Area
  { neighborhood: 'Hollywood', population: 89000, area_sq_miles: 3.5, source: 'LAPD District', confidence: 'high' },
  { neighborhood: 'West Hollywood', population: 35800, area_sq_miles: 1.9, source: 'City Data', confidence: 'high' },

  // Westside
  { neighborhood: 'Santa Monica', population: 93000, area_sq_miles: 8.3, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Venice', population: 40900, area_sq_miles: 3.1, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'Marina del Rey', population: 10100, area_sq_miles: 1.5, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'West LA', population: 42000, area_sq_miles: 3.8, source: 'LAPD District', confidence: 'high' },
  { neighborhood: 'Pacific', population: 78200, area_sq_miles: 7.2, source: 'LAPD District', confidence: 'high' },
  { neighborhood: 'Beverly Hills', population: 32700, area_sq_miles: 5.7, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Bel Air', population: 8100, area_sq_miles: 6.4, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Brentwood', population: 51700, area_sq_miles: 13.3, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Culver City', population: 39200, area_sq_miles: 5.1, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Palms', population: 48200, area_sq_miles: 2.9, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Wilshire', population: 71500, area_sq_miles: 4.3, source: 'LAPD District', confidence: 'high' },

  // San Fernando Valley
  { neighborhood: 'Van Nuys', population: 136400, area_sq_miles: 8.9, source: 'LAPD District', confidence: 'high' },
  { neighborhood: 'North Hollywood', population: 87200, area_sq_miles: 5.2, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'Sherman Oaks', population: 61100, area_sq_miles: 9.1, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Studio City', population: 38600, area_sq_miles: 6.4, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Encino', population: 44600, area_sq_miles: 9.5, source: 'Census 2020', confidence: 'medium' },
  { neighborhood: 'Burbank', population: 107300, area_sq_miles: 17.4, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Glendale', population: 201400, area_sq_miles: 30.6, source: 'City Data', confidence: 'high' },

  // South LA
  { neighborhood: 'Inglewood', population: 109700, area_sq_miles: 9.1, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Compton', population: 95700, area_sq_miles: 10.1, source: 'City Data', confidence: 'high' },
  { neighborhood: 'South LA', population: 142800, area_sq_miles: 4.8, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'Watts', population: 36600, area_sq_miles: 2.4, source: 'Census 2020', confidence: 'high' },
  { neighborhood: '77th Street', population: 198400, area_sq_miles: 12.7, source: 'LAPD District', confidence: 'high' },

  // East LA & SGV
  { neighborhood: 'Pasadena', population: 138700, area_sq_miles: 23.1, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Alhambra', population: 82900, area_sq_miles: 7.6, source: 'City Data', confidence: 'high' },
  { neighborhood: 'East LA', population: 118800, area_sq_miles: 7.5, source: 'Census 2020', confidence: 'high' },
  { neighborhood: 'El Monte', population: 112300, area_sq_miles: 9.6, source: 'City Data', confidence: 'high' },

  // Long Beach Area
  { neighborhood: 'Long Beach', population: 466700, area_sq_miles: 50.3, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Torrance', population: 147100, area_sq_miles: 20.5, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Redondo Beach', population: 67400, area_sq_miles: 6.3, source: 'City Data', confidence: 'high' },
  { neighborhood: 'Manhattan Beach', population: 35500, area_sq_miles: 3.9, source: 'City Data', confidence: 'high' },
  { neighborhood: 'El Segundo', population: 16700, area_sq_miles: 5.5, source: 'City Data', confidence: 'high' },
];

// Create a lookup map for quick access
export const POPULATION_MAP = new Map<string, PopulationData>(
  POPULATION_DATA.map(data => [data.neighborhood, data])
);

/**
 * Get population data for a specific neighborhood
 */
export function getPopulation(neighborhood: string): number | null {
  const data = POPULATION_MAP.get(neighborhood);
  return data ? data.population : null;
}

/**
 * Get population density (people per square mile) for a neighborhood
 */
export function getPopulationDensity(neighborhood: string): number | null {
  const data = POPULATION_MAP.get(neighborhood);
  return data ? data.population / data.area_sq_miles : null;
}

/**
 * Get data confidence level for a neighborhood
 */
export function getDataConfidence(neighborhood: string): 'high' | 'medium' | 'low' | 'unknown' {
  const data = POPULATION_MAP.get(neighborhood);
  return data ? data.confidence : 'unknown';
}

/**
 * Calculate the total population coverage of available data
 */
export function getTotalPopulation(): number {
  return POPULATION_DATA.reduce((sum, data) => sum + data.population, 0);
}
