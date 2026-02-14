/**
 * Data Updater Service - Uses REAL LAPD Data
 */

import { fetchLAPDCrimeData, calculateNeighborhoodStats, getAvailableAreas } from './lapd-api';
import { laNeighborhoods } from '../data/neighborhoods';
import { logger } from '../utils/logger';

export interface DataUpdateResult {
  success: boolean;
  neighborhoodsUpdated: number;
  totalIncidents: number;
  lastUpdated: string;
  error?: string;
}

export async function updateNeighborhoodData(): Promise<DataUpdateResult> {
  try {
    logger.info('📡 Fetching real LAPD crime data from data.lacity.org...');
    const incidents = await fetchLAPDCrimeData();
    logger.info(`✓ Fetched ${incidents.length} real crime incidents`);

    const lapdAreas = getAvailableAreas();
    logger.info(`✓ LAPD areas: ${lapdAreas.join(', ')}`);

    let updatedCount = 0;

    laNeighborhoods.features.forEach((feature) => {
      const stats = calculateNeighborhoodStats(feature.properties.name, incidents);

      // Update with real data (minimum 10 incidents for reliability)
      if (stats.incidentCount >= 10) {
        feature.properties.violentCrime = stats.violentCrime;
        feature.properties.carTheft = stats.carTheft;
        feature.properties.breakIns = stats.breakIns;
        feature.properties.pettyTheft = stats.pettyTheft;
        feature.properties.lastUpdated = stats.lastUpdated;
        feature.properties.dataQualityScore = stats.incidentCount >= 100 ? 1.0 : stats.incidentCount / 100;
        feature.properties.hasSufficientData = stats.incidentCount >= 50;
        updatedCount++;
        logger.info(`✓ ${feature.properties.name}: ${stats.incidentCount} incidents`);
      }
    });

    return {
      success: true,
      neighborhoodsUpdated: updatedCount,
      totalIncidents: incidents.length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('❌ Error:', error);
    return {
      success: false,
      neighborhoodsUpdated: 0,
      totalIncidents: 0,
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
