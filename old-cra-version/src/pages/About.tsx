import React from 'react';
import './TrustPages.css';

const About: React.FC = () => {
  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>About LA Crime Map</h1>

        <section className="trust-section">
          <h2>Our Mission</h2>
          <p>
            LA Crime Map provides transparent, data-driven insights into crime patterns across Los Angeles neighborhoods.
            Our goal is to empower residents, researchers, and policymakers with accurate, accessible information to
            make informed decisions about safety and community resources.
          </p>
        </section>

        <section className="trust-section">
          <h2>Methodology</h2>

          <h3>Data Collection</h3>
          <p>
            We source all crime data directly from the <a href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8" target="_blank" rel="noopener noreferrer">Los Angeles Open Data Portal</a>,
            maintained by the Los Angeles Police Department (LAPD). This dataset contains reported crime incidents from 2020 to present,
            updated regularly by the LAPD.
          </p>

          <h3>Crime Categorization</h3>
          <p>We categorize reported crimes into four primary metrics based on LAPD crime code descriptions:</p>

          <div className="methodology-grid">
            <div className="methodology-card">
              <h4>Violent Crime</h4>
              <p>Includes:</p>
              <ul>
                <li>Assault (aggravated and with weapon)</li>
                <li>Robbery</li>
                <li>Sexual assault and rape</li>
                <li>Homicide and murder</li>
                <li>Kidnapping</li>
                <li>Weapons-related incidents</li>
                <li>Shots fired reports</li>
              </ul>
              <p className="methodology-note">
                <strong>Note:</strong> Simple battery (without weapon) is excluded to focus on more serious violent incidents.
              </p>
            </div>

            <div className="methodology-card">
              <h4>Car Theft</h4>
              <p>Includes:</p>
              <ul>
                <li>Stolen vehicles</li>
                <li>Attempted vehicle theft</li>
              </ul>
              <p className="methodology-note">
                <strong>Note:</strong> Does not include theft from vehicles (categorized as petty theft).
              </p>
            </div>

            <div className="methodology-card">
              <h4>Break-ins (Burglary)</h4>
              <p>Includes:</p>
              <ul>
                <li>Residential burglary</li>
                <li>Commercial burglary</li>
                <li>Breaking and entering</li>
              </ul>
              <p className="methodology-note">
                <strong>Note:</strong> Vehicle burglary is categorized separately as petty theft.
              </p>
            </div>

            <div className="methodology-card">
              <h4>Petty Theft</h4>
              <p>Includes:</p>
              <ul>
                <li>Theft (various types)</li>
                <li>Shoplifting</li>
                <li>Burglary from vehicle</li>
                <li>Pickpocketing</li>
                <li>Purse snatching</li>
                <li>Embezzlement</li>
              </ul>
              <p className="methodology-note">
                <strong>Note:</strong> Represents property crimes without force or entry.
              </p>
            </div>
          </div>

          <h3>Geographic Mapping</h3>
          <p>
            Crimes are mapped to neighborhoods based on LAPD's 21 Community Police Station areas (also known as Bureau Areas).
            Each reported crime incident includes an <code>area_name</code> field that corresponds to one of these divisions.
          </p>

          <h3>Calculation Method</h3>
          <p>Crime rates are calculated using the following process:</p>
          <ol>
            <li>Fetch all reported crimes within the selected date range from the LA Open Data Portal API</li>
            <li>Filter crimes by category based on the crime code description field</li>
            <li>Aggregate crime counts by neighborhood (LAPD area)</li>
            <li>Divide total counts by the number of weeks in the selected period</li>
            <li>Round to nearest whole number to display "crimes per week"</li>
          </ol>

          <div className="calculation-example">
            <h4>Example Calculation</h4>
            <p>For a neighborhood with 48 violent crimes in the last month (4 weeks):</p>
            <code>48 violent crimes ÷ 4 weeks = 12 violent crimes per week</code>
          </div>

          <h3>Color Coding System</h3>
          <p>Each neighborhood is color-coded on the map based on the selected crime metric:</p>
          <ul>
            <li><span className="color-indicator" style={{background: '#00ff00'}}></span> <strong>Green (Low):</strong> Below 25th percentile for the metric</li>
            <li><span className="color-indicator" style={{background: '#ffff00'}}></span> <strong>Yellow (Moderate):</strong> 25th to 50th percentile</li>
            <li><span className="color-indicator" style={{background: '#ff9900'}}></span> <strong>Orange (High):</strong> 50th to 75th percentile</li>
            <li><span className="color-indicator" style={{background: '#ff0000'}}></span> <strong>Red (Very High):</strong> Above 75th percentile</li>
          </ul>

          <h3>Data Caching</h3>
          <p>
            To improve performance and reduce API load, crime data is cached locally in your browser for 1 hour.
            You can manually refresh the data using the "Refresh" button in the header.
          </p>
        </section>

        <section className="trust-section">
          <h2>Technology Stack</h2>
          <p>This application is built with:</p>
          <ul>
            <li><strong>React 19</strong> - Frontend framework</li>
            <li><strong>TypeScript</strong> - Type-safe programming</li>
            <li><strong>Leaflet</strong> - Interactive mapping library</li>
            <li><strong>Recharts</strong> - Data visualization</li>
            <li><strong>Socrata API</strong> - LA Open Data Portal access</li>
          </ul>
        </section>

        <section className="trust-section">
          <h2>Who We Are</h2>
          <p>
            LA Crime Map is an independent, open-source project created to promote transparency and data accessibility
            in public safety information. We are not affiliated with the LAPD or the City of Los Angeles.
          </p>
          <p>
            This project is maintained by independent developers committed to providing accurate, accessible crime data
            visualization for the Los Angeles community.
          </p>
        </section>

        <section className="trust-section">
          <h2>Open Source</h2>
          <p>
            This project's source code is available for review to ensure transparency and allow community contributions.
            We believe in open, verifiable data analysis.
          </p>
        </section>

        <div className="last-updated">
          Last Updated: February 2026
        </div>
      </div>
    </div>
  );
};

export default About;
