import React from 'react';
import './ErrorDisplay.css';

export interface ErrorDisplayProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  actions?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
  onDismiss?: () => void;
  showDetails?: boolean;
  details?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  type = 'error',
  actions = [],
  onDismiss,
  showDetails = false,
  details
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 10V14M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  return (
    <div className={`error-display error-display-${type}`}>
      <div className="error-display-content">
        <div className="error-display-icon">
          {getIcon()}
        </div>

        <div className="error-display-text">
          {title && <h3 className="error-display-title">{title}</h3>}
          <p className="error-display-message">{message}</p>

          {showDetails && details && (
            <details
              className="error-display-details"
              open={detailsExpanded}
              onToggle={() => setDetailsExpanded(!detailsExpanded)}
            >
              <summary>Technical Details</summary>
              <pre>{details}</pre>
            </details>
          )}
        </div>

        {onDismiss && (
          <button
            className="error-display-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>

      {actions.length > 0 && (
        <div className="error-display-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`error-action-btn ${action.primary ? 'primary' : 'secondary'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;

/**
 * Inline Error Display (smaller, for inline use)
 */
export const InlineError: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <div className="inline-error">
    <span className="inline-error-icon">⚠</span>
    <span className="inline-error-message">{message}</span>
    {onRetry && (
      <button className="inline-error-retry" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);

/**
 * Stale Data Warning Banner
 */
export const StaleDataWarning: React.FC<{
  message?: string;
  onRefresh?: () => void;
}> = ({
  message = 'Data may be outdated. You are viewing cached information.',
  onRefresh
}) => (
  <div className="stale-data-warning">
    <div className="stale-warning-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span>{message}</span>
    </div>
    {onRefresh && (
      <button className="stale-warning-btn" onClick={onRefresh}>
        Refresh
      </button>
    )}
  </div>
);
