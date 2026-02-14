import React from 'react';
import './TrustPages.css';

const Privacy: React.FC = () => {
  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>Privacy Policy</h1>

        <div className="privacy-summary">
          <h3>Quick Summary</h3>
          <p><strong>We take your privacy seriously. Here's what you need to know:</strong></p>
          <ul>
            <li>We do NOT collect personal information</li>
            <li>We do NOT use cookies or tracking scripts</li>
            <li>We do NOT sell or share your data</li>
            <li>All data processing happens locally in your browser</li>
            <li>Only essential preferences are stored locally on your device</li>
          </ul>
        </div>

        <section className="trust-section">
          <h2>Information We Collect</h2>

          <h3>Personal Information: NONE</h3>
          <p>
            We do not collect, store, or process any personally identifiable information (PII).
            This includes:
          </p>
          <ul>
            <li>Names</li>
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Street addresses</li>
            <li>IP addresses</li>
            <li>Location data (GPS, geolocation API)</li>
            <li>Device identifiers</li>
            <li>Biometric data</li>
          </ul>

          <h3>Usage Data: NONE</h3>
          <p>
            We do not track or collect information about how you use the application, including:
          </p>
          <ul>
            <li>Pages viewed</li>
            <li>Features used</li>
            <li>Time spent on site</li>
            <li>Click patterns</li>
            <li>Search queries (beyond local storage)</li>
            <li>Browser type or version</li>
            <li>Referring websites</li>
          </ul>

          <h3>Local Storage (Your Device Only)</h3>
          <p>
            The application stores small amounts of data locally in your browser using localStorage.
            This data <strong>never leaves your device</strong> and includes only:
          </p>
          <ul>
            <li><strong>Selected crime metric</strong> (e.g., "Violent Crime")</li>
            <li><strong>Date range preference</strong> (e.g., "Last Month")</li>
            <li><strong>Severity threshold filter</strong> (numeric value)</li>
            <li><strong>Sort preference</strong> (alphabetical or by crime rate)</li>
            <li><strong>Search query</strong> (neighborhood search text)</li>
            <li><strong>First-visit flag</strong> (to show welcome modal once)</li>
            <li><strong>Cached crime data</strong> (for 1 hour, to reduce API requests)</li>
          </ul>
          <p>
            You can clear all locally stored data at any time through your browser's settings
            (Clear browsing data → Cookies and site data).
          </p>
        </section>

        <section className="trust-section">
          <h2>How We Use Your Data</h2>

          <h3>Application Functionality</h3>
          <p>
            The only "data" we work with is the crime statistics fetched from the LA Open Data Portal.
            This public data is processed entirely in your browser to:
          </p>
          <ul>
            <li>Display crime statistics on the map</li>
            <li>Generate charts and visualizations</li>
            <li>Enable filtering and comparison features</li>
            <li>Provide neighborhood-level statistics</li>
          </ul>

          <h3>No Server-Side Processing</h3>
          <p>
            This is a client-side application. All data fetching, processing, and visualization
            happens in your browser. We do not have a backend server that receives or processes
            your requests.
          </p>
        </section>

        <section className="trust-section">
          <h2>Cookies and Tracking</h2>

          <h3>No Cookies</h3>
          <p>
            We do not use cookies of any kind (session cookies, persistent cookies, or third-party cookies).
          </p>

          <h3>No Analytics or Tracking</h3>
          <p>
            We do not use:
          </p>
          <ul>
            <li>Google Analytics</li>
            <li>Facebook Pixel</li>
            <li>Hotjar or session recording</li>
            <li>Ad networks or retargeting pixels</li>
            <li>Any other analytics or tracking services</li>
          </ul>
          <p>
            We have no idea who visits the site, how often, or what they do. We genuinely cannot track you.
          </p>
        </section>

        <section className="trust-section">
          <h2>Third-Party Services</h2>

          <h3>LA Open Data Portal API</h3>
          <p>
            The application fetches crime data directly from the Los Angeles Open Data Portal
            (data.lacity.org). When you load the map, your browser makes API requests to:
          </p>
          <p>
            <code>https://data.lacity.org/resource/2nrs-mtv8.json</code>
          </p>
          <p>
            These requests are subject to the LA Open Data Portal's privacy policy and terms of service.
            The API may log IP addresses and request patterns for rate limiting and abuse prevention.
            See: <a href="https://data.lacity.org/stories/s/Cities-Rising-Privacy-Policy/g5k9-7679" target="_blank" rel="noopener noreferrer">LA Open Data Privacy Policy</a>
          </p>

          <h3>OpenStreetMap Tiles</h3>
          <p>
            Map tiles are served by OpenStreetMap. When you view the map, your browser requests
            map images from OpenStreetMap tile servers. This is subject to their usage policy.
            See: <a href="https://operations.osmfoundation.org/policies/tiles/" target="_blank" rel="noopener noreferrer">OSM Tile Usage Policy</a>
          </p>

          <h3>No Other Third-Party Services</h3>
          <p>
            We do not integrate with any other third-party services, APIs, CDNs (beyond required React dependencies),
            or data providers.
          </p>
        </section>

        <section className="trust-section">
          <h2>Data Sharing and Disclosure</h2>

          <h3>We Do Not Share Data</h3>
          <p>
            Since we don't collect personal data, there's nothing to share. We do not:
          </p>
          <ul>
            <li>Sell user data</li>
            <li>Share data with advertisers</li>
            <li>Provide data to third parties</li>
            <li>Engage in data brokerage</li>
          </ul>

          <h3>Legal Requests</h3>
          <p>
            If compelled by law enforcement or legal process, we would comply. However, since we don't
            collect or store user data, we would have nothing to provide beyond confirming that we don't
            have the requested information.
          </p>
        </section>

        <section className="trust-section">
          <h2>Data Security</h2>

          <h3>No Data to Secure</h3>
          <p>
            The best security is not collecting data in the first place. Since we don't have databases,
            user accounts, or servers storing personal information, there's no central repository to breach.
          </p>

          <h3>HTTPS Encryption</h3>
          <p>
            The application is served over HTTPS, ensuring encrypted communication between your browser
            and our hosting server. This protects against man-in-the-middle attacks.
          </p>

          <h3>Your Responsibility</h3>
          <p>
            Data stored in your browser's localStorage is only as secure as your device. If someone has
            access to your device, they could view your saved preferences. This includes only non-sensitive
            data like your selected crime metric.
          </p>
        </section>

        <section className="trust-section">
          <h2>Children's Privacy</h2>
          <p>
            The application does not knowingly collect information from children under 13 (or any age).
            The service is designed for general audiences and does not contain age-restricted content,
            but parental guidance is recommended due to the nature of crime data.
          </p>
        </section>

        <section className="trust-section">
          <h2>Your Rights and Choices</h2>

          <h3>Access and Control</h3>
          <p>
            Since all data is stored locally on your device:
          </p>
          <ul>
            <li><strong>Access:</strong> You already have full access to your data via browser developer tools</li>
            <li><strong>Delete:</strong> Clear your browser's localStorage or site data at any time</li>
            <li><strong>Modify:</strong> Change preferences using the application's controls</li>
            <li><strong>Export:</strong> Data is stored as simple JSON in localStorage (viewable in dev tools)</li>
          </ul>

          <h3>Opt-Out</h3>
          <p>
            There's nothing to opt out of, as we don't track you in the first place.
          </p>

          <h3>Do Not Track</h3>
          <p>
            We respect Do Not Track (DNT) browser signals, though they're unnecessary since we don't track anyone.
          </p>
        </section>

        <section className="trust-section">
          <h2>International Users</h2>

          <h3>GDPR Compliance (European Union)</h3>
          <p>
            We are fully compliant with the General Data Protection Regulation (GDPR) because we don't
            collect personal data. Key GDPR rights (access, rectification, erasure, portability, etc.)
            apply to local data you can manage through your browser.
          </p>

          <h3>CCPA Compliance (California)</h3>
          <p>
            We comply with the California Consumer Privacy Act (CCPA) by not selling personal information.
            Since we don't collect personal information, CCPA rights (disclosure, deletion, opt-out) are
            not applicable.
          </p>

          <h3>Other Jurisdictions</h3>
          <p>
            Our privacy-by-design approach (not collecting data) ensures compliance with most privacy
            regulations worldwide.
          </p>
        </section>

        <section className="trust-section">
          <h2>Contact Form Privacy</h2>
          <p>
            If you use the <a href="/contact">Contact page</a> to send us a message:
          </p>
          <ul>
            <li>The form currently opens your email client (we don't receive the data directly)</li>
            <li>If we implement direct form submission, we'll only collect: name, email, category, and message</li>
            <li>Contact information will be used solely to respond to your inquiry</li>
            <li>We won't add you to mailing lists or share your contact info with third parties</li>
            <li>We'll retain contact form data only as long as necessary to resolve your inquiry</li>
          </ul>
        </section>

        <section className="trust-section">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time to reflect changes in our practices
            or legal requirements. Material changes will be reflected in the "Last Updated" date below.
          </p>
          <p>
            If we ever decide to start collecting personal data (which we have no plans to do), we will:
          </p>
          <ul>
            <li>Update this policy prominently</li>
            <li>Display a clear notice on the application</li>
            <li>Obtain your explicit consent where required by law</li>
            <li>Provide easy opt-out mechanisms</li>
          </ul>
        </section>

        <section className="trust-section">
          <h2>Questions or Concerns</h2>
          <p>
            If you have questions about this privacy policy or our privacy practices, please contact us
            via the <a href="/contact">Contact page</a>.
          </p>
        </section>

        <section className="trust-section">
          <h2>Transparency Commitment</h2>
          <p>
            We believe in radical transparency when it comes to privacy. If you want to verify our claims:
          </p>
          <ul>
            <li>Open your browser's developer tools and check the Network tab (you'll see only API requests to data.lacity.org and map tile requests)</li>
            <li>Inspect localStorage (Application tab → Local Storage in Chrome/Edge)</li>
            <li>Review the source code if/when it becomes open source</li>
            <li>Use browser extensions like Privacy Badger or uBlock Origin (you'll see no trackers blocked because there are none)</li>
          </ul>
          <p>
            We encourage technical users to verify these claims independently.
          </p>
        </section>

        <div className="last-updated">
          Last Updated: February 2026<br/>
          Effective Date: February 2026
        </div>
      </div>
    </div>
  );
};

export default Privacy;
