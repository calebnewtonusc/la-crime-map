import React, { useState, useEffect } from 'react';
import App from './App';
import Footer from './components/Footer';
import InfoModal from './components/InfoModal';
import { DataVisualization } from './DataVisualization';
import { fetchCrimeData, NeighborhoodData } from './crimeDataService';
import './AppWrapper.css';

type ViewMode = 'map' | 'analytics';
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

/**
 * AppWrapper adds Footer, InfoModal, and Tab Navigation to the main App
 * This wrapper ensures SEO features, help system, and analytics are integrated
 */
const AppWrapper: React.FC = () => {
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime');
  const [loading, setLoading] = useState<boolean>(true);

  // Show modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('la-crime-map-visited');
    if (!hasVisited) {
      setInfoModalOpen(true);
      localStorage.setItem('la-crime-map-visited', 'true');
    }
  }, []);

  // Fetch crime data for analytics view
  useEffect(() => {
    async function loadCrimeData() {
      setLoading(true);
      try {
        const realData = await fetchCrimeData(4); // 4 weeks of data
        if (realData.length > 0) {
          setNeighborhoods(realData);
        }
      } catch (error) {
        console.error('Error loading crime data for analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    if (viewMode === 'analytics') {
      loadCrimeData();
    }
  }, [viewMode]);

  return (
    <div className="app-wrapper">
      <button
        className="floating-help-button"
        onClick={() => setInfoModalOpen(true)}
        aria-label="Open help and information"
        title="Help & Information"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

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

      {viewMode === 'map' ? (
        <App />
      ) : (
        loading ? (
          <div className="loading-analytics">
            <div className="loading-spinner"></div>
            <p>Loading crime data...</p>
          </div>
        ) : (
          <DataVisualization
            neighborhoods={neighborhoods}
            selectedMetric={selectedMetric}
          />
        )
      )}

      <Footer />
      <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </div>
  );
};

export default AppWrapper;
