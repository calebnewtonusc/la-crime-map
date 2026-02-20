import React, { useState } from 'react';
import './Navigation.css';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'about', label: 'About', icon: '📖' },
    { id: 'data-sources', label: 'Data Sources', icon: '📊' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'disclaimers', label: 'Disclaimers', icon: '⚠️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'contact', label: 'Contact', icon: '✉️' }
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <button className="nav-brand" onClick={() => handleNavigate('map')} aria-label="Go to map">
          <span className="nav-brand-icon">📍</span>
          <span className="nav-brand-text">LA Crime Map</span>
        </button>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
