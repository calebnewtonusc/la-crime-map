// LAPD Crime Data API - Fetch real crime data from LA City Open Data Portal
// Data source: https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8

import type { LAPDCrimeIncident, NeighborhoodCrimeData } from './lapd-api-types'

// Cache duration: 6 hours (data updates don't happen more frequently)
export const CACHE_DURATION = 6 * 60 * 60 * 1000

// Available LAPD areas (21 divisions)
export const LAPD_AREAS = [
  'Central', 'Rampart', 'Southwest', 'Hollenbeck', 'Harbor', 'Hollywood',
  'Wilshire', 'West LA', 'Van Nuys', 'West Valley', 'Northeast', '77th Street',
  'Newton', 'Pacific', 'N Hollywood', 'Foothill', 'Devonshire', 'Southeast',
  'Mission', 'Olympic', 'Topanga'
]

// Crime code mappings based on FBI UCR classifications
const VIOLENT_CRIME_CODES = [
  '110', '113', '121', '122', '210', '220', '230', '231', '235', '236', '250', '251', '761',
]

const CAR_THEFT_CODES = ['510', '520']

const BREAK_IN_CODES = ['310', '320']

const PETTY_THEFT_CODES = [
  '330', '331', '410', '420', '421', '440', '441', '442', '443', '450', '451', '452', '470', '473', '474', '480', '485',
]

/**
 * Fetch crime data from LAPD Open Data Portal
 *
 * CRITICAL FIX: Use recent AVAILABLE data, not future dates!
 * The dataset is "Crime Data from 2020 to Present" but has a lag.
 * Latest data is typically 30-60 days behind current date.
 */
export async function fetchLAPDCrimeData(
  startDate?: string,
  endDate?: string,
  limit: number = 50000
): Promise<LAPDCrimeIncident[]> {
  const baseUrl = 'https://data.lacity.org/resource/2nrs-mtv8.json'

  // CRITICAL FIX: Use recent data that actually exists
  // Dataset has data through late 2024, not into 2026
  // Default to last 90 days of 2024 to ensure we get data
  const defaultEnd = '2024-12-31'
  const defaultStart = '2024-10-01' // 90 days of recent data

  const end = endDate || defaultEnd
  const start = startDate || defaultStart

  const params = new URLSearchParams({
    '$limit': limit.toString(),
    '$where': `date_occ between '${start}T00:00:00' and '${end}T23:59:59'`,
    '$order': 'date_occ DESC',
  })

  const url = `${baseUrl}?${params.toString()}`

  console.log(`[LAPD API] Fetching data from ${start} to ${end}`)

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`LAPD API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`[LAPD API] Fetched ${data.length} incidents`)

  return data
}

export function calculateNeighborhoodStats(
  neighborhoodName: string,
  incidents: LAPDCrimeIncident[]
): NeighborhoodCrimeData {
  const neighborhoodIncidents = incidents.filter(
    (incident) => incident.area_name?.toLowerCase() === neighborhoodName.toLowerCase()
  )

  let violentCrime = 0
  let carTheft = 0
  let breakIns = 0
  let pettyTheft = 0

  neighborhoodIncidents.forEach((incident) => {
    const crimeCode = incident.crm_cd
    if (VIOLENT_CRIME_CODES.includes(crimeCode)) violentCrime++
    else if (CAR_THEFT_CODES.includes(crimeCode)) carTheft++
    else if (BREAK_IN_CODES.includes(crimeCode)) breakIns++
    else if (PETTY_THEFT_CODES.includes(crimeCode)) pettyTheft++
  })

  // CRITICAL FIX: No more fake "monthly average" division
  // Show ACTUAL counts from the time period
  return {
    neighborhoodName,
    violentCrime, // Actual count, not divided
    carTheft, // Actual count, not divided
    breakIns, // Actual count, not divided
    pettyTheft, // Actual count, not divided
    totalCrimes: violentCrime + carTheft + breakIns + pettyTheft,
    lastUpdated: new Date(),
    dataSource: 'legacy' as const,
    dateRange: {
      start: new Date('2024-10-01'),
      end: new Date('2024-12-31'),
    },
    incidentCount: neighborhoodIncidents.length,
  }
}

export function getAvailableAreas(): string[] {
  return LAPD_AREAS
}
