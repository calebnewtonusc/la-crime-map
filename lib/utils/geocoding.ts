// Geocoding service for address search using Nominatim (OpenStreetMap)
// Free and open-source alternative to Google Maps Geocoding API

export interface GeocodingResult {
  lat: number
  lon: number
  display_name: string
  address: {
    road?: string
    neighbourhood?: string
    city?: string
    county?: string
    state?: string
    postcode?: string
  }
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

// Rate limiting: Store last request time to respect Nominatim usage policy (max 1 req/sec)
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second

/**
 * Geocode an address to coordinates
 * @param address - Full address or partial address
 * @returns Promise with geocoding results
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  // Rate limiting
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()

  try {
    // Add "Los Angeles" to the query if not already present
    const query = address.toLowerCase().includes('los angeles') ||
                  address.toLowerCase().includes('la,') ||
                  address.toLowerCase().includes('la ')
      ? address
      : `${address}, Los Angeles, CA`

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '1',
      countrycodes: 'us',
      'accept-language': 'en'
    })

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'LA Crime Map (Educational Project)'
      }
    })

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`)
    }

    const results = await response.json()

    if (results && results.length > 0) {
      const result = results[0]
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        address: result.address || {}
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

/**
 * Calculate distance between two points in miles using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a point is within a polygon using ray casting algorithm
 * @param lat - Latitude of the point
 * @param lon - Longitude of the point
 * @param polygon - Array of [lat, lng] coordinates defining the polygon
 * @returns true if point is inside polygon
 */
export function isPointInPolygon(
  lat: number,
  lon: number,
  polygon: number[][]
): boolean {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const latI = polygon[i][0] // latitude
    const lonI = polygon[i][1] // longitude
    const latJ = polygon[j][0]
    const lonJ = polygon[j][1]

    const intersect = ((lonI > lon) !== (lonJ > lon))
      && (lat < (latJ - latI) * (lon - lonI) / (lonJ - lonI) + latI)

    if (intersect) inside = !inside
  }

  return inside
}

/**
 * Get the bounding box for a set of coordinates
 */
export function getBoundingBox(coordinates: number[][]): {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
} {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity

  coordinates.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  })

  return { minLat, maxLat, minLng, maxLng }
}

/**
 * Get the center point of a polygon
 */
export function getPolygonCenter(coordinates: number[][]): { lat: number; lng: number } {
  let latSum = 0
  let lngSum = 0

  coordinates.forEach(([lat, lng]) => {
    latSum += lat
    lngSum += lng
  })

  return {
    lat: latSum / coordinates.length,
    lng: lngSum / coordinates.length
  }
}
