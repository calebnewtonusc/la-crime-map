/**
 * Accessible App Wrapper
 * Adds comprehensive accessibility features to the LA Crime Map
 * WCAG 2.1 AA Compliant
 */

import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import { laNeighborhoods, NeighborhoodGeoJSON } from '../neighborhoods';
import { fetchCrimeData, NeighborhoodData, clearCrimeCache } from '../crimeDataService';
import { debounce } from '../utils/debounce';
import { getAccessibleColor, getSeverityDescription } from '../utils/accessibilityColors';
import { useAccessibility } from '../contexts/AccessibilityContext';
import MapSkeleton from './MapSkeleton';

// Lazy load the map component for better initial load performance
const CrimeMap = lazy(() => import('./CrimeMap'));

// Crime metrics type
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
type DateRange = '1week' | '1month' | '3months' | '1year';
type SortOption = 'alphabetical' | 'crimeRate';

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

export const AccessibleApp: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, announce } = useAccessibility();

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
      try {
        const weeks = dateRangeToWeeks(dateRange);
        const realData = await fetchCrimeData(weeks);

        if (realData.length === 0) {
          setDataSource(t('error.noData'));
          announce(t('error.noData'), 'polite');
          setLoading(false);
          return;
        }

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
        const rangeLabel = t(`time.${dateRange}`);
        setDataSource(`${t('header.dataSource', { source: rangeLabel })}`);

        // Announce to screen readers
        announce(t('a11y.announceDataLoaded', { count: realData.length }), 'polite');

      } catch (error) {
        console.error('Error loading crime data:', error);
        setDataSource(t('error.dataLoadFailed'));
        announce(t('error.dataLoadFailed'), 'assertive');
      } finally {
        setLoading(false);
      }
    }

    loadRealCrimeData();
  }, [dateRange, announce, t]);

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

  // Announce search results
  useEffect(() => {
    if (searchQuery) {
      announce(t('a11y.announceSearchResults', { count: filteredAndSortedNeighborhoods.length }), 'polite');
    }
  }, [filteredAndSortedNeighborhoods.length, searchQuery, announce, t]);

  // Debounced hover handler for better performance
  const handleHover = useMemo(
    () => debounce((name: string | null) => {
      setHoveredNeighborhood(name);
      if (name) {
        const neighborhood = neighborhoods.find(n => n.name === name);
        if (neighborhood) {
          const value = neighborhood[selectedMetric] || 0;
          const metricLabel = t(`crime.${selectedMetric}`);
          announce(
            t('a11y.announceNeighborhoodHover', { name, value, metric: metricLabel }),
            'polite'
          );
        }
      }
    }, 50),
    [neighborhoods, selectedMetric, announce, t]
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

  // Get color with accessibility support
  const getColor = useCallback((value: number, metric: CrimeMetric): string => {
    const result = getAccessibleColor(value, metric, {
      highContrast: settings.highContrast,
      colorblindMode: settings.colorblindMode
    });
    return result.color;
  }, [settings.highContrast, settings.colorblindMode]);

  // Handler to force refresh cache
  const handleRefreshData = useCallback(() => {
    clearCrimeCache();
    window.location.reload();
  }, []);

  // Announce metric changes
  const handleMetricChange = useCallback((metric: CrimeMetric) => {
    setSelectedMetric(metric);
    announce(t('a11y.announceMetricChange', { metric: t(`crime.${metric}`) }), 'polite');
  }, [announce, t]);

  return (
    <div className="App">
      <header className="header" role="banner">
        <h1>{t('header.title')}</h1>
        <p>{t('header.subtitle')}</p>
        <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.8 }}>
          {loading ? t('header.loading') : dataSource}
          {!loading && (
            <button
              onClick={handleRefreshData}
              style={{
                marginLeft: '10px',
                fontSize: '0.8em',
                padding: '2px 8px',
                cursor: 'pointer'
              }}
              title={t('header.refreshTitle')}
              aria-label={t('header.refreshTitle')}
            >
              {t('header.refresh')}
            </button>
          )}
        </p>
      </header>

      <div className="controls-container" role="search" aria-label={t('controls.search')}>
        {/* Search Bar */}
        <div className="search-bar">
          <label htmlFor="neighborhood-search" className="sr-only">
            {t('controls.search')}
          </label>
          <input
            id="neighborhood-search"
            type="search"
            placeholder={t('controls.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label={t('controls.search')}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
              title={t('controls.clearSearch')}
              aria-label={t('controls.clearSearch')}
            >
              ×
            </button>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="date-range-selector">
          <label htmlFor="date-range-select">{t('controls.timePeriod')}</label>
          <select
            id="date-range-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="date-select"
            aria-label={t('controls.timePeriod')}
          >
            <option value="1week">{t('time.lastWeek')}</option>
            <option value="1month">{t('time.lastMonth')}</option>
            <option value="3months">{t('time.last3Months')}</option>
            <option value="1year">{t('time.lastYear')}</option>
          </select>
        </div>

        {/* Severity Threshold Filter */}
        <div className="severity-filter">
          <label htmlFor="severity-slider">
            {t('controls.minSeverity', { value: severityThreshold })}
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
            aria-label={t('controls.minSeverity', { value: severityThreshold })}
            aria-valuemin={0}
            aria-valuemax={50}
            aria-valuenow={severityThreshold}
          />
        </div>

        {/* Sort Options */}
        <div className="sort-selector">
          <label htmlFor="sort-select">{t('controls.sortBy')}</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="sort-select"
            aria-label={t('controls.sortBy')}
          >
            <option value="crimeRate">{t('sort.crimeRate')}</option>
            <option value="alphabetical">{t('sort.alphabetical')}</option>
          </select>
        </div>

        {/* Compare Mode Toggle */}
        <button
          className={`compare-toggle ${compareMode ? 'active' : ''}`}
          onClick={handleCompareModeToggle}
          aria-pressed={compareMode}
          aria-label={compareMode ? t('controls.exitCompare') : t('controls.compareMode')}
        >
          {compareMode ? t('controls.exitCompare') : t('controls.compareMode')}
        </button>
      </div>

      <div className="metric-selector" role="group" aria-label="Crime metric selection">
        {(['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'] as CrimeMetric[]).map(metric => (
          <button
            key={metric}
            className={selectedMetric === metric ? 'active' : ''}
            onClick={() => handleMetricChange(metric)}
            aria-pressed={selectedMetric === metric}
            aria-label={t(`crime.${metric}`)}
          >
            {t(`crime.${metric}`)}
          </button>
        ))}
      </div>

      <div className="map-container" role="region" aria-label="Crime map">
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
          aria-label={t('stats.togglePanel')}
          aria-expanded={statsPanelOpen}
          aria-controls="stats-panel"
        >
          {statsPanelOpen ? '✕' : '☰'}
        </button>

        <aside
          id="stats-panel"
          className={`stats-panel ${statsPanelOpen ? 'open' : ''}`}
          role="complementary"
          aria-label="Crime statistics"
        >
          <div className="stats-panel-header">
            <h3>{t('stats.currentMetric', { metric: t(`crime.${selectedMetric}`) })}</h3>
            <button
              className="stats-panel-close"
              onClick={() => setStatsPanelOpen(false)}
              aria-label={t('stats.closePanel')}
            >
              ✕
            </button>
          </div>

          {/* Comparison or normal view */}
          {/* ... rest of the stats panel content ... */}
        </aside>
      </div>

      {/* Live region for dynamic updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
};

export default AccessibleApp;
