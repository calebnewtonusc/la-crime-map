import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AppWrapper from './AppWrapper';
import About from './pages/About';
import DataSources from './pages/DataSources';
import Disclaimers from './pages/Disclaimers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

type Page = 'map' | 'about' | 'data-sources' | 'disclaimers' | 'faq' | 'contact' | 'privacy';

interface PageContentProps {
  currentPage: Page;
}

const PageContent: React.FC<PageContentProps> = ({ currentPage }) => {
  switch (currentPage) {
    case 'about':
      return <About />;
    case 'data-sources':
      return <DataSources />;
    case 'disclaimers':
      return <Disclaimers />;
    case 'faq':
      return <FAQ />;
    case 'contact':
      return <Contact />;
    case 'privacy':
      return <Privacy />;
    case 'map':
    default:
      return <AppWrapper />;
  }
};

const Router: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('map');
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track data update timestamp
  useEffect(() => {
    const checkDataUpdate = () => {
      const cached = localStorage.getItem('la-crime-data-timestamp');
      if (cached) {
        setLastDataUpdate(new Date(cached));
      }
    };

    checkDataUpdate();
    // Check every 30 seconds
    const interval = setInterval(checkDataUpdate, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (page: string) => {
    const newPage = page as Page;
    setCurrentPage(newPage);

    // Update browser history
    window.history.pushState({ page: newPage }, '', `/${newPage === 'map' ? '' : newPage}`);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update page title
    const titles: Record<Page, string> = {
      'map': 'LA Crime Map - Interactive Los Angeles Crime Statistics',
      'about': 'About - LA Crime Map',
      'data-sources': 'Data Sources - LA Crime Map',
      'disclaimers': 'Disclaimers & Limitations - LA Crime Map',
      'faq': 'FAQ - LA Crime Map',
      'contact': 'Contact Us - LA Crime Map',
      'privacy': 'Privacy Policy - LA Crime Map'
    };
    document.title = titles[newPage];
  };

  return (
    <div className="app-root">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main role="main">
        <PageContent currentPage={currentPage} />
      </main>
      {currentPage !== 'map' && (
        <Footer onNavigate={handleNavigate} lastDataUpdate={lastDataUpdate} />
      )}
    </div>
  );
};

export default Router;
