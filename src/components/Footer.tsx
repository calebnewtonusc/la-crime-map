import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
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
              Los Angeles Open Data Portal
            </a>
          </p>
          <p className="footer-note">
            Data is updated regularly and represents reported crimes from 2020 to present.
          </p>
        </div>

        <div className="footer-section">
          <h4>Coverage</h4>
          <p>All 21 LAPD Community Police Station areas</p>
          <p className="footer-note">Displaying data from the most recent 4-week period</p>
        </div>

        <div className="footer-section">
          <h4>Disclaimer</h4>
          <p className="footer-note">
            This visualization is for informational purposes only. Crime statistics are approximate
            and may not reflect all incidents. For official crime reports, please contact the{' '}
            <a
              href="https://www.lapdonline.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Los Angeles Police Department (opens in new tab)"
            >
              LAPD
            </a>
            .
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Built with{' '}
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="React (opens in new tab)"
          >
            React
          </a>
          {' '}&amp;{' '}
          <a
            href="https://leafletjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Leaflet (opens in new tab)"
          >
            Leaflet
          </a>
          {' '}| LA Crime Map {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
