// LA Metro Transit Data - Stations and Lines
// Data based on LA Metro system (approximate coordinates)

export interface MetroStation {
  name: string;
  line: string[];
  lat: number;
  lon: number;
  type: 'rail' | 'bus_rapid';
}

export const metroStations: MetroStation[] = [
  // Red Line (B Line)
  { name: 'Union Station', line: ['Red', 'Purple', 'Gold'], lat: 34.0560, lon: -118.2340, type: 'rail' },
  { name: 'Civic Center/Grand Park', line: ['Red', 'Purple'], lat: 34.0570, lon: -118.2468, type: 'rail' },
  { name: 'Pershing Square', line: ['Red', 'Purple'], lat: 34.0488, lon: -118.2518, type: 'rail' },
  { name: 'Westlake/MacArthur Park', line: ['Red', 'Purple'], lat: 34.0576, lon: -118.2765, type: 'rail' },
  { name: 'Vermont/Beverly', line: ['Red'], lat: 34.0720, lon: -118.2917, type: 'rail' },
  { name: 'Vermont/Santa Monica', line: ['Red'], lat: 34.0900, lon: -118.2913, type: 'rail' },
  { name: 'Hollywood/Vine', line: ['Red'], lat: 34.1016, lon: -118.3267, type: 'rail' },
  { name: 'Hollywood/Highland', line: ['Red'], lat: 34.1024, lon: -118.3389, type: 'rail' },
  { name: 'Universal City/Studio City', line: ['Red'], lat: 34.1386, lon: -118.3534, type: 'rail' },
  { name: 'North Hollywood', line: ['Red'], lat: 34.1688, lon: -118.3770, type: 'rail' },

  // Purple Line (D Line)
  { name: 'Wilshire/Vermont', line: ['Purple'], lat: 34.0653, lon: -118.2918, type: 'rail' },
  { name: 'Wilshire/Normandie', line: ['Purple'], lat: 34.0622, lon: -118.3001, type: 'rail' },
  { name: 'Wilshire/Western', line: ['Purple'], lat: 34.0619, lon: -118.3097, type: 'rail' },

  // Blue Line (A Line)
  { name: '7th Street/Metro Center', line: ['Red', 'Purple', 'Blue', 'Expo'], lat: 34.0480, lon: -118.2585, type: 'rail' },
  { name: 'Pico', line: ['Blue', 'Expo'], lat: 34.0424, lon: -118.2666, type: 'rail' },
  { name: 'Grand/LATTC', line: ['Blue'], lat: 34.0088, lon: -118.2729, type: 'rail' },
  { name: 'San Pedro Street', line: ['Blue'], lat: 33.9973, lon: -118.2730, type: 'rail' },
  { name: 'Washington', line: ['Blue'], lat: 33.9889, lon: -118.2727, type: 'rail' },
  { name: 'Vernon', line: ['Blue'], lat: 33.9778, lon: -118.2723, type: 'rail' },
  { name: 'Slauson', line: ['Blue'], lat: 33.9689, lon: -118.2720, type: 'rail' },
  { name: 'Florence', line: ['Blue'], lat: 33.9601, lon: -118.2718, type: 'rail' },
  { name: 'Firestone', line: ['Blue'], lat: 33.9520, lon: -118.2716, type: 'rail' },
  { name: 'Long Beach', line: ['Blue'], lat: 33.7708, lon: -118.1939, type: 'rail' },

  // Expo Line (E Line)
  { name: 'Expo/Crenshaw', line: ['Expo'], lat: 34.0183, lon: -118.3416, type: 'rail' },
  { name: 'Expo/Western', line: ['Expo'], lat: 34.0185, lon: -118.3088, type: 'rail' },
  { name: 'Expo/Vermont', line: ['Expo'], lat: 34.0185, lon: -118.2918, type: 'rail' },
  { name: 'Expo Park/USC', line: ['Expo'], lat: 34.0182, lon: -118.2853, type: 'rail' },
  { name: 'Santa Monica', line: ['Expo'], lat: 34.0139, lon: -118.4914, type: 'rail' },

  // Gold Line (L Line)
  { name: 'Chinatown', line: ['Gold'], lat: 34.0634, lon: -118.2357, type: 'rail' },
  { name: 'Little Tokyo/Arts District', line: ['Gold'], lat: 34.0505, lon: -118.2377, type: 'rail' },
  { name: 'Pasadena', line: ['Gold'], lat: 34.1456, lon: -118.1512, type: 'rail' },

  // Green Line (C Line)
  { name: 'Norwalk', line: ['Green'], lat: 33.9222, lon: -118.0817, type: 'rail' },
  { name: 'Redondo Beach', line: ['Green'], lat: 33.8450, lon: -118.3764, type: 'rail' },
];

export interface BusLine {
  number: string;
  name: string;
  type: 'rapid' | 'local';
}

export const majorBusLines: BusLine[] = [
  { number: '720', name: 'Wilshire Rapid', type: 'rapid' },
  { number: '750', name: 'Ventura Rapid', type: 'rapid' },
  { number: '760', name: 'Long Beach Rapid', type: 'rapid' },
  { number: '780', name: 'Santa Monica Rapid', type: 'rapid' },
  { number: '4', name: 'Santa Monica', type: 'local' },
  { number: '20', name: 'Wilshire', type: 'local' },
  { number: '33', name: 'Venice', type: 'local' },
  { number: '16', name: '3rd Street', type: 'local' },
  { number: '2', name: 'Sunset', type: 'local' },
];
