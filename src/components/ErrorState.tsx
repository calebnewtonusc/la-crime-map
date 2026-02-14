import React from 'react';
import './ErrorState.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  onReset?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading the data. This might be a temporary issue.',
  error,
  onRetry,
  onReset,
}) => {
  return (
    <div className="error-state">
      <div className="error-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>

      {error && (
        <details className="error-details">
          <summary>Technical details</summary>
          <pre className="error-stack">
            <code>{error.message}</code>
            {error.stack && (
              <>
                {'\n\n'}
                <code className="stack-trace">{error.stack}</code>
              </>
            )}
          </pre>
        </details>
      )}

      <div className="error-actions">
        {onRetry && (
          <button className="error-button primary" onClick={onRetry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        {onReset && (
          <button className="error-button secondary" onClick={onReset}>
            Reset Application
          </button>
        )}
      </div>

      <div className="error-help">
        <p className="help-text">
          If this problem persists, try the following:
        </p>
        <ul className="help-list">
          <li>Check your internet connection</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try using a different browser</li>
          <li>Wait a few minutes and try again</li>
        </ul>
        <p className="help-contact">
          Still having issues? The LA Open Data Portal may be temporarily unavailable.
          Visit{' '}
          <a
            href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
            target="_blank"
            rel="noopener noreferrer"
          >
            the official data source
          </a>
          {' '}to check status.
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
