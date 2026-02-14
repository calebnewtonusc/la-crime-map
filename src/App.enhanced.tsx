import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { laNeighborhoods, NeighborhoodGeoJSON } from './neighborhoods';
import { fetchCrimeData, NeighborhoodData, clearCrimeCache, DataFetchResult } from './crimeDataService.enhanced';
import { debounce } from './utils/debounce';
import { getColorMemoized } from './utils/optimizedGeoJSON';
import MapSkeleton from './components/MapSkeleton';
import { DataVisualization } from './DataVisualization';
import NetworkStatus from './components/NetworkStatus';
import ErrorDisplay, { StaleDataWarning, InlineError } from './components/ErrorDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import { useNetworkStatus } from './utils/networkStatus';

// Lazy load the map component for better initial load performance
const CrimeMap = lazy(() => import('./components/CrimeMap'));

// Crime metrics type
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
type DateRange = '1week' | '1month' | '3months' | '1year';
type SortOption = 'alphabetical' | 'crimeRate';
type ViewMode = 'map' | 'analytics';

// LocalStorage keys
const STORAGE_KEYS = {
  METRIC: 'la-crime-map-metric',
  DATE_RANGE: 'la-crime-map-date-range',
  SEVERITY_THRESHOLD: 'la-crime-map-severity',
  SORT_OPTION: 'la-crime-map-sort',
  SEARCH: 'la-crime-map-search',
};

// LocalStorage helpers
const loadPreference = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const savePreference = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save preference:', error);
  }
};

