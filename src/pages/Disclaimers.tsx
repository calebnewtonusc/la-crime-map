import React from 'react';
import './TrustPages.css';

const Disclaimers: React.FC = () => {
  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>Disclaimers & Limitations</h1>

        <div className="disclaimer-banner">
          <strong>Important:</strong> This tool is for informational and educational purposes only.
          It should not be used as the sole basis for personal safety decisions or property transactions.
        </div>

        <section className="trust-section">
          <h2>General Disclaimer</h2>
          <p>
            LA Crime Map ("we," "our," or "the application") provides crime data visualization based on publicly
            available information from the Los Angeles Police Department. While we strive for accuracy, we make
            no warranties, express or implied, regarding the completeness, accuracy, reliability, or timeliness
            of the data presented.
          </p>
          <p>
            <strong>USE THIS INFORMATION AT YOUR OWN RISK.</strong> We are not responsible for any decisions
            made based on the data or visualizations provided by this application.
          </p>
        </section>

        <section className="trust-section">
          <h2>Data Limitations</h2>

          <h3>1. Reporting Delays</h3>
          <p>
            Crime data is updated weekly by the LAPD, typically every Tuesday. There may be a delay of 1-8 days
            between when a crime occurs and when it appears in the dataset. Recent crimes may not be immediately
            reflected in the visualizations.
          </p>

          <h3>2. Underreporting</h3>
          <p>
            Not all crimes are reported to police. Studies suggest that many crimes, particularly property crimes
            and certain violent crimes, go unreported. The data shown represents only <strong>reported crimes</strong>
            and may not reflect the true incidence of crime in any given area.
          </p>

          <h3>3. Data Entry Errors</h3>
          <p>
            Crime records are transcribed from original paper reports. Transcription errors, missing data,
            and classification inconsistencies may occur. Some records may have incomplete or inaccurate
            location information.
          </p>

          <h3>4. Address Rounding</h3>
          <p>
            To protect victim privacy, the LAPD rounds crime locations to the nearest hundred block
            (e.g., "1200 block of Main St" instead of "1234 Main St"). This may cause crimes to appear in
            slightly different locations than where they actually occurred.
          </p>

          <h3>5. Neighborhood Boundaries</h3>
          <p>
            Crimes are mapped to LAPD Community Police Station areas, which may not align perfectly with
            commonly understood neighborhood boundaries. A single police division may encompass multiple
            neighborhoods, or a neighborhood may span multiple divisions.
          </p>

          <h3>6. Crime Classification</h3>
          <p>
            Our categorization of crimes into four metrics (Violent Crime, Car Theft, Break-ins, Petty Theft)
            is based on crime code descriptions and may not perfectly align with legal definitions or other
            classification systems. Some crimes may not fit neatly into our categories and are excluded.
          </p>

          <h3>7. Population Not Considered</h3>
          <p>
            Crime counts are displayed as raw numbers per week, <strong>not adjusted for population density</strong>.
            Areas with higher populations may naturally have higher crime counts without necessarily being more
            dangerous on a per-capita basis.
          </p>

          <h3>8. Time-Based Variations</h3>
          <p>
            Crime patterns vary significantly by time of day, day of week, and season. The aggregated weekly
            statistics do not capture these temporal variations.
          </p>

          <h3>9. Historical Data Only</h3>
          <p>
            This application presents historical data (2020-present). Past crime patterns do not guarantee
            future trends. Crime rates can change rapidly due to various social, economic, and policing factors.
          </p>
        </section>

        <section className="trust-section">
          <h2>Legal Disclaimers</h2>

          <h3>No Warranty</h3>
          <p>
            THIS APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            IN NO EVENT SHALL THE AUTHORS, CONTRIBUTORS, OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES,
            OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR
            IN CONNECTION WITH THE APPLICATION OR THE USE OR OTHER DEALINGS IN THE APPLICATION.
          </p>

          <h3>Not Legal or Professional Advice</h3>
          <p>
            The information provided does not constitute legal, professional, or safety advice. For official
            crime reports, safety recommendations, or legal matters, please consult:
          </p>
          <ul>
            <li>Los Angeles Police Department: <a href="https://www.lapdonline.org/" target="_blank" rel="noopener noreferrer">www.lapdonline.org</a></li>
            <li>Emergency: Call 911</li>
            <li>Non-emergency LAPD: Call 1-877-ASK-LAPD (1-877-275-5273)</li>
          </ul>

          <h3>No Affiliation</h3>
          <p>
            This application is an independent project and is <strong>not affiliated with, endorsed by, or
            connected to</strong> the Los Angeles Police Department, the City of Los Angeles, or any government agency.
          </p>

          <h3>Data Ownership</h3>
          <p>
            All crime data is owned by and sourced from the Los Angeles Police Department via the Los Angeles
            Open Data Portal. We claim no ownership over the source data.
          </p>
        </section>

        <section className="trust-section">
          <h2>Responsible Use Guidelines</h2>

          <h3>Do:</h3>
          <ul className="do-list">
            <li>Use the data to understand general crime trends in Los Angeles</li>
            <li>Compare crime patterns across different neighborhoods</li>
            <li>Supplement your research with multiple sources of information</li>
            <li>Consider the limitations and context when interpreting data</li>
            <li>Report suspicious activity to the police, not to this application</li>
          </ul>

          <h3>Don't:</h3>
          <ul className="dont-list">
            <li>Make real estate decisions based solely on this data</li>
            <li>Use the data to discriminate against individuals or communities</li>
            <li>Assume that low crime areas are "safe" or high crime areas are "dangerous"</li>
            <li>Rely on this as your only source of crime information</li>
            <li>Use outdated data (always check the "Last Updated" timestamp)</li>
            <li>Share or republish the data without proper attribution to the LAPD</li>
          </ul>
        </section>

        <section className="trust-section">
          <h2>Technical Limitations</h2>

          <h3>Browser Compatibility</h3>
          <p>
            This application works best on modern web browsers (Chrome, Firefox, Safari, Edge).
            Older browsers may not display maps or visualizations correctly.
          </p>

          <h3>Data Caching</h3>
          <p>
            Crime data is cached in your browser for up to 1 hour. If you need the most current data,
            use the "Refresh" button to clear the cache.
          </p>

          <h3>API Availability</h3>
          <p>
            This application depends on the LA Open Data Portal API. If the API is unavailable or slow,
            data may not load properly. We have no control over the API's uptime or performance.
          </p>

          <h3>Mobile Experience</h3>
          <p>
            While optimized for mobile devices, some features may work better on larger screens.
            Complex visualizations may be harder to interpret on small displays.
          </p>
        </section>

        <section className="trust-section">
          <h2>Privacy Considerations</h2>
          <p>
            While the LAPD takes measures to protect victim privacy (address rounding, etc.), crime data
            is inherently public information. If you are a victim of crime and have privacy concerns,
            please contact the LAPD directly.
          </p>
          <p>
            We do not collect, store, or process any personally identifiable information beyond what is
            necessary for the application to function (see our <a href="/privacy">Privacy Policy</a>).
          </p>
        </section>

        <section className="trust-section">
          <h2>Reporting Issues</h2>
          <p>
            If you notice data inaccuracies, technical issues, or have concerns about the application,
            please contact us via our <a href="/contact">Contact page</a>.
          </p>
          <p>
            <strong>For data corrections:</strong> Contact the LAPD directly, as we do not modify or
            control the source data.
          </p>
        </section>

        <section className="trust-section">
          <h2>Changes to This Disclaimer</h2>
          <p>
            We reserve the right to update this disclaimer at any time. Material changes will be reflected
            in the "Last Updated" date below. Continued use of the application after changes constitutes
            acceptance of the updated disclaimer.
          </p>
        </section>

        <div className="disclaimer-footer">
          <p>
            <strong>By using this application, you acknowledge that you have read, understood, and agree to
            these disclaimers and limitations.</strong>
          </p>
        </div>

        <div className="last-updated">
          Last Updated: February 2026
        </div>
      </div>
    </div>
  );
};

export default Disclaimers;
