/**
 * Data Updater Service - Uses REAL LAPD Data
 */

import { fetchLAPDCrimeData, calculateNeighborhoodStats, getAvailableAreas } from './lapd-api';
import { laNeighborhoods } from '../data/neighborhoods';

export interface DataUpdateResult {
  success: boolean;
  neighborhoodsUpdated: number;
  totalIncidents: number;
  lastUpdated: string;
  error?: string;
}

export async function updateNeighborhoodData(): Promise<DataUpdateResult> {
  try {
    console.log('📡 Fetching real LAPD crime data from data.lacity.org...');
    const incidents = await fetchLAPDCrimeData();
    console.log(`✓ Fetched ${incidents.length} real crime incidents`);

    const lapdAreas = getAvailableAreas(incidents);
    console.log(`✓ LAPD areas: ${lapdAreas.join(', ')}`);

    let updatedCount = 0;

    laNeighborhoods.features.forEach((feature) => {
      const stats = calculateNeighborhoodStats(feature.properties.name, incidents);

      if (stats.hasSufficientData) {
        feature.properties.violentCrime = stats.violentCrime;
        feature.properties.carTheft = stats.carTheft;
        feature.properties.breakIns = stats.breakIns;
        feature.properties.pettyTheft = stats.pettyTheft;
        feature.properties.lastUpdated = new Date(stats.lastUpdated);
        feature.properties.dataQualityScore = stats.dataQualityScore;
        feature.properties.hasSufficientData = true;
        updatedCount++;
        console.log(`✓ ${feature.properties.name}: ${stats.totalIncidents} incidents`);
      }
    });

    return {
      success: true,
      neighborhoodsUpdated: updatedCount,
      totalIncidents: incidents.length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      success: false,
      neighborhoodsUpdated: 0,
      totalIncidents: 0,
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
