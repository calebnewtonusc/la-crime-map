import React from 'react';
import { useTranslation } from 'react-i18next';
import './AccessibilityStatement.css';

export const AccessibilityStatement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="accessibility-statement" className="accessibility-statement">
      <div className="statement-container">
        <h1>Accessibility Statement for LA Crime Map</h1>
        <p className="last-updated">
          <strong>Last Updated:</strong> February 2026
        </p>

        <section>
          <h2>Our Commitment</h2>
          <p>
            LA Crime Map is committed to ensuring digital accessibility for all people,
            including those with disabilities. We are continually improving the user
            experience for everyone and applying the relevant accessibility standards.
          </p>
          <p>
            This tool affects people's safety and we believe that everyone, regardless of
            ability, should have equal access to critical crime information in their community.
          </p>
        </section>

        <section>
          <h2>Conformance Status</h2>
          <p>
            The{' '}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Content Accessibility Guidelines (WCAG)
            </a>{' '}
            defines requirements for designers and developers to improve accessibility for
            people with disabilities. It defines three levels of conformance: Level A, Level
            AA, and Level AAA.
          </p>
          <p>
            <strong>
              LA Crime Map is designed to conform with WCAG 2.1 Level AA standards.
            </strong>
          </p>
        </section>

        <section>
          <h2>Accessibility Features</h2>
          <p>We have implemented the following accessibility features:</p>

          <h3>Visual Accessibility</h3>
          <ul>
            <li>
              <strong>High Contrast Mode:</strong> Enhanced color contrast ratios that meet
              WCAG AA standards for improved readability
            </li>
            <li>
              <strong>Colorblind-Friendly Mode:</strong> Pattern and texture-based
              visualizations in addition to color coding for users with color vision
              deficiencies
            </li>
            <li>
              <strong>Adjustable Font Sizes:</strong> Four font size options (Small, Medium,
              Large, Extra Large) that persist across sessions
            </li>
            <li>
              <strong>Clear Visual Indicators:</strong> All interactive elements have clear
              hover and focus states
            </li>
          </ul>

          <h3>Keyboard Navigation</h3>
          <ul>
            <li>
              <strong>Full Keyboard Support:</strong> All functionality is accessible using
              only a keyboard
            </li>
            <li>
              <strong>Visible Focus Indicators:</strong> Clear focus outlines on all
              interactive elements
            </li>
            <li>
              <strong>Logical Tab Order:</strong> Tab navigation follows a logical,
              predictable order
            </li>
            <li>
              <strong>Skip Links:</strong> "Skip to main content" and "Skip to navigation"
              links for efficient navigation
            </li>
            <li>
              <strong>Keyboard Shortcuts:</strong> Common keyboard patterns (Escape to close
              dialogs, Enter to activate buttons)
            </li>
          </ul>

          <h3>Screen Reader Support</h3>
          <ul>
            <li>
              <strong>ARIA Labels:</strong> Comprehensive ARIA labels on all interactive
              elements
            </li>
            <li>
              <strong>Semantic HTML:</strong> Proper heading structure and landmark regions
            </li>
            <li>
              <strong>Live Regions:</strong> Dynamic content updates are announced to screen
              readers
            </li>
            <li>
              <strong>Alternative Text:</strong> All visual information has text equivalents
            </li>
            <li>
              <strong>Descriptive Labels:</strong> All form inputs and buttons have clear,
              descriptive labels
            </li>
          </ul>

          <h3>Language Support</h3>
          <ul>
            <li>
              <strong>English and Spanish:</strong> Full interface translation supporting
              LA's diverse population
            </li>
            <li>
              <strong>Language Detection:</strong> Automatically detects browser language
              preference
            </li>
            <li>
              <strong>Easy Language Switching:</strong> Change language anytime from
              accessibility settings
            </li>
          </ul>

          <h3>Motion and Animation</h3>
          <ul>
            <li>
              <strong>Respects Reduced Motion:</strong> Automatically detects and respects
              "prefers-reduced-motion" system setting
            </li>
            <li>
              <strong>No Auto-Playing Content:</strong> No automatically playing animations or
              videos
            </li>
          </ul>
        </section>

        <section>
          <h2>Compatible Technologies</h2>
          <p>This website is designed to be compatible with the following technologies:</p>
          <ul>
            <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
            <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
            <li>Keyboard navigation</li>
            <li>Voice control software</li>
            <li>Screen magnification software</li>
          </ul>
        </section>

        <section>
          <h2>Tested With</h2>
          <p>We have tested this application with:</p>
          <ul>
            <li>NVDA (NonVisual Desktop Access) on Windows</li>
            <li>VoiceOver on macOS and iOS</li>
            <li>TalkBack on Android</li>
            <li>Keyboard-only navigation</li>
            <li>Browser zoom up to 200%</li>
            <li>Various colorblindness simulations</li>
          </ul>
        </section>

        <section>
          <h2>Known Limitations</h2>
          <p>
            Despite our best efforts to ensure accessibility, there may be some limitations:
          </p>
          <ul>
            <li>
              The interactive map component relies on third-party mapping libraries which may
              have their own accessibility limitations
            </li>
            <li>
              Some complex data visualizations in the Analytics Dashboard may be challenging
              for screen reader users; we provide data tables as alternatives
            </li>
            <li>
              Real-time data updates may occasionally interrupt screen reader announcements
            </li>
          </ul>
          <p>We are actively working to address these limitations in future updates.</p>
        </section>

        <section>
          <h2>Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of LA Crime Map. If you encounter
            any accessibility barriers, please let us know:
          </p>
          <ul>
            <li>
              <strong>GitHub Issues:</strong>{' '}
              <a
                href="https://github.com/yourusername/la-crime-map/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue
              </a>
            </li>
            <li>
              <strong>Email:</strong> accessibility@la-crime-map.com (example)
            </li>
          </ul>
          <p>
            We aim to respond to accessibility feedback within 2 business days and to provide
            a solution within 10 business days.
          </p>
        </section>

        <section>
          <h2>Technical Specifications</h2>
          <ul>
            <li>
              <strong>Standards:</strong> WCAG 2.1 Level AA
            </li>
            <li>
              <strong>Framework:</strong> React with TypeScript
            </li>
            <li>
              <strong>Accessibility Tools:</strong> axe-core for automated testing
            </li>
            <li>
              <strong>ARIA Version:</strong> ARIA 1.2
            </li>
          </ul>
        </section>

        <section>
          <h2>Ongoing Efforts</h2>
          <p>Accessibility is an ongoing effort. We are committed to:</p>
          <ul>
            <li>Regular accessibility audits using automated and manual testing</li>
            <li>User testing with people who rely on assistive technologies</li>
            <li>Staying current with accessibility best practices and standards</li>
            <li>Addressing reported accessibility issues promptly</li>
            <li>Continuous improvement of our accessibility features</li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Content</h2>
          <p>
            This application uses the following third-party services which have their own
            accessibility policies:
          </p>
          <ul>
            <li>
              <strong>LA City Open Data Portal:</strong> Data source for crime statistics
            </li>
            <li>
              <strong>OpenStreetMap:</strong> Map tiles and geographic data
            </li>
            <li>
              <strong>Leaflet:</strong> Interactive mapping library
            </li>
          </ul>
        </section>

        <section className="statement-footer">
          <p>
            This accessibility statement was created on February 14, 2026. It will be
            reviewed and updated as the application evolves.
          </p>
          <p>
            <a href="#top">Back to top</a>
          </p>
        </section>
      </div>
    </div>
  );
};