function App() {
  // Network status
  const networkInfo = useNetworkStatus();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // Load preferences from localStorage
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>(
    () => loadPreference(STORAGE_KEYS.METRIC, 'violentCrime')
  );
  const [dateRange, setDateRange] = useState<DateRange>(
    () => loadPreference(STORAGE_KEYS.DATE_RANGE, '1month')
  );
  const [severityThreshold, setSeverityThreshold] = useState<number>(
    () => loadPreference(STORAGE_KEYS.SEVERITY_THRESHOLD, 0)
  );
  const [sortOption, setSortOption] = useState<SortOption>(
    () => loadPreference(STORAGE_KEYS.SORT_OPTION, 'crimeRate')
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    () => loadPreference(STORAGE_KEYS.SEARCH, '')
  );
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);

  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodGeoJSON>(laNeighborhoods);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('Loading...');
  const [dataError, setDataError] = useState<string | null>(null);
  const [isStaleData, setIsStaleData] = useState<boolean>(false);
  const [statsPanelOpen, setStatsPanelOpen] = useState<boolean>(false);

  // Save preferences to localStorage when they change
  useEffect(() => {
    savePreference(STORAGE_KEYS.METRIC, selectedMetric);
  }, [selectedMetric]);

  useEffect(() => {
    savePreference(STORAGE_KEYS.DATE_RANGE, dateRange);
  }, [dateRange]);

  useEffect(() => {
    savePreference(STORAGE_KEYS.SEVERITY_THRESHOLD, severityThreshold);
  }, [severityThreshold]);

  useEffect(() => {
    savePreference(STORAGE_KEYS.SORT_OPTION, sortOption);
  }, [sortOption]);

  useEffect(() => {
    savePreference(STORAGE_KEYS.SEARCH, searchQuery);
  }, [searchQuery]);

  // Map date range to weeks
  const dateRangeToWeeks = (range: DateRange): number => {
    switch (range) {
      case '1week': return 1;
      case '1month': return 4;
      case '3months': return 12;
      case '1year': return 52;
      default: return 4;
    }
  };

  // Fetch real crime data on mount or when date range changes
  useEffect(() => {
    async function loadRealCrimeData() {
      setLoading(true);
      setDataError(null);

      try {
        console.log('Fetching crime data (with caching and retry logic)...');
        const weeks = dateRangeToWeeks(dateRange);
        const result: DataFetchResult = await fetchCrimeData(weeks);

        if (result.data.length === 0) {
          setDataSource('Using sample data (No data available)');
          setDataError('No crime data available');
          setIsStaleData(true);
          setLoading(false);
          return;
        }

        console.log(`Got ${result.data.length} neighborhoods with crime data`);

        // Create a map of neighborhood name to crime stats
        const crimeMap = new Map<string, NeighborhoodData>();
        result.data.forEach(neighborhood => {
          crimeMap.set(neighborhood.name, neighborhood);
        });

        // Update GeoJSON properties with real data
        const updatedGeoJSON: NeighborhoodGeoJSON = {
          ...laNeighborhoods,
          features: laNeighborhoods.features.map(feature => {
            const realCrimeData = crimeMap.get(feature.properties.name);

            if (realCrimeData) {
              // Use real data
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
              // Keep mock data if no real data available
              return feature;
            }
          })
        };

        setNeighborhoodData(updatedGeoJSON);

        // Set data source message
        let sourceMessage = '';
        const rangeLabel = dateRange === '1week' ? 'last week' :
                          dateRange === '1month' ? 'last month' :
                          dateRange === '3months' ? 'last 3 months' : 'last year';

        switch (result.source) {
          case 'api':
            sourceMessage = `Real LA Crime Data (${rangeLabel})`;
            break;
          case 'cache':
            sourceMessage = `Cached Data (${rangeLabel})`;
            break;
          case 'stale-cache':
            sourceMessage = `Cached Data - May be outdated (${rangeLabel})`;
            break;
          case 'fallback':
            sourceMessage = `Sample Data (${rangeLabel})`;
            break;
        }

        setDataSource(sourceMessage);
        setIsStaleData(result.isStale);

        if (result.error) {
          setDataError(result.error);
        }

        console.log('Successfully loaded crime data');

      } catch (error) {
        console.error('Error loading crime data:', error);
        setDataSource('Using sample data (API error)');
        setDataError(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsStaleData(true);
      } finally {
        setLoading(false);
      }
    }

    loadRealCrimeData();
  }, [dateRange]);

  // Extract neighborhood data from GeoJSON for the stats panel
  const neighborhoods: NeighborhoodData[] = useMemo(
    () => neighborhoodData.features.map(feature => feature.properties),
    [neighborhoodData]
  );

  // Filter and sort neighborhoods based on user preferences
  const filteredAndSortedNeighborhoods = useMemo(() => {
    let filtered = neighborhoods;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(query)
      );
    }

    // Apply severity threshold filter
    if (severityThreshold > 0) {
      filtered = filtered.filter(n =>
        (n[selectedMetric] || 0) >= severityThreshold
      );
    }

    // Apply sorting
    if (sortOption === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by crime rate (descending)
      filtered = [...filtered].sort((a, b) =>
        (b[selectedMetric] || 0) - (a[selectedMetric] || 0)
      );
    }

    return filtered;
  }, [neighborhoods, searchQuery, severityThreshold, sortOption, selectedMetric]);

  // Debounced hover handler for better performance
  const handleHover = useMemo(
    () => debounce((name: string | null) => {
      setHoveredNeighborhood(name);
    }, 50),
    []
  );

  // Handle neighborhood selection for compare mode
  const toggleNeighborhoodSelection = useCallback((name: string) => {
    if (!compareMode) return;

    setSelectedNeighborhoods(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else if (prev.length < 3) {
        return [...prev, name];
      } else {
        // Replace the first selected if at max capacity
        return [...prev.slice(1), name];
      }
    });
  }, [compareMode]);

  // Toggle compare mode
  const handleCompareModeToggle = useCallback(() => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setSelectedNeighborhoods([]);
    }
  }, [compareMode]);

  // Get comparison data
  const comparisonData = useMemo(() => {
    return selectedNeighborhoods.map(name =>
      neighborhoods.find(n => n.name === name)
    ).filter(Boolean) as NeighborhoodData[];
  }, [selectedNeighborhoods, neighborhoods]);

  const metricLabels: Record<CrimeMetric, string> = {
    violentCrime: 'Violent Crime',
    carTheft: 'Car Theft',
    breakIns: 'Break-ins',
    pettyTheft: 'Petty Theft'
  };

  // Memoized color function using optimized utility
  const getColor = useCallback((value: number, metric: CrimeMetric): string => {
    return getColorMemoized(value, metric);
  }, []);

  // Handler to force refresh cache
  const handleRefreshData = useCallback(() => {
    clearCrimeCache();
    window.location.reload();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>LA Crime Map</h1>
            <p>Visualize crime by neighborhood</p>
            <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.8 }}>
              {loading ? 'Loading data...' : `Data: ${dataSource}`}
              {!loading && (
                <button
                  onClick={handleRefreshData}
                  style={{
                    marginLeft: '10px',
                    fontSize: '0.8em',
                    padding: '2px 8px',
                    cursor: 'pointer'
                  }}
                  title="Clear cache and refresh data"
                >
                  Refresh
                </button>
              )}
            </p>
          </div>
          <NetworkStatus showDetails={true} />
        </div>
      </div>

      {/* Error Display */}
      {dataError && !loading && (
        <ErrorDisplay
          type={isStaleData ? 'warning' : 'error'}
          message={dataError}
          actions={[
            {
              label: 'Retry',
              onClick: handleRefreshData,
              primary: true
            },
            {
              label: 'Dismiss',
              onClick: () => setDataError(null)
            }
          ]}
          onDismiss={() => setDataError(null)}
        />
      )}

      {/* Stale Data Warning */}
      {isStaleData && !dataError && !loading && (
        <StaleDataWarning
          message="Data may be outdated. You are viewing cached or sample information."
          onRefresh={handleRefreshData}
        />
      )}

      {/* Offline Mode Warning */}
      {!networkInfo.isOnline && (
        <ErrorDisplay
          type="warning"
          title="Offline Mode"
          message="You're currently offline. Displaying cached data. Some features may be limited."
          onDismiss={() => {}}
        />
      )}

      {/* View Mode Tabs */}
      <div className="view-mode-tabs">
        <button
          className={`tab-button ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          Map View
        </button>
        <button
          className={`tab-button ${viewMode === 'analytics' ? 'active' : ''}`}
          onClick={() => setViewMode('analytics')}
        >
          Analytics Dashboard
        </button>
      </div>

      <ErrorBoundary>
        {viewMode === 'analytics' ? (
          <DataVisualization
            neighborhoods={neighborhoods}
            selectedMetric={selectedMetric}
          />
        ) : (
          <>
            <div className="controls-container">
              {/* Search Bar */}
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search neighborhoods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Date Range Selector */}
              <div className="date-range-selector">
                <label>Time Period:</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="date-select"
                >
                  <option value="1week">Last Week</option>
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>

              {/* Severity Threshold Filter */}
              <div className="severity-filter">
                <label>Min Severity: {severityThreshold}</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={severityThreshold}
                  onChange={(e) => setSeverityThreshold(Number(e.target.value))}
                  className="severity-slider"
                />
              </div>

              {/* Sort Options */}
              <div className="sort-selector">
                <label>Sort By:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="sort-select"
                >
                  <option value="crimeRate">Crime Rate</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              {/* Compare Mode Toggle */}
              <button
                className={`compare-toggle ${compareMode ? 'active' : ''}`}
                onClick={handleCompareModeToggle}
              >
                {compareMode ? 'Exit Compare' : 'Compare Mode'}
              </button>
            </div>

            <div className="metric-selector">
              {(Object.keys(metricLabels) as CrimeMetric[]).map(metric => (
                <button
                  key={metric}
                  className={selectedMetric === metric ? 'active' : ''}
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metricLabels[metric]}
                </button>
              ))}
            </div>

            <div className="map-container">
              <ErrorBoundary fallback={
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <ErrorDisplay
                    type="error"
                    title="Map Error"
                    message="The map failed to load. Please try refreshing the page."
                    actions={[
                      { label: 'Reload Page', onClick: () => window.location.reload(), primary: true }
                    ]}
                  />
                </div>
              }>
                <Suspense fallback={<MapSkeleton />}>
                  <CrimeMap
                    neighborhoodData={neighborhoodData}
                    selectedMetric={selectedMetric}
                    onHover={handleHover}
                    getColor={getColor}
                  />
                </Suspense>
              </ErrorBoundary>

              {/* Mobile Stats Panel Toggle Button */}
              <button
                className="stats-panel-toggle"
                onClick={() => setStatsPanelOpen(!statsPanelOpen)}
                aria-label="Toggle statistics panel"
              >
                {statsPanelOpen ? '✕' : '☰'}
              </button>

              <div className={`stats-panel ${statsPanelOpen ? 'open' : ''}`}>
                <div className="stats-panel-header">
                  <h3>Current Metric: {metricLabels[selectedMetric]}</h3>
                  <button
                    className="stats-panel-close"
                    onClick={() => setStatsPanelOpen(false)}
                    aria-label="Close statistics panel"
                  >
                    ✕
                  </button>
                </div>

                {compareMode && selectedNeighborhoods.length > 0 ? (
                  // Compare Mode View
                  <div className="compare-view">
                    <h3>Compare Neighborhoods ({selectedNeighborhoods.length}/3)</h3>
                    <p className="compare-hint">Click neighborhoods on the map to compare (max 3)</p>

                    {comparisonData.length > 0 && (
                      <div className="comparison-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Metric</th>
                              {comparisonData.map(n => (
                                <th key={n.name}>{n.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Violent Crime</td>
                              {comparisonData.map(n => (
                                <td key={n.name}>{n.violentCrime}/wk</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Car Theft</td>
                              {comparisonData.map(n => (
                                <td key={n.name}>{n.carTheft}/wk</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Break-ins</td>
                              {comparisonData.map(n => (
                                <td key={n.name}>{n.breakIns}/wk</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Petty Theft</td>
                              {comparisonData.map(n => (
                                <td key={n.name}>{n.pettyTheft}/wk</td>
                              ))}
                            </tr>
                            <tr className="total-row">
                              <td><strong>Total</strong></td>
                              {comparisonData.map(n => (
                                <td key={n.name}>
                                  <strong>
                                    {n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft}/wk
                                  </strong>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {selectedNeighborhoods.length > 0 && (
                      <button
                        className="clear-selection"
                        onClick={() => setSelectedNeighborhoods([])}
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>
                ) : (
                  // Normal View
                  <>
                    {searchQuery && (
                      <p className="search-results">
                        Showing {filteredAndSortedNeighborhoods.length} of {neighborhoods.length} neighborhoods
                      </p>
                    )}

                    <div className="legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#00ff00' }}></span>
                        <span>Low</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#ffff00' }}></span>
                        <span>Moderate</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#ff9900' }}></span>
                        <span>High</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#ff0000' }}></span>
                        <span>Very High</span>
                      </div>
                    </div>

                    <div className="neighborhood-list">
                      {filteredAndSortedNeighborhoods.length > 0 ? (
                        filteredAndSortedNeighborhoods.map(n => (
                          <div
                            key={n.name}
                            id={`neighborhood-${n.name.replace(/\s+/g, '-')}`}
                            className={`neighborhood-item ${hoveredNeighborhood === n.name ? 'highlighted' : ''}`}
                            style={{
                              borderLeft: `4px solid ${getColor(n[selectedMetric] || 0, selectedMetric)}`
                            }}
                            onClick={() => {
                              const element = document.getElementById(`neighborhood-${n.name.replace(/\s+/g, '-')}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                              }
                            }}
                          >
                            <span className="neighborhood-name">{n.name}</span>
                            <span className="crime-value">{n[selectedMetric] || 0} per week</span>
                          </div>
                        ))
                      ) : (
                        <p className="no-results">No neighborhoods match your filters</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
