import React from 'react';
import './TrustPages.css';

const DataSources: React.FC = () => {
  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>Data Sources</h1>

        <section className="trust-section">
          <h2>Primary Data Source</h2>

          <div className="data-source-card primary-source">
            <h3>Los Angeles Open Data Portal - Crime Data from 2020 to Present</h3>
            <div className="source-details">
              <p><strong>Provider:</strong> Los Angeles Police Department (LAPD)</p>
              <p><strong>Dataset ID:</strong> 2nrs-mtv8</p>
              <p><strong>API Endpoint:</strong> <code>https://data.lacity.org/resource/2nrs-mtv8.json</code></p>
              <p><strong>Update Frequency:</strong> Weekly (typically updated every Tuesday)</p>
              <p><strong>Coverage Period:</strong> January 1, 2020 - Present</p>
              <p><strong>Total Records:</strong> 900,000+ crime incidents</p>
            </div>
            <div className="source-links">
              <a href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8" target="_blank" rel="noopener noreferrer" className="btn-primary">
                View Dataset
              </a>
              <a href="https://dev.socrata.com/foundry/data.lacity.org/2nrs-mtv8" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                API Documentation
              </a>
            </div>
            <p className="source-note">
              This dataset reflects incidents of crime in the City of Los Angeles from 2020 onwards,
              transcribed from original crime reports typed on paper. Some location fields may be missing
              or inaccurate, and address fields are rounded to the nearest hundred block to maintain privacy.
            </p>
          </div>
        </section>

        <section className="trust-section">
          <h2>Geographic Data</h2>

          <div className="data-source-card">
            <h3>LAPD Community Police Station Areas</h3>
            <div className="source-details">
              <p><strong>Provider:</strong> Los Angeles Police Department</p>
              <p><strong>Description:</strong> Official boundaries for LAPD's 21 Community Police Station divisions</p>
              <p><strong>Format:</strong> GeoJSON polygon coordinates</p>
            </div>
            <div className="source-links">
              <a href="https://www.lapdonline.org/office-of-the-chief-of-police/office-of-operations/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                LAPD Areas Information
              </a>
            </div>
            <p className="source-note">
              Geographic boundaries used to map crime incidents to neighborhoods. Each crime record includes
              an <code>area_name</code> field corresponding to one of the 21 LAPD divisions.
            </p>
          </div>

          <div className="area-list">
            <h4>LAPD Community Police Station Areas (21 Total)</h4>
            <div className="area-grid">
              <div className="area-column">
                <ul>
                  <li>77th Street</li>
                  <li>Central</li>
                  <li>Devonshire</li>
                  <li>Foothill</li>
                  <li>Harbor</li>
                  <li>Hollywood</li>
                  <li>Hollenbeck</li>
                </ul>
              </div>
              <div className="area-column">
                <ul>
                  <li>Mission</li>
                  <li>N Hollywood</li>
                  <li>Newton</li>
                  <li>Northeast</li>
                  <li>Olympic</li>
                  <li>Pacific</li>
                  <li>Rampart</li>
                </ul>
              </div>
              <div className="area-column">
                <ul>
                  <li>Southeast</li>
                  <li>Southwest</li>
                  <li>Topanga</li>
                  <li>Van Nuys</li>
                  <li>West LA</li>
                  <li>West Valley</li>
                  <li>Wilshire</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <h2>Technical Infrastructure</h2>

          <div className="tech-source-grid">
            <div className="tech-source-card">
              <h3>Mapping Library</h3>
              <p><strong>Leaflet.js</strong></p>
              <p>Open-source JavaScript library for interactive maps</p>
              <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">leafletjs.com</a>
            </div>

            <div className="tech-source-card">
              <h3>Map Tiles</h3>
              <p><strong>OpenStreetMap</strong></p>
              <p>Free, editable map of the world</p>
              <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">openstreetmap.org</a>
            </div>

            <div className="tech-source-card">
              <h3>Data API</h3>
              <p><strong>Socrata Open Data API</strong></p>
              <p>Platform powering LA Open Data Portal</p>
              <a href="https://dev.socrata.com/" target="_blank" rel="noopener noreferrer">dev.socrata.com</a>
            </div>

            <div className="tech-source-card">
              <h3>Visualization</h3>
              <p><strong>Recharts</strong></p>
              <p>Charting library for React</p>
              <a href="https://recharts.org/" target="_blank" rel="noopener noreferrer">recharts.org</a>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <h2>Data Processing</h2>
          <p>All data processing happens in your browser using client-side JavaScript. We do not:</p>
          <ul>
            <li>Store crime data on our servers</li>
            <li>Modify or alter the source data from LAPD</li>
            <li>Collect personal information about users</li>
            <li>Track individual crime incident details beyond what's publicly available</li>
          </ul>
          <p>
            The application fetches data directly from the LA Open Data Portal API and processes it locally
            for visualization. Data is cached in your browser for 1 hour to improve performance.
          </p>
        </section>

        <section className="trust-section">
          <h2>API Rate Limits</h2>
          <p>
            The LA Open Data Portal uses standard Socrata API rate limits:
          </p>
          <ul>
            <li><strong>Without App Token:</strong> 1,000 requests per rolling 24-hour period</li>
            <li><strong>With App Token:</strong> 10,000 requests per rolling 24-hour period</li>
          </ul>
          <p>
            This application implements local caching to minimize API requests and stay well within these limits.
            Typical usage results in 1-5 API requests per user session.
          </p>
        </section>

        <section className="trust-section">
          <h2>Data Freshness</h2>
          <div className="freshness-info">
            <p><strong>LAPD Update Schedule:</strong> Crime data is typically updated weekly, every Tuesday</p>
            <p><strong>Our Cache Duration:</strong> 1 hour</p>
            <p><strong>Maximum Data Age:</strong> ~7-8 days (from LAPD's last update + our cache)</p>
          </div>
          <p>
            For the most current data, use the "Refresh" button in the application header to clear the cache
            and fetch fresh data from the API.
          </p>
        </section>

        <section className="trust-section">
          <h2>Attribution Requirements</h2>
          <p>If you use data or insights from this application, please provide attribution to:</p>
          <ol>
            <li><strong>Los Angeles Police Department</strong> - Original data source</li>
            <li><strong>Los Angeles Open Data Portal</strong> - Data distribution platform</li>
            <li><strong>LA Crime Map</strong> - Visualization and analysis (if applicable)</li>
          </ol>
          <p className="attribution-example">
            Example: "Crime data sourced from the Los Angeles Police Department via the
            Los Angeles Open Data Portal (data.lacity.org)"
          </p>
        </section>

        <section className="trust-section">
          <h2>Related Resources</h2>
          <ul className="resource-links">
            <li>
              <a href="https://www.lapdonline.org/" target="_blank" rel="noopener noreferrer">
                LAPD Official Website
              </a>
            </li>
            <li>
              <a href="https://www.lapdonline.org/crime-mapping-and-compstat/" target="_blank" rel="noopener noreferrer">
                LAPD Crime Mapping & COMPSTAT
              </a>
            </li>
            <li>
              <a href="https://data.lacity.org/" target="_blank" rel="noopener noreferrer">
                Los Angeles Open Data Portal
              </a>
            </li>
            <li>
              <a href="https://www.fbi.gov/how-we-can-help-you/more-fbi-services-and-information/ucr" target="_blank" rel="noopener noreferrer">
                FBI Uniform Crime Reporting (UCR) Program
              </a>
            </li>
          </ul>
        </section>

        <div className="last-updated">
          Last Updated: February 2026
        </div>
      </div>
    </div>
  );
};

export default DataSources;
