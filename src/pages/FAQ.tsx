import React, { useState } from 'react';
import './TrustPages.css';

interface FAQItem {
  question: string;
  answer: string | React.ReactElement;
  category: 'data' | 'usage' | 'technical' | 'safety';
}

const FAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0])); // First item expanded by default

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const faqs: FAQItem[] = [
    {
      category: 'data',
      question: 'Where does the crime data come from?',
      answer: (
        <>
          All crime data comes directly from the <a href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8" target="_blank" rel="noopener noreferrer">Los Angeles Open Data Portal</a>,
          maintained by the Los Angeles Police Department (LAPD). This is the official, publicly available dataset
          of reported crimes from 2020 to present. We do not modify or alter the source data; we only categorize
          and visualize it.
        </>
      )
    },
    {
      category: 'data',
      question: 'How often is the data updated?',
      answer: 'The LAPD typically updates the crime dataset weekly, every Tuesday. Our application caches data for 1 hour to improve performance. This means the data you see may be up to ~7-8 days old. You can force a refresh using the "Refresh" button in the header.'
    },
    {
      category: 'data',
      question: 'Why are some neighborhoods missing?',
      answer: 'Our map shows LAPD\'s 21 Community Police Station areas (also called Bureau Areas), not traditional neighborhood names. These are official police divisions that may encompass multiple neighborhoods. If you don\'t see a specific neighborhood name, it\'s included within one of the 21 police divisions.'
    },
    {
      category: 'data',
      question: 'Are all crimes included in the data?',
      answer: 'No. The data only includes crimes that were reported to the LAPD. Many crimes go unreported. Additionally, we categorize crimes into four specific metrics (Violent Crime, Car Theft, Break-ins, Petty Theft). Some crime types that don\'t fit these categories are excluded from our visualizations, though they exist in the original dataset.'
    },
    {
      category: 'data',
      question: 'Why do the numbers seem low/high?',
      answer: (
        <>
          <p><strong>Numbers may seem low because:</strong></p>
          <ul>
            <li>We show crimes per <strong>week</strong>, not per year</li>
            <li>Many crimes go unreported</li>
            <li>We exclude some crime categories that don\'t fit our four metrics</li>
          </ul>
          <p><strong>Numbers may seem high because:</strong></p>
          <ul>
            <li>They represent raw counts, not adjusted for population density</li>
            <li>Police divisions cover large areas with many residents</li>
            <li>The data includes all reported incidents, including minor ones</li>
          </ul>
        </>
      )
    },
    {
      category: 'usage',
      question: 'How do I interpret the colors on the map?',
      answer: (
        <>
          <p>Each neighborhood is color-coded based on the selected crime metric using quartiles (25th percentile intervals):</p>
          <ul>
            <li><span style={{color: '#00ff00', fontWeight: 'bold'}}>Green</span> - Low (bottom 25%)</li>
            <li><span style={{color: '#ffff00', fontWeight: 'bold'}}>Yellow</span> - Moderate (25-50%)</li>
            <li><span style={{color: '#ff9900', fontWeight: 'bold'}}>Orange</span> - High (50-75%)</li>
            <li><span style={{color: '#ff0000', fontWeight: 'bold'}}>Red</span> - Very High (top 25%)</li>
          </ul>
          <p>Colors are relative to other areas in LA, not absolute safety indicators.</p>
        </>
      )
    },
    {
      category: 'usage',
      question: 'Can I use this to decide where to live?',
      answer: 'This tool can be one factor in your research, but it should not be the only factor. Crime statistics don\'t capture quality of life, amenities, schools, community character, or many other important considerations. Additionally, the data shows police divisions (large areas), not specific streets or blocks. We recommend visiting areas in person, talking to residents, and consulting multiple sources of information.'
    },
    {
      category: 'usage',
      question: 'What\'s the difference between "Map View" and "Analytics Dashboard"?',
      answer: 'Map View shows the interactive geographic map with color-coded neighborhoods and detailed statistics. Analytics Dashboard provides charts, trends, and comparative analysis across all neighborhoods and crime types. Use Map View to explore specific areas, and Analytics Dashboard to identify patterns and compare metrics.'
    },
    {
      category: 'usage',
      question: 'How do I compare multiple neighborhoods?',
      answer: 'Click the "Compare Mode" button in Map View, then click up to 3 neighborhoods on the map. A comparison table will appear in the sidebar showing all four crime metrics side-by-side. You can also use the Analytics Dashboard to view all neighborhoods at once in chart form.'
    },
    {
      category: 'technical',
      question: 'Why is the map loading slowly?',
      answer: (
        <>
          <p>Several factors can affect loading speed:</p>
          <ul>
            <li><strong>First load:</strong> The initial load fetches up to 50,000 crime records from the API, which takes 5-15 seconds</li>
            <li><strong>LA Open Data Portal speed:</strong> The API\'s response time varies</li>
            <li><strong>Your internet connection:</strong> Slower connections will take longer</li>
            <li><strong>Browser cache:</strong> After the first load, data is cached for 1 hour for much faster subsequent loads</li>
          </ul>
          <p>Try refreshing the page or checking your internet connection if the map doesn\'t load within 30 seconds.</p>
        </>
      )
    },
    {
      category: 'technical',
      question: 'Does this work on mobile devices?',
      answer: 'Yes! The application is fully responsive and works on phones and tablets. However, some features like the comparison table and detailed charts may be easier to view on larger screens. We recommend using landscape orientation on phones for the best map experience.'
    },
    {
      category: 'technical',
      question: 'Do you collect my personal data?',
      answer: (
        <>
          No. We do not collect, store, or transmit any personal information. All data processing happens locally in your browser.
          We do use localStorage to save your preferences (selected metrics, date range, etc.) so they persist between visits,
          but this data never leaves your device. See our <a href="/privacy">Privacy Policy</a> for full details.
        </>
      )
    },
    {
      category: 'technical',
      question: 'Why does the data seem outdated?',
      answer: 'For demonstration purposes, the application currently queries data from December 2024. In a production version, this would use live, current data. The methodology and visualizations are accurate; only the time period is fixed for testing stability. This will be updated to use real-time data in future releases.'
    },
    {
      category: 'safety',
      question: 'Is a "green" area safe and a "red" area dangerous?',
      answer: 'No! The colors show relative crime rates compared to other LA areas, not absolute safety. A "red" area simply has higher reported crimes than a "green" area, but this doesn\'t mean it\'s "dangerous." Many factors affect safety: time of day, specific location within the division, type of activity, and personal circumstances. Additionally, higher crime counts may simply reflect higher population density.'
    },
    {
      category: 'safety',
      question: 'Should I avoid red areas?',
      answer: 'Not necessarily. The "red" designation means higher crime counts relative to other LAPD divisions, but every area of Los Angeles has millions of safe interactions daily. Crime statistics don\'t capture the full picture of a community. Many "red" areas have vibrant cultures, strong communities, excellent amenities, and are perfectly safe for most people most of the time.'
    },
    {
      category: 'safety',
      question: 'I witnessed a crime. Should I report it here?',
      answer: (
        <>
          <strong>No! This is not a crime reporting tool.</strong> To report a crime:
          <ul>
            <li><strong>Emergency:</strong> Call 911</li>
            <li><strong>Non-emergency:</strong> Call LAPD at 1-877-ASK-LAPD (1-877-275-5273)</li>
            <li><strong>Online:</strong> Visit <a href="https://www.lapdonline.org/" target="_blank" rel="noopener noreferrer">www.lapdonline.org</a></li>
          </ul>
          This application only visualizes existing reported crimes; it does not collect new reports.
        </>
      )
    },
    {
      category: 'safety',
      question: 'Can I see specific crime incidents or addresses?',
      answer: 'No. To protect victim privacy, we only show aggregated statistics at the police division level (large areas covering multiple neighborhoods). The LAPD rounds exact addresses to the nearest hundred block in their source data, and we aggregate further. If you need detailed incident-level data, visit the LA Open Data Portal directly.'
    },
    {
      category: 'data',
      question: 'What counts as "Violent Crime"?',
      answer: 'We categorize the following as violent crime: assault (aggravated, with weapon), robbery, sexual assault, rape, homicide, murder, manslaughter, kidnapping, and weapons-related incidents. Simple battery without a weapon is excluded to focus on more serious violent crimes. This is our categorization and may differ from FBI UCR or other classification systems.'
    },
    {
      category: 'data',
      question: 'Why don\'t the numbers match other crime statistics I\'ve seen?',
      answer: 'Different sources use different methodologies, time periods, geographic boundaries, and crime categorizations. FBI UCR data differs from local LAPD data. News reports may cite different metrics. Population-adjusted rates differ from raw counts. Our numbers are based on a specific methodology (see our About page) applied to LAPD\'s official dataset. Small variations are normal and expected.'
    },
    {
      category: 'usage',
      question: 'Can I download the data?',
      answer: (
        <>
          This application doesn\'t offer data downloads, but you can access the raw data directly from the{' '}
          <a href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8" target="_blank" rel="noopener noreferrer">
            LA Open Data Portal
          </a>. The portal offers CSV, JSON, and API access to all crime records. If you want our processed/aggregated
          data, contact us via the <a href="/contact">Contact page</a>.
        </>
      )
    },
    {
      category: 'technical',
      question: 'Is this application open source?',
      answer: 'The application is designed to be transparent and potentially open source. We believe in verifiable, transparent data analysis. If you\'re interested in the source code or methodology details, contact us via the Contact page.'
    },
    {
      category: 'usage',
      question: 'Can I embed this map on my website?',
      answer: 'Currently, the application doesn\'t support embedding. If you\'re interested in using this tool on your website, blog, or research project, please contact us via the Contact page to discuss options and proper attribution.'
    },
    {
      category: 'safety',
      question: 'Are crime rates in LA going up or down?',
      answer: 'This application shows current statistics, not historical trends over multiple years. To analyze long-term trends, you would need to compare data across different time periods. The LA Open Data Portal provides data back to 2020, which you can analyze directly. Crime trends vary by neighborhood, crime type, and many other factors.'
    }
  ];

  const categories = [
    { id: 'data', label: 'Data & Sources', icon: '📊' },
    { id: 'usage', label: 'Using the Tool', icon: '🗺️' },
    { id: 'technical', label: 'Technical', icon: '⚙️' },
    { id: 'safety', label: 'Safety & Interpretation', icon: '🛡️' }
  ];

  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>Frequently Asked Questions</h1>

        <div className="faq-intro">
          <p>
            Find answers to common questions about LA Crime Map. Click any question to expand the answer.
            If your question isn't answered here, please visit our <a href="/contact">Contact page</a>.
          </p>
        </div>

        {categories.map(category => {
          const categoryFAQs = faqs.filter(faq => faq.category === category.id);
          const startIndex = faqs.findIndex(faq => faq.category === category.id);

          return (
            <section key={category.id} className="trust-section faq-category">
              <h2>{category.icon} {category.label}</h2>

              <div className="faq-list">
                {categoryFAQs.map((faq, categoryIndex) => {
                  const globalIndex = startIndex + categoryIndex;
                  const isExpanded = expandedItems.has(globalIndex);

                  return (
                    <div
                      key={globalIndex}
                      className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleItem(globalIndex)}
                        aria-expanded={isExpanded}
                      >
                        <span className="faq-question-text">{faq.question}</span>
                        <span className="faq-toggle-icon">{isExpanded ? '−' : '+'}</span>
                      </button>

                      {isExpanded && (
                        <div className="faq-answer">
                          {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="trust-section">
          <h2>Still Have Questions?</h2>
          <p>
            If you didn't find the answer you were looking for, please:
          </p>
          <ul>
            <li>Visit our <a href="/about">About page</a> for detailed methodology information</li>
            <li>Check our <a href="/data-sources">Data Sources page</a> for technical details about the data</li>
            <li>Read our <a href="/disclaimers">Disclaimers & Limitations page</a> for important context</li>
            <li>Contact us via the <a href="/contact">Contact page</a> with your specific question</li>
          </ul>
        </section>

        <div className="last-updated">
          Last Updated: February 2026
        </div>
      </div>
    </div>
  );
};

export default FAQ;
