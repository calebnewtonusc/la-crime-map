import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import App from './App';
import Footer from './components/Footer';
import InfoModal from './components/InfoModal';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { AccessibilityStatement } from './components/AccessibilityStatement';
import { DataVisualization } from './DataVisualization';
import { fetchCrimeData, NeighborhoodData } from './crimeDataService';
import { useAccessibility } from './contexts/AccessibilityContext';
import './AppWrapper.css';

type ViewMode = 'map' | 'analytics';
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

/**
 * AppWrapper adds Footer, InfoModal, and Tab Navigation to the main App
 * This wrapper ensures SEO features, help system, and analytics are integrated
 */
const AppWrapper: React.FC = () => {
  const { t } = useTranslation();
  const { announce } = useAccessibility();
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [currentPage, setCurrentPage] = useState<'app' | 'accessibility-statement'>('app');
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Handle hash changes for accessibility statement
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#accessibility-statement') {
        setCurrentPage('accessibility-statement');
        announce(t('a11y.statement'), 'polite');
      } else {
        setCurrentPage('app');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [announce, t]);

  // Announce view mode changes
  useEffect(() => {
    const mode = viewMode === 'map' ? t('view.map') : t('view.analytics');
    announce(`Switched to ${mode}`, 'polite');
  }, [viewMode, announce, t]);

  if (currentPage === 'accessibility-statement') {
    return (
      <>
        <a href="#main-content" className="skip-link">
          {t('a11y.skipToMain')}
        </a>
        <AccessibilityPanel />
        <main id="main-content" role="main">
          <AccessibilityStatement />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Skip Links */}
      <a href="#main-content" className="skip-link">
        {t('a11y.skipToMain')}
      </a>
      <a href="#navigation" className="skip-link">
        {t('a11y.skipToNav')}
      </a>

      {/* Accessibility Settings */}
      <AccessibilityPanel />

      <button
        className="floating-help-button"
        onClick={() => setInfoModalOpen(true)}
        aria-label={t('Open help and information')}
        title={t('Help & Information')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* View Mode Tabs */}
      <nav id="navigation" role="navigation" aria-label="View selection">
        <div className="view-mode-tabs">
          <button
            className={`tab-button ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            aria-label={t('view.map')}
          >
            {t('view.map')}
          </button>
          <button
            className={`tab-button ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
            aria-pressed={viewMode === 'analytics'}
            aria-label={t('view.analytics')}
          >
            {t('view.analytics')}
          </button>
        </div>
      </nav>

      <main id="main-content" role="main">
        {viewMode === 'map' ? (
          <App />
        ) : (
          loading ? (
            <div className="loading-analytics" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>{t('header.loading')}</p>
            </div>
          ) : (
            <DataVisualization
              neighborhoods={neighborhoods}
              selectedMetric={selectedMetric}
            />
          )
        )}
      </main>

      <Footer />
      <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </div>
  );
};

export default AppWrapper;
