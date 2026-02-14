import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../utils/errorLogger';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    logError(error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorBoundary: true
    });

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ff4444" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="#ff4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            <h1>Oops! Something went wrong</h1>

            <p className="error-message">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {this.state.error && (
              <details className="error-details">
                <summary>Error Details (for debugging)</summary>
                <div className="error-stack">
                  <p><strong>Error:</strong> {this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack:</strong></p>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleReset}
                aria-label="Try to recover from error"
              >
                Try Again
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleReload}
                aria-label="Reload the page"
              >
                Reload Page
              </button>

              <button
                className="btn btn-tertiary"
                onClick={this.handleGoHome}
                aria-label="Go to home page"
              >
                Go Home
              </button>
            </div>

            <div className="error-help">
              <p>If this problem persists:</p>
              <ul>
                <li>Try clearing your browser cache</li>
                <li>Check your internet connection</li>
                <li>Try using a different browser</li>
                <li>
                  <a
                    href="https://github.com/yourusername/la-crime-map/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report this issue on GitHub
                  </a>
                </li>
              </ul>
            </div>

            {this.state.errorCount > 1 && (
              <div className="error-warning">
                Multiple errors detected ({this.state.errorCount}).
                Consider reloading the page or clearing your cache.
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
