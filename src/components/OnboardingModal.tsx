import React, { useState, useEffect, useRef } from 'react';
import './OnboardingModal.css';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: 'Welcome to LA Crime Map',
      content: (
        <div className="onboarding-step">
          <div className="onboarding-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3>Make Informed Decisions About LA Neighborhoods</h3>
          <p className="onboarding-description">
            LA Crime Map helps you understand crime patterns across Los Angeles neighborhoods
            with data-driven insights from the LAPD's official crime database.
          </p>
          <div className="onboarding-highlights">
            <div className="highlight-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Real-time LAPD data</span>
            </div>
            <div className="highlight-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Colorblind-accessible design</span>
            </div>
            <div className="highlight-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Transparent methodology</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Understanding Crime Data',
      content: (
        <div className="onboarding-step">
          <h3>What the Numbers Mean</h3>
          <p className="onboarding-description">
            All crime statistics are shown as <strong>incidents per week</strong> to give you
            a consistent, easy-to-understand measure across different time periods.
          </p>
          <div className="crime-category-grid">
            <div className="crime-category">
              <div className="category-icon violent">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4>Violent Crime</h4>
              <p>Assault, robbery, rape, homicide, weapons offenses, kidnapping</p>
            </div>
            <div className="crime-category">
              <div className="category-icon car">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4>Car Theft</h4>
              <p>Vehicle theft including cars, motorcycles, scooters, and bikes</p>
            </div>
            <div className="crime-category">
              <div className="category-icon breakin">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4>Break-ins</h4>
              <p>Burglary of homes and buildings (excludes vehicle burglary)</p>
            </div>
            <div className="crime-category">
              <div className="category-icon theft">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4>Petty Theft</h4>
              <p>Theft crimes, shoplifting, pickpocketing, vehicle burglary</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Reading the Map',
      content: (
        <div className="onboarding-step">
          <h3>How to Interpret Crime Levels</h3>
          <p className="onboarding-description">
            We use a colorblind-safe palette that works for everyone. Colors range from
            blue (safest) to red (highest crime), designed to be accessible for all vision types.
          </p>
          <div className="color-legend-demo">
            <div className="legend-row">
              <div className="legend-swatch" style={{ background: '#4575b4' }}></div>
              <div className="legend-info">
                <strong>Very Low</strong>
                <p>Significantly below LA average</p>
              </div>
            </div>
            <div className="legend-row">
              <div className="legend-swatch" style={{ background: '#74add1' }}></div>
              <div className="legend-info">
                <strong>Low</strong>
                <p>Below LA average</p>
              </div>
            </div>
            <div className="legend-row">
              <div className="legend-swatch" style={{ background: '#fee090' }}></div>
              <div className="legend-info">
                <strong>Moderate</strong>
                <p>Near LA average</p>
              </div>
            </div>
            <div className="legend-row">
              <div className="legend-swatch" style={{ background: '#f46d43' }}></div>
              <div className="legend-info">
                <strong>High</strong>
                <p>Above LA average</p>
              </div>
            </div>
            <div className="legend-row">
              <div className="legend-swatch" style={{ background: '#d73027' }}></div>
              <div className="legend-info">
                <strong>Very High</strong>
                <p>Significantly above LA average</p>
              </div>
            </div>
          </div>
          <div className="info-callout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Every neighborhood comparison shows how it ranks against the LA city-wide average,
              giving you important context.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Data Quality & Limitations',
      content: (
        <div className="onboarding-step">
          <h3>Understanding Data Accuracy</h3>
          <p className="onboarding-description">
            We want you to make informed decisions, which means being transparent about
            what this data can and cannot tell you.
          </p>
          <div className="data-quality-info">
            <div className="quality-item">
              <h4>Data Source</h4>
              <p>
                Official crime reports from the Los Angeles Police Department's public database,
                updated regularly. Data reflects reported incidents only.
              </p>
            </div>
            <div className="quality-item">
              <h4>What's Included</h4>
              <p>
                Reported crimes from the past week, month, 3 months, or year (your choice).
                Each metric has confidence indicators based on sample size and recency.
              </p>
            </div>
            <div className="quality-item">
              <h4>Important Limitations</h4>
              <ul>
                <li>Not all crimes are reported to police</li>
                <li>Data may be delayed by several days</li>
                <li>Crime rates don't reflect overall neighborhood safety</li>
                <li>Context matters: population density, patrol frequency, etc.</li>
              </ul>
            </div>
          </div>
          <div className="warning-callout">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <strong>Use Responsibly</strong>
              <p>
                This tool is for informational purposes only. Always visit neighborhoods in person,
                talk to residents, and consult with local authorities for comprehensive safety information.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tips for Using the Map',
      content: (
        <div className="onboarding-step">
          <h3>Get the Most Out of LA Crime Map</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">1</div>
              <h4>Compare Time Periods</h4>
              <p>Use the time selector to see if crime is trending up or down over weeks, months, or the year.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">2</div>
              <h4>Look at All Crime Types</h4>
              <p>A neighborhood may be low in one category but higher in another. Review all metrics for a complete picture.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">3</div>
              <h4>Use Compare Mode</h4>
              <p>Select up to 3 neighborhoods to see side-by-side comparisons of all crime categories.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">4</div>
              <h4>Check Data Quality</h4>
              <p>Look for the confidence indicator badge on each metric to understand data reliability.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">5</div>
              <h4>Consider Context</h4>
              <p>High-traffic areas naturally have more reported crimes. Always consider population density and activity levels.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">6</div>
              <h4>Visit in Person</h4>
              <p>No data replaces personal experience. Walk the neighborhood, talk to residents, and trust your instincts.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentStep(0);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="onboarding-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="onboarding-modal" ref={modalRef}>
        <button
          className="onboarding-close"
          onClick={onClose}
          aria-label="Close onboarding"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="onboarding-content">
          <div className="onboarding-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
                role="button"
                tabIndex={0}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="onboarding-body">
            <h2 id="onboarding-title">{steps[currentStep].title}</h2>
            {steps[currentStep].content}
          </div>

          <div className="onboarding-footer">
            <button
              className="onboarding-button secondary"
              onClick={handleSkip}
            >
              Skip Tutorial
            </button>
            <div className="onboarding-nav">
              {currentStep > 0 && (
                <button
                  className="onboarding-button secondary"
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}
              <button
                className="onboarding-button primary"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
