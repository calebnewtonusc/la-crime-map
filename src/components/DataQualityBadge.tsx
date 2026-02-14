import React from 'react';
import './DataQualityBadge.css';

export interface DataQualityProps {
  confidence: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  sampleSize?: number;
  showDetails?: boolean;
}

const DataQualityBadge: React.FC<DataQualityProps> = ({
  confidence,
  lastUpdated,
  sampleSize,
  showDetails = false,
}) => {
  const getConfidenceInfo = () => {
    switch (confidence) {
      case 'high':
        return {
          label: 'High Confidence',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          description: 'Recent data with large sample size',
        };
      case 'medium':
        return {
          label: 'Medium Confidence',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          description: 'Moderate sample size or slightly older data',
        };
      case 'low':
        return {
          label: 'Low Confidence',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          description: 'Limited sample or older data - use with caution',
        };
    }
  };

  const info = getConfidenceInfo();

  return (
    <div className={`data-quality-badge ${confidence}`} title={info.description}>
      <div className="badge-icon">{info.icon}</div>
      <div className="badge-content">
        <span className="badge-label">{info.label}</span>
        {showDetails && (
          <div className="badge-details">
            {lastUpdated && (
              <span className="detail-item">
                Updated: {lastUpdated}
              </span>
            )}
            {sampleSize !== undefined && (
              <span className="detail-item">
                Sample: {sampleSize} incidents
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataQualityBadge;
