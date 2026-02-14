// Additional neighborhood data for apartment hunting
// Estimated rent prices, walk/bike scores, school ratings, noise levels

export interface NeighborhoodInfo {
  name: string;
  avgRent1BR: number; // Average 1BR apartment rent
  avgRent2BR: number; // Average 2BR apartment rent
  walkScore: number; // 0-100
  bikeScore: number; // 0-100
  transitScore: number; // 0-100
  schoolRating: number; // 1-10
  noiseLevel: 'Low' | 'Moderate' | 'High';
  nearAirport: boolean;
  nearFreeway: boolean;
  vibe: string[]; // Tags like 'nightlife', 'quiet', 'family-friendly', etc.
}

export const neighborhoodInfoData: Record<string, NeighborhoodInfo> = {
  'Downtown LA': {
    name: 'Downtown LA',
    avgRent1BR: 2400,
    avgRent2BR: 3200,
    walkScore: 95,
    bikeScore: 75,
    transitScore: 100,
    schoolRating: 6,
    noiseLevel: 'High',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['urban', 'nightlife', 'arts', 'business']
  },
  'Koreatown': {
    name: 'Koreatown',
    avgRent1BR: 1900,
    avgRent2BR: 2600,
    walkScore: 88,
    bikeScore: 70,
    transitScore: 90,
    schoolRating: 6,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['nightlife', 'diverse', 'food', 'urban']
  },
  'Echo Park': {
    name: 'Echo Park',
    avgRent1BR: 2100,
    avgRent2BR: 2900,
    walkScore: 85,
    bikeScore: 72,
    transitScore: 75,
    schoolRating: 7,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['hipster', 'arts', 'cafes', 'trendy']
  },
  'Silver Lake': {
    name: 'Silver Lake',
    avgRent1BR: 2300,
    avgRent2BR: 3100,
    walkScore: 82,
    bikeScore: 78,
    transitScore: 65,
    schoolRating: 7,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: false,
    vibe: ['hipster', 'quiet', 'arts', 'nature']
  },
  'Santa Monica': {
    name: 'Santa Monica',
    avgRent1BR: 3200,
    avgRent2BR: 4500,
    walkScore: 90,
    bikeScore: 88,
    transitScore: 70,
    schoolRating: 8,
    noiseLevel: 'Moderate',
    nearAirport: true,
    nearFreeway: true,
    vibe: ['beach', 'upscale', 'fitness', 'family-friendly']
  },
  'Venice': {
    name: 'Venice',
    avgRent1BR: 2900,
    avgRent2BR: 4000,
    walkScore: 92,
    bikeScore: 90,
    transitScore: 60,
    schoolRating: 7,
    noiseLevel: 'Moderate',
    nearAirport: true,
    nearFreeway: false,
    vibe: ['beach', 'bohemian', 'arts', 'touristy']
  },
  'Hollywood': {
    name: 'Hollywood',
    avgRent1BR: 2200,
    avgRent2BR: 3000,
    walkScore: 90,
    bikeScore: 72,
    transitScore: 85,
    schoolRating: 6,
    noiseLevel: 'High',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['nightlife', 'entertainment', 'touristy', 'urban']
  },
  'West Hollywood': {
    name: 'West Hollywood',
    avgRent1BR: 2600,
    avgRent2BR: 3600,
    walkScore: 92,
    bikeScore: 75,
    transitScore: 75,
    schoolRating: 7,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['nightlife', 'lgbtq', 'upscale', 'walkable']
  },
  'Beverly Hills': {
    name: 'Beverly Hills',
    avgRent1BR: 3800,
    avgRent2BR: 5500,
    walkScore: 75,
    bikeScore: 65,
    transitScore: 50,
    schoolRating: 9,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: false,
    vibe: ['upscale', 'luxury', 'quiet', 'safe']
  },
  'Culver City': {
    name: 'Culver City',
    avgRent1BR: 2500,
    avgRent2BR: 3400,
    walkScore: 78,
    bikeScore: 70,
    transitScore: 65,
    schoolRating: 8,
    noiseLevel: 'Low',
    nearAirport: true,
    nearFreeway: true,
    vibe: ['family-friendly', 'arts', 'food', 'suburban']
  },
  'Pasadena': {
    name: 'Pasadena',
    avgRent1BR: 2100,
    avgRent2BR: 2900,
    walkScore: 68,
    bikeScore: 65,
    transitScore: 60,
    schoolRating: 8,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['family-friendly', 'historic', 'quiet', 'suburban']
  },
  'Long Beach': {
    name: 'Long Beach',
    avgRent1BR: 1800,
    avgRent2BR: 2400,
    walkScore: 72,
    bikeScore: 75,
    transitScore: 55,
    schoolRating: 7,
    noiseLevel: 'Moderate',
    nearAirport: true,
    nearFreeway: true,
    vibe: ['beach', 'diverse', 'affordable', 'port']
  },
  'Glendale': {
    name: 'Glendale',
    avgRent1BR: 2000,
    avgRent2BR: 2700,
    walkScore: 70,
    bikeScore: 60,
    transitScore: 55,
    schoolRating: 7,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['family-friendly', 'suburban', 'diverse', 'safe']
  },
  'Studio City': {
    name: 'Studio City',
    avgRent1BR: 2400,
    avgRent2BR: 3300,
    walkScore: 75,
    bikeScore: 68,
    transitScore: 60,
    schoolRating: 8,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['family-friendly', 'suburban', 'entertainment', 'safe']
  },
  'Sherman Oaks': {
    name: 'Sherman Oaks',
    avgRent1BR: 2300,
    avgRent2BR: 3200,
    walkScore: 70,
    bikeScore: 65,
    transitScore: 55,
    schoolRating: 8,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['family-friendly', 'suburban', 'safe', 'quiet']
  },
  'Mar Vista': {
    name: 'Mar Vista',
    avgRent1BR: 2400,
    avgRent2BR: 3300,
    walkScore: 68,
    bikeScore: 72,
    transitScore: 50,
    schoolRating: 7,
    noiseLevel: 'Low',
    nearAirport: true,
    nearFreeway: true,
    vibe: ['family-friendly', 'suburban', 'beach-adjacent', 'quiet']
  },
  'Westwood': {
    name: 'Westwood',
    avgRent1BR: 2600,
    avgRent2BR: 3600,
    walkScore: 85,
    bikeScore: 75,
    transitScore: 70,
    schoolRating: 9,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['college', 'young', 'walkable', 'safe']
  },
  'Eagle Rock': {
    name: 'Eagle Rock',
    avgRent1BR: 1900,
    avgRent2BR: 2600,
    walkScore: 72,
    bikeScore: 68,
    transitScore: 50,
    schoolRating: 7,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['hipster', 'family-friendly', 'diverse', 'affordable']
  },
  'Highland Park': {
    name: 'Highland Park',
    avgRent1BR: 1850,
    avgRent2BR: 2500,
    walkScore: 78,
    bikeScore: 70,
    transitScore: 55,
    schoolRating: 6,
    noiseLevel: 'Low',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['hipster', 'arts', 'gentrifying', 'diverse']
  },
  'Arts District': {
    name: 'Arts District',
    avgRent1BR: 2500,
    avgRent2BR: 3400,
    walkScore: 88,
    bikeScore: 80,
    transitScore: 75,
    schoolRating: 6,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: true,
    vibe: ['arts', 'hipster', 'trendy', 'industrial']
  },
  'Inglewood': {
    name: 'Inglewood',
    avgRent1BR: 1700,
    avgRent2BR: 2300,
    walkScore: 65,
    bikeScore: 60,
    transitScore: 60,
    schoolRating: 6,
    noiseLevel: 'High',
    nearAirport: true,
    nearFreeway: true,
    vibe: ['diverse', 'affordable', 'developing', 'sports']
  }
};

// Default values for neighborhoods not in the database
export const getNeighborhoodInfo = (name: string): NeighborhoodInfo => {
  return neighborhoodInfoData[name] || {
    name,
    avgRent1BR: 2000,
    avgRent2BR: 2800,
    walkScore: 60,
    bikeScore: 55,
    transitScore: 50,
    schoolRating: 6,
    noiseLevel: 'Moderate',
    nearAirport: false,
    nearFreeway: false,
    vibe: ['urban']
  };
};
