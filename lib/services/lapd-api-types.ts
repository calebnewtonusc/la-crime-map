// LAPD Crime Data API Types
// Based on Socrata API and NIBRS data format

export interface SocrataResponse<T> {
  data: T[]
  meta?: {
    view?: {
      id: string
      name: string
      attribution?: string
      category?: string
      description?: string
      columns?: Array<{
        id: number
        name: string
        dataTypeName: string
        fieldName: string
      }>
    }
  }
}

// Legacy Crime Data (2020-Present dataset - still available for historical data)
export interface LAPDCrimeIncident {
  dr_no: string // Division of Records Number
  date_rptd: string // Date Reported
  date_occ: string // Date Occurred
  time_occ: string // Time Occurred
  area: string // LAPD Area Code (1-21)
  area_name: string // Area Name (e.g., "Central", "Hollywood")
  rpt_dist_no: string // Reporting District
  part_1_2: string // Crime Classification (1 or 2)
  crm_cd: string // Crime Code
  crm_cd_desc: string // Crime Description
  mocodes?: string // Modus Operandi Codes
  vict_age?: string // Victim Age
  vict_sex?: string // Victim Sex
  vict_descent?: string // Victim Descent
  premis_cd?: string // Premise Code
  premis_desc?: string // Premise Description
  weapon_used_cd?: string // Weapon Used Code
  weapon_desc?: string // Weapon Description
  status?: string // Status (IC - Investigated Continue, etc.)
  status_desc?: string // Status Description
  crm_cd_1?: string // Additional Crime Code
  crm_cd_2?: string // Additional Crime Code
  crm_cd_3?: string // Additional Crime Code
  crm_cd_4?: string // Additional Crime Code
  location: string // Street Address
  cross_street?: string // Cross Street
  lat: string // Latitude
  lon: string // Longitude
}

// NIBRS Offense Data (New format since Oct 2024)
export interface NIBRSOffense {
  incident_number: string
  reported_date: string
  occurred_date: string
  incident_date: string
  area_code: string
  area_name: string
  reporting_district: string
  offense_code: string
  offense_description: string
  offense_category: string
  crime_against: string // Person, Property, Society
  location_type_code: string
  location_type_description: string
  location_latitude?: string
  location_longitude?: string
  location_street_address?: string
}

// NIBRS Victim Data
export interface NIBRSVictim {
  incident_number: string
  reported_date: string
  occurred_date: string
  area_code: string
  area_name: string
  victim_number: string
  victim_type: string // Individual, Business, etc.
  victim_age?: string
  victim_sex?: string
  victim_race?: string
  victim_ethnicity?: string
}

// Crime Categories we track
export type CrimeCategory = 'violent' | 'car_theft' | 'break_in' | 'petty_theft'

// Mapping of crime codes/descriptions to our categories
export interface CrimeCategoryMapping {
  violent: string[] // Murder, Assault, Robbery, etc.
  car_theft: string[] // Vehicle Theft, Stolen Vehicle, etc.
  break_in: string[] // Burglary, Breaking & Entering, etc.
  petty_theft: string[] // Theft, Shoplifting, Pickpocket, etc.
}

// Aggregated crime data for a neighborhood
export interface NeighborhoodCrimeData {
  neighborhoodName: string
  violentCrime: number
  carTheft: number
  breakIns: number
  pettyTheft: number
  totalCrimes: number
  lastUpdated: Date
  dataSource: 'legacy' | 'nibrs' | 'combined'
  dateRange: {
    start: Date
    end: Date
  }
  incidentCount: number // Raw number of incidents included
}

// API Query Parameters
export interface LAPDAPIQueryParams {
  $where?: string // SoQL WHERE clause
  $select?: string // SoQL SELECT clause
  $limit?: number // Number of records to return (max 50000 per request)
  $offset?: number // Offset for pagination
  $order?: string // Sort order
  $group?: string // SoQL GROUP BY clause
  $q?: string // Full text search
  $$app_token?: string // Application token (recommended for higher rate limits)
}

// Crime statistics aggregated over time
export interface CrimeTimeSeries {
  date: string
  violent: number
  carTheft: number
  breakIns: number
  pettyTheft: number
  total: number
}

// API Response with metadata
export interface LAPDAPIResponse<T> {
  data: T[]
  total: number
  lastUpdated: Date
  source: string
  dateRange: {
    start: Date
    end: Date
  }
  error?: string
}
