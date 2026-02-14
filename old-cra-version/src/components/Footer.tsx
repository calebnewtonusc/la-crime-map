import React from 'react';
import './Footer.css';

interface FooterProps {
  onNavigate?: (page: string) => void;
  lastDataUpdate?: Date;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, lastDataUpdate }) => {
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Data Source</h4>
          <p>
            Crime data provided by the{' '}
            <a
              href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Los Angeles Open Data Portal - Crime Data (opens in new tab)"
            >
              Los Angeles Police Department
            </a>
            {' '}via the{' '}
            <a
              href="https://data.lacity.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Los Angeles Open Data Portal (opens in new tab)"
            >
              LA Open Data Portal
            </a>
          </p>
          <p className="footer-note">
            Data updated weekly by LAPD. Last fetched: {lastDataUpdate ? formatDate(lastDataUpdate) : 'Loading...'}
          </p>
          <p className="footer-note">
            <a href="/data-sources" onClick={(e) => { e.preventDefault(); handleNavClick('data-sources'); }}>
              View all data sources →
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li><a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About & Methodology</a></li>
            <li><a href="/faq" onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}>FAQ</a></li>
            <li><a href="/disclaimers" onClick={(e) => { e.preventDefault(); handleNavClick('disclaimers'); }}>Disclaimers & Limitations</a></li>
            <li><a href="/privacy" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }}>Privacy Policy</a></li>
            <li><a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Important Notice</h4>
          <p className="footer-disclaimer">
            This visualization is for <strong>informational purposes only</strong>. Crime statistics are
            approximate and may not reflect all incidents. Not all crimes are reported. Data does not
            account for population density.
          </p>
          <p className="footer-emergency">
            <strong>To report a crime:</strong> Call 911 (emergency) or{' '}
            <a
              href="tel:1-877-275-5273"
              aria-label="LAPD non-emergency phone number"
            >
              1-877-ASK-LAPD
            </a>
            {' '}(non-emergency)
          </p>
        </div>

        <div className="footer-section">
          <h4>Coverage</h4>
          <p>All 21 LAPD Community Police Station areas</p>
          <p className="footer-note">Dataset: 900,000+ crime incidents (2020-present)</p>
          <p className="footer-note">Updates: Weekly (typically Tuesdays)</p>
          <p className="footer-note">
            <a
              href="https://www.lapdonline.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LAPD Official Website →
            </a>
          </p>
        </div>
      </div>

      <div className="footer-tech-stack">
        <h4>Built With</h4>
        <div className="tech-badges">
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React 19</a>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a>
          <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a>
          <a href="https://recharts.org/" target="_blank" rel="noopener noreferrer">Recharts</a>
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
          <a href="https://dev.socrata.com/" target="_blank" rel="noopener noreferrer">Socrata API</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} LA Crime Map. Independent project. Not affiliated with LAPD or City of Los Angeles.
          </p>
          <p className="footer-attribution">
            Data: <a href="https://data.lacity.org/" target="_blank" rel="noopener noreferrer">Los Angeles Open Data Portal</a>
            {' '}| Map: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
          </p>
        </div>
        <div className="footer-social-proof">
          <p className="footer-verification">
            ✓ Real LAPD data &nbsp;|&nbsp; ✓ No tracking &nbsp;|&nbsp; ✓ Open methodology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
