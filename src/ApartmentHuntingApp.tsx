import React, { useState, useEffect } from 'react';
import { ApartmentHuntingView } from './components/ApartmentHuntingView';
import { fetchCrimeData, NeighborhoodData } from './crimeDataService';
import { laNeighborhoods, NeighborhoodGeoJSON } from './neighborhoods';
import './App.css';
import './ApartmentHuntingApp.css';

type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
type DateRange = '1week' | '1month' | '3months' | '1year';

export const ApartmentHuntingApp: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime');
  const [dateRange, setDateRange] = useState<DateRange>('1month');
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodGeoJSON>(laNeighborhoods);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('Loading...');

  const dateRangeToWeeks = (range: DateRange): number => {
    switch (range) {
      case '1week': return 1;
      case '1month': return 4;
      case '3months': return 12;
      case '1year': return 52;
      default: return 4;
    }
  };

  useEffect(() => {
    async function loadRealCrimeData() {
      setLoading(true);
      try {
        const weeks = dateRangeToWeeks(dateRange);
        const realData = await fetchCrimeData(weeks);

        if (realData.length === 0) {
          setDataSource('Using sample data (API returned no data)');
          setLoading(false);
          return;
        }

        const crimeMap = new Map<string, NeighborhoodData>();
        realData.forEach(neighborhood => {
          crimeMap.set(neighborhood.name, neighborhood);
        });

        const updatedGeoJSON: NeighborhoodGeoJSON = {
          ...laNeighborhoods,
          features: laNeighborhoods.features.map(feature => {
            const realCrimeData = crimeMap.get(feature.properties.name);

            if (realCrimeData) {
              return {
                ...feature,
                properties: {
                  name: feature.properties.name,
                  violentCrime: realCrimeData.violentCrime,
                  carTheft: realCrimeData.carTheft,
                  breakIns: realCrimeData.breakIns,
                  pettyTheft: realCrimeData.pettyTheft
                }
              };
            } else {
              return feature;
            }
          })
        };

        setNeighborhoodData(updatedGeoJSON);
        const rangeLabel = dateRange === '1week' ? 'last week' :
                          dateRange === '1month' ? 'last month' :
                          dateRange === '3months' ? 'last 3 months' : 'last year';
        setDataSource(`Real LA Crime Data (${rangeLabel})`);

      } catch (error) {
        console.error('Error loading crime data:', error);
        setDataSource('Using sample data (API error)');
      } finally {
        setLoading(false);
      }
    }

    loadRealCrimeData();
  }, [dateRange]);

  const neighborhoods: NeighborhoodData[] = neighborhoodData.features.map(feature => feature.properties);

  const metricLabels: Record<CrimeMetric, string> = {
    violentCrime: 'Violent Crime',
    carTheft: 'Car Theft',
    breakIns: 'Break-ins',
    pettyTheft: 'Petty Theft'
  };

  return (
    <div className="apartment-hunting-app">
      <div className="app-header">
        <div className="header-content">
          <div className="brand">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <div>
              <h1>LA Apartment Finder</h1>
              <p className="subtitle">Find your perfect neighborhood with crime data, transit access, and more</p>
            </div>
          </div>
          <div className="data-info">
            {loading ? (
              <span className="loading">Loading data...</span>
            ) : (
              <span className="data-source">{dataSource}</span>
            )}
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="control-group">
          <label>Crime Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as CrimeMetric)}
            className="control-select"
          >
            {(Object.keys(metricLabels) as CrimeMetric[]).map(metric => (
              <option key={metric} value={metric}>
                {metricLabels[metric]}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Time Period:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="control-select"
          >
            <option value="1week">Last Week</option>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading neighborhood data...</p>
        </div>
      ) : (
        <ApartmentHuntingView
          neighborhoods={neighborhoods}
          neighborhoodData={neighborhoodData}
          selectedMetric={selectedMetric}
        />
      )}
    </div>
  );
};

export default ApartmentHuntingApp;
