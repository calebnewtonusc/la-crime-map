import React, { useEffect, useRef } from 'react';
import './InfoModal.css';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Handle escape key
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-title">How to Use LA Crime Map</h2>
          <button
            ref={closeButtonRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close information modal"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <section className="info-section">
            <h3>Getting Started</h3>
            <p>
              LA Crime Map visualizes real crime data from the Los Angeles Open Data Portal across
              all 21 LAPD Community Police Station areas. Explore crime statistics for the most
              recent 4-week period.
            </p>
          </section>

          <section className="info-section">
            <h3>How to Navigate</h3>
            <ul>
              <li>
                <strong>Select a Metric:</strong> Click the buttons at the top to switch between
                Violent Crime, Car Theft, Break-ins, and Petty Theft.
              </li>
              <li>
                <strong>View on Map:</strong> Each neighborhood is color-coded based on crime
                frequency. Green indicates low crime, progressing through yellow and orange to red
                for very high crime rates.
              </li>
              <li>
                <strong>Hover for Highlight:</strong> Move your mouse over a neighborhood on the
                map or in the stats panel to highlight it.
              </li>
              <li>
                <strong>Click for Details:</strong> Click any neighborhood on the map to see a
                popup with detailed statistics for all crime types.
              </li>
              <li>
                <strong>Zoom and Pan:</strong> Use your mouse wheel to zoom in/out on the map. Click
                and drag to pan around Los Angeles.
              </li>
            </ul>
          </section>

          <section className="info-section">
            <h3>Crime Categories</h3>
            <dl className="crime-definitions">
              <dt>Violent Crime</dt>
              <dd>Assault, robbery, rape, homicide, weapons offenses, kidnapping</dd>

              <dt>Car Theft</dt>
              <dd>Vehicle stolen (cars, motorcycles, scooters, bikes)</dd>

              <dt>Break-ins</dt>
              <dd>Burglary (excluding vehicle burglary)</dd>

              <dt>Petty Theft</dt>
              <dd>All theft crimes, shoplifting, pickpocketing, vehicle burglary</dd>
            </dl>
          </section>

          <section className="info-section">
            <h3>Understanding the Data</h3>
            <p>
              Crime statistics are displayed as <strong>incidents per week</strong> to normalize
              the data. The color legend on the right shows the severity scale for each metric.
              Different crime types have different thresholds based on their typical frequency.
            </p>
          </section>

          <section className="info-section">
            <h3>Data Source</h3>
            <p>
              All data comes from the{' '}
              <a
                href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
                target="_blank"
                rel="noopener noreferrer"
              >
                LA City Open Data Portal
              </a>
              . The dataset includes crimes reported from 2020 to present and is updated regularly
              by the Los Angeles Police Department.
            </p>
          </section>

          <section className="info-section info-note">
            <p>
              <strong>Note:</strong> This visualization is for informational purposes only. Crime
              statistics are approximate and may not reflect all incidents. For official crime
              reports, please contact the LAPD.
            </p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
