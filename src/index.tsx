import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './accessibility.css';
import './i18n';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import { logCriticalError } from './utils/errorLogger';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary onError={(error, errorInfo) => {
      logCriticalError('Root Error Boundary caught error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }}>
      <AccessibilityProvider>
        <AppWrapper />
      </AccessibilityProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register service worker for offline support and caching
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service Worker: Content cached for offline use');
  },
  onUpdate: (registration) => {
    console.log('Service Worker: New content available; reload to update');
    // Optionally show a notification to the user
    if (window.confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
