import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { laNeighborhoods, NeighborhoodGeoJSON } from './neighborhoods';
import { fetchCrimeData, NeighborhoodData, clearCrimeCache } from './crimeDataService';
import { debounce } from './utils/debounce';
import { getColorMemoized } from './utils/optimizedGeoJSON';
import MapSkeleton from './components/MapSkeleton';
import { DataVisualization } from './DataVisualization';
import OnboardingModal from './components/OnboardingModal';
import DataQualityBadge from './components/DataQualityBadge';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import { useTheme } from './hooks/useTheme';
import { getRiskLevel } from './theme';

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
  ONBOARDING_COMPLETE: 'la-crime-map-onboarding-complete',
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
  // Theme hook
  const { theme, toggleTheme } = useTheme();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !loadPreference(STORAGE_KEYS.ONBOARDING_COMPLETE, false)
  );

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
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
  const [error, setError] = useState<Error | null>(null);
  const [dataSource, setDataSource] = useState<string>('Loading...');
  // Stats panel open by default on desktop, closed on mobile
  const [statsPanelOpen, setStatsPanelOpen] = useState<boolean>(
    () => window.innerWidth >= 768
  );

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
      setError(null);
      try {
        console.log('Fetching crime data (with caching)...');
        const weeks = dateRangeToWeeks(dateRange);
        const realData = await fetchCrimeData(weeks);

        if (realData.length === 0) {
          setDataSource('Using sample data (API returned no data)');
          setLoading(false);
          return;
        }

        console.log(`Got ${realData.length} neighborhoods with crime data`);

        // Create a map of neighborhood name to crime stats
        const crimeMap = new Map<string, NeighborhoodData>();
        realData.forEach(neighborhood => {
          crimeMap.set(neighborhood.name, neighborhood);
        });

        // Update GeoJSON properties with real data
        const updatedGeoJSON: NeighborhoodGeoJSON = {
          ...laNeighborhoods,
          features: laNeighborhoods.features.map(feature => {
            const realCrimeData = crimeMap.get(feature.properties.name);

            if (realCrimeData) {
              // Use real enhanced data from API
              return {
                ...feature,
                properties: realCrimeData
              };
            } else {
              // Keep existing data if no real data available
              return feature;
            }
          })
        };

        setNeighborhoodData(updatedGeoJSON);
        const rangeLabel = dateRange === '1week' ? 'last week' :
                          dateRange === '1month' ? 'last month' :
                          dateRange === '3months' ? 'last 3 months' : 'last year';
        setDataSource(`Real LA Crime Data (${rangeLabel})`);
        console.log('Successfully loaded crime data');

      } catch (err) {
        console.error('Error loading crime data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load crime data'));
        setDataSource('Error loading data');
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Calculate LA city-wide averages
  const laAverages = useMemo(() => {
    if (neighborhoods.length === 0) return null;

    const totals = neighborhoods.reduce(
      (acc, n) => ({
        violentCrime: acc.violentCrime + n.violentCrime,
        carTheft: acc.carTheft + n.carTheft,
        breakIns: acc.breakIns + n.breakIns,
        pettyTheft: acc.pettyTheft + n.pettyTheft,
      }),
      { violentCrime: 0, carTheft: 0, breakIns: 0, pettyTheft: 0 }
    );

    return {
      violentCrime: totals.violentCrime / neighborhoods.length,
      carTheft: totals.carTheft / neighborhoods.length,
      breakIns: totals.breakIns / neighborhoods.length,
      pettyTheft: totals.pettyTheft / neighborhoods.length,
    };
  }, [neighborhoods]);

  // Compare value to LA average
  const getComparisonToAverage = useCallback((value: number, metric: CrimeMetric): string => {
    if (!laAverages) return '';
    const avg = laAverages[metric];
    const diff = ((value - avg) / avg) * 100;

    if (Math.abs(diff) < 5) return 'about average';
    if (diff < 0) return `${Math.abs(diff).toFixed(0)}% below average`;
    return `${diff.toFixed(0)}% above average`;
  }, [laAverages]);

  // Handle onboarding close
  const handleOnboardingClose = useCallback(() => {
    setShowOnboarding(false);
    savePreference(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
  }, []);

  // Handle retry after error
  const handleRetry = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  // Handle reset application
  const handleReset = useCallback(() => {
    // Clear all localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    });
    clearCrimeCache();
    window.location.reload();
  }, []);

  return (
    <div className="App">
      {/* Onboarding Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="brand-logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="header-text">
              <h1>LA Crime Map</h1>
              <p className="header-subtitle">Data-driven neighborhood safety insights</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setShowOnboarding(true)}
              title="How to use this tool"
              aria-label="Show tutorial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Data source info with quality badge */}
        <div className="data-source-info">
          {loading ? (
            <span className="loading-indicator">Loading data...</span>
          ) : error ? (
            <span className="error-indicator">Failed to load data</span>
          ) : (
            <>
              <DataQualityBadge
                confidence="high"
                lastUpdated={new Date().toLocaleDateString()}
                showDetails={false}
              />
              <span className="data-source-text">{dataSource}</span>
              <button
                className="text-button"
                onClick={handleRefreshData}
                title="Clear cache and refresh data"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </>
          )}
        </div>

        {/* Trust signals */}
        <div className="trust-signals">
          <div className="trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Official LAPD Data</span>
          </div>
          <div className="trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Colorblind Accessible</span>
          </div>
          <div className="trust-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated Daily</span>
          </div>
        </div>
      </div>

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

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      )}

      {/* Main Content */}
      {!error && viewMode === 'analytics' ? (
        <DataVisualization
          neighborhoods={neighborhoods}
          selectedMetric={selectedMetric}
        />
      ) : !error ? (
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
              <label htmlFor="date-range">Time Period:</label>
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="date-select"
                aria-label="Select time period for crime data"
              >
                <option value="1week">Last Week</option>
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              className="advanced-filters-toggle"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showAdvancedFilters ? 'Hide' : 'More'} Filters
            </button>

            {/* Advanced Filters - Hidden by default */}
            {showAdvancedFilters && (
              <div id="advanced-filters" className="advanced-filters">
                {/* Severity Threshold Filter */}
                <div className="severity-filter">
                  <label htmlFor="severity-slider">
                    Min Crimes/Week: {severityThreshold}
                    <span className="help-tooltip" title="Filter out neighborhoods with fewer crimes per week than this value">?</span>
                  </label>
                  <input
                    id="severity-slider"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={severityThreshold}
                    onChange={(e) => setSeverityThreshold(Number(e.target.value))}
                    className="severity-slider"
                    aria-label={`Minimum severity threshold: ${severityThreshold} crimes per week`}
                    aria-valuemin={0}
                    aria-valuemax={50}
                    aria-valuenow={severityThreshold}
                  />
                </div>

                {/* Sort Options */}
                <div className="sort-selector">
                  <label htmlFor="sort-by">Sort By:</label>
                  <select
                    id="sort-by"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="sort-select"
                    aria-label="Sort neighborhoods by"
                  >
                    <option value="crimeRate">Highest Crime First</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            )}
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
            <Suspense fallback={<MapSkeleton />}>
              <CrimeMap
                neighborhoodData={neighborhoodData}
                selectedMetric={selectedMetric}
                onHover={handleHover}
                getColor={getColor}
              />
            </Suspense>

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

                  {/* LA Average Info */}
                  {laAverages && (
                    <div className="la-average-info">
                      <div className="average-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <strong>LA City Average: {laAverages[selectedMetric].toFixed(1)} per week</strong>
                      </div>
                      <p className="average-description">
                        All neighborhoods are compared to this city-wide average
                      </p>
                    </div>
                  )}

                  <div className="legend">
                    <div className="legend-header">
                      <strong>Risk Levels</strong>
                      <span className="legend-subtitle">Colorblind-safe palette</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#4575b4' }}></span>
                      <div className="legend-text">
                        <span className="legend-label">Very Low</span>
                        <span className="legend-desc">Well below average</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#74add1' }}></span>
                      <div className="legend-text">
                        <span className="legend-label">Low</span>
                        <span className="legend-desc">Below average</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#fee090' }}></span>
                      <div className="legend-text">
                        <span className="legend-label">Moderate</span>
                        <span className="legend-desc">Near average</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#f46d43' }}></span>
                      <div className="legend-text">
                        <span className="legend-label">High</span>
                        <span className="legend-desc">Above average</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{ background: '#d73027' }}></span>
                      <div className="legend-text">
                        <span className="legend-label">Very High</span>
                        <span className="legend-desc">Well above average</span>
                      </div>
                    </div>
                  </div>

                  <div className="neighborhood-list">
                    {filteredAndSortedNeighborhoods.length > 0 ? (
                      filteredAndSortedNeighborhoods.map(n => {
                        const value = n[selectedMetric] || 0;
                        const riskLevel = getRiskLevel(value, selectedMetric);
                        const comparison = getComparisonToAverage(value, selectedMetric);

                        return (
                          <div
                            key={n.name}
                            id={`neighborhood-${n.name.replace(/\s+/g, '-')}`}
                            className={`neighborhood-item ${hoveredNeighborhood === n.name ? 'highlighted' : ''}`}
                            style={{
                              borderLeft: `4px solid ${getColor(value, selectedMetric)}`
                            }}
                            onClick={() => {
                              const element = document.getElementById(`neighborhood-${n.name.replace(/\s+/g, '-')}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                              }
                            }}
                          >
                            <div className="neighborhood-info">
                              <span className="neighborhood-name">{n.name}</span>
                              <div className="neighborhood-stats">
                                <span className="crime-value">{value} per week</span>
                                <span className="risk-badge" data-risk={riskLevel.level}>
                                  {riskLevel.label}
                                </span>
                                {comparison && (
                                  <span className="comparison-badge">{comparison}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState
                        type={searchQuery ? 'search' : 'filter'}
                        title={searchQuery ? 'No neighborhoods found' : 'No data to display'}
                        message={
                          searchQuery
                            ? `No neighborhoods match "${searchQuery}". Try a different search term.`
                            : 'Adjust your filters to see neighborhood data.'
                        }
                        action={
                          searchQuery || severityThreshold > 0
                            ? {
                                label: 'Clear Filters',
                                onClick: () => {
                                  setSearchQuery('');
                                  setSeverityThreshold(0);
                                },
                              }
                            : undefined
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}

      {/* Disclaimer Footer */}
      {!error && (
        <div className="app-footer">
          <div className="disclaimer">
            <div className="disclaimer-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="disclaimer-content">
              <strong>Important Disclaimer:</strong> This tool is for informational purposes only.
              Crime statistics represent reported incidents and may not reflect all criminal activity
              or overall neighborhood safety. Data is sourced from the{' '}
              <a
                href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
                target="_blank"
                rel="noopener noreferrer"
              >
                LA City Open Data Portal
              </a>{' '}
              and updated regularly. Always visit neighborhoods in person, consult with local
              authorities, and make informed decisions based on multiple sources.
            </div>
          </div>
          <div className="footer-meta">
            <span>Made with care for Los Angeles communities</span>
            <span className="separator">•</span>
            <button className="text-button" onClick={() => setShowOnboarding(true)}>
              View Tutorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
