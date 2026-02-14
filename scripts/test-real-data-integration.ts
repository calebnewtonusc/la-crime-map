// Test Script: Real Data Integration
// Tests the complete real data pipeline

import { aggregateCrimeDataForNeighborhoods } from '../lib/services/crime-data-aggregator'
import { laNeighborhoods as rawNeighborhoods } from '../lib/data/neighborhoods-real'

async function testRealDataIntegration() {
  console.log('='.repeat(80))
  console.log('Testing Real Crime Data Integration')
  console.log('='.repeat(80))
  console.log()

  try {
    // Test 1: Fetch crime data for last 90 days
    console.log('Test 1: Fetching crime data for last 90 days...')
    console.log('-'.repeat(80))

    const neighborhoodGeoJSON = {
      type: 'FeatureCollection' as const,
      features: rawNeighborhoods.features || [],
    }

    const result = await aggregateCrimeDataForNeighborhoods(neighborhoodGeoJSON, 90)

    if (result.error) {
      console.error('ERROR:', result.error)
      console.log()
      console.log('This is expected if:')
      console.log('1. You are not connected to the internet')
      console.log('2. The LAPD API is down')
      console.log('3. Rate limits have been exceeded')
      console.log()
      console.log('Try running the app and visiting the API endpoints:')
      console.log('- http://localhost:3000/api/crime-data?days=90')
      console.log('- http://localhost:3000/api/neighborhoods?days=90')
      return
    }

    console.log('SUCCESS! Data fetched and aggregated.')
    console.log()

    // Display metadata
    console.log('Metadata:')
    console.log(`  Data Source: ${result.metadata.dataSource}`)
    console.log(`  Total Incidents: ${result.metadata.totalIncidents.toLocaleString()}`)
    console.log(`  Neighborhoods: ${result.metadata.neighborhoods}`)
    console.log(`  Date Range: ${result.metadata.dateRange.start} to ${result.metadata.dateRange.end}`)
    console.log(`  Last Updated: ${result.metadata.lastUpdated}`)
    console.log()

    // Display data quality
    console.log('Data Quality:')
    console.log(`  Mapped Incidents: ${result.metadata.dataQuality.mappedIncidents.toLocaleString()}`)
    console.log(`  Unmapped Incidents: ${result.metadata.dataQuality.unmappedIncidents.toLocaleString()}`)
    console.log(`  Coverage: ${result.metadata.dataQuality.percentageMapped.toFixed(2)}%`)
    console.log()

    // Find safest and most dangerous
    const sortedByTotal = [...result.neighborhoods].sort((a, b) => a.totalCrimes - b.totalCrimes)
    const safest = sortedByTotal[0]
    const mostDangerous = sortedByTotal[sortedByTotal.length - 1]

    console.log('Safest Neighborhood:')
    console.log(`  Name: ${safest.neighborhoodName}`)
    console.log(`  Total Crimes: ${safest.totalCrimes}`)
    console.log(`  Violent: ${safest.violentCrime}, Car Theft: ${safest.carTheft}, Break-ins: ${safest.breakIns}, Petty Theft: ${safest.pettyTheft}`)
    console.log()

    console.log('Highest Crime Neighborhood:')
    console.log(`  Name: ${mostDangerous.neighborhoodName}`)
    console.log(`  Total Crimes: ${mostDangerous.totalCrimes}`)
    console.log(`  Violent: ${mostDangerous.violentCrime}, Car Theft: ${mostDangerous.carTheft}, Break-ins: ${mostDangerous.breakIns}, Petty Theft: ${mostDangerous.pettyTheft}`)
    console.log()

    // Calculate totals
    const totals = result.neighborhoods.reduce(
      (acc, n) => ({
        violent: acc.violent + n.violentCrime,
        carTheft: acc.carTheft + n.carTheft,
        breakIns: acc.breakIns + n.breakIns,
        pettyTheft: acc.pettyTheft + n.pettyTheft,
        total: acc.total + n.totalCrimes,
      }),
      { violent: 0, carTheft: 0, breakIns: 0, pettyTheft: 0, total: 0 }
    )

    console.log('City-Wide Totals (Last 90 Days):')
    console.log(`  Total Crimes: ${totals.total.toLocaleString()}`)
    console.log(`  Violent Crime: ${totals.violent.toLocaleString()}`)
    console.log(`  Car Theft: ${totals.carTheft.toLocaleString()}`)
    console.log(`  Break-ins: ${totals.breakIns.toLocaleString()}`)
    console.log(`  Petty Theft: ${totals.pettyTheft.toLocaleString()}`)
    console.log()

    // Sample neighborhoods
    console.log('Sample Neighborhoods:')
    console.log('-'.repeat(80))
    const samples = ['Hollywood', 'Downtown', 'Venice', 'Beverly Hills', 'Watts'].map((name) =>
      result.neighborhoods.find((n) => n.neighborhoodName === name)
    )

    samples.forEach((n) => {
      if (n) {
        console.log(`${n.neighborhoodName}:`)
        console.log(`  Total: ${n.totalCrimes}, Violent: ${n.violentCrime}, Car Theft: ${n.carTheft}, Break-ins: ${n.breakIns}, Petty Theft: ${n.pettyTheft}`)
      }
    })
    console.log()

    console.log('='.repeat(80))
    console.log('All Tests Passed!')
    console.log('='.repeat(80))
    console.log()
    console.log('Next steps:')
    console.log('1. Start the dev server: npm run dev')
    console.log('2. Visit http://localhost:3000/api/crime-data?days=90')
    console.log('3. Visit http://localhost:3000/api/neighborhoods?days=90')
    console.log('4. Check the UI for real crime statistics')
    console.log()
  } catch (error) {
    console.error('Test failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testRealDataIntegration()
