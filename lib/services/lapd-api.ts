/**
 * LAPD Open Data API Integration
 *
 * Fetches REAL crime data from LA City Open Data Portal
 * Endpoint: https://data.lacity.org/resource/2nrs-mtv8.json
 *
 * Dataset: Crime Data from 2020 to Present
 * Source: Los Angeles Police Department via Socrata Open Data API (SODA)
 */

export interface LAPDCrimeIncident {
  dr_no: string; // Division of Records Number (unique ID)
  date_rptd: string; // Date reported
  date_occ: string; // Date occurred
  time_occ: string; // Time occurred (24hr format)
  area: string; // LAPD Area ID
  area_name: string; // Geographic Area name
  rpt_dist_no: string; // Reporting District
  part_1_2: string; // Crime classification (Part 1 or Part 2)
  crm_cd: string; // Crime Code
  crm_cd_desc: string; // Crime Code Description
  mocodes: string; // Modus Operandi
  vict_age: string; // Victim Age
  vict_sex: string; // Victim Sex
  vict_descent: string; // Victim Descent
  premis_cd: string; // Premise Code
  premis_desc: string; // Premise Description
  weapon_used_cd: string; // Weapon Used Code
  weapon_desc: string; // Weapon Description
  status: string; // Status (IC: Invest Cont, AA: Adult Arrest, etc.)
  status_desc: string; // Status Description
  crm_cd_1: string; // Crime Code 1
  crm_cd_2: string; // Crime Code 2
  crm_cd_3: string; // Crime Code 3
  crm_cd_4: string; // Crime Code 4
  location: string; // Address
  cross_street: string; // Cross Street
  lat: string; // Latitude
  lon: string; // Longitude
}

export interface NeighborhoodCrimeStats {
  neighborhoodName: string;
  violentCrime: number;
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
  totalIncidents: number;
  lastUpdated: string;
  dataQualityScore: number;
  hasSufficientData: boolean;
  trendIndicator: 'improving' | 'worsening' | 'stable' | 'insufficient_data';
}

// Crime code mappings based on FBI UCR classifications
const VIOLENT_CRIME_CODES = [
  '110', '113', '121', '122', '210', '220', '230', '231', '235', '236', '250', '251', '761',
];

const CAR_THEFT_CODES = ['510', '520'];

const BREAK_IN_CODES = ['310', '320'];

const PETTY_THEFT_CODES = [
  '330', '331', '410', '420', '421', '440', '441', '442', '443', '450', '451', '452', '470', '473', '474', '480', '485',
];

export async function fetchLAPDCrimeData(
  startDate?: string,
  endDate?: string,
  limit: number = 50000
): Promise<LAPDCrimeIncident[]> {
  const baseUrl = 'https://data.lacity.org/resource/2nrs-mtv8.json';
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const params = new URLSearchParams({
    '$limit': limit.toString(),
    '$where': `date_occ between '${start}T00:00:00' and '${end}T23:59:59'`,
    '$order': 'date_occ DESC',
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`LAPD API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export function calculateNeighborhoodStats(
  neighborhoodName: string,
  incidents: LAPDCrimeIncident[]
): NeighborhoodCrimeStats {
  const neighborhoodIncidents = incidents.filter(
    (incident) => incident.area_name?.toLowerCase() === neighborhoodName.toLowerCase()
  );

  let violentCrime = 0;
  let carTheft = 0;
  let breakIns = 0;
  let pettyTheft = 0;

  neighborhoodIncidents.forEach((incident) => {
    const crimeCode = incident.crm_cd;
    if (VIOLENT_CRIME_CODES.includes(crimeCode)) violentCrime++;
    else if (CAR_THEFT_CODES.includes(crimeCode)) carTheft++;
    else if (BREAK_IN_CODES.includes(crimeCode)) breakIns++;
    else if (PETTY_THEFT_CODES.includes(crimeCode)) pettyTheft++;
  });

  const monthlyDivisor = 12;

  return {
    neighborhoodName,
    violentCrime: Math.round(violentCrime / monthlyDivisor),
    carTheft: Math.round(carTheft / monthlyDivisor),
    breakIns: Math.round(breakIns / monthlyDivisor),
    pettyTheft: Math.round(pettyTheft / monthlyDivisor),
    totalIncidents: neighborhoodIncidents.length,
    lastUpdated: new Date().toISOString(),
    dataQualityScore: neighborhoodIncidents.length >= 100 ? 1.0 : neighborhoodIncidents.length / 100,
    hasSufficientData: neighborhoodIncidents.length >= 50,
    trendIndicator: 'insufficient_data',
  };
}

export function getAvailableAreas(incidents: LAPDCrimeIncident[]): string[] {
  const areas = new Set<string>();
  incidents.forEach((incident) => {
    if (incident.area_name) areas.add(incident.area_name);
  });
  return Array.from(areas).sort();
}

export const CACHE_DURATION = 6 * 60 * 60 * 1000;
