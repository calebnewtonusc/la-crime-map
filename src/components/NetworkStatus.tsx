import React, { useEffect, useState } from 'react';
import { useNetworkStatus, NetworkInfo } from '../utils/networkStatus';
import './NetworkStatus.css';

interface NetworkStatusProps {
  showDetails?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ showDetails = false }) => {
  const networkInfo = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [lastStatus, setLastStatus] = useState<NetworkInfo['status']>(networkInfo.status);

  useEffect(() => {
    // Show notification when status changes
    if (networkInfo.status !== lastStatus) {
      setShowNotification(true);
      setLastStatus(networkInfo.status);

      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [networkInfo.status, lastStatus]);

  const getStatusColor = () => {
    switch (networkInfo.status) {
      case 'online':
        return '#4caf50';
      case 'slow':
        return '#ff9800';
      case 'offline':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = () => {
    switch (networkInfo.status) {
      case 'online':
        return 'Online';
      case 'slow':
        return 'Slow Connection';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (networkInfo.status) {
      case 'online':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="currentColor"/>
            <path d="M7 14C8.5 12.5 10 12 12 12C14 12 15.5 12.5 17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 10C6 7 9 6 12 6C15 6 18 7 21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'slow':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="currentColor"/>
            <path d="M7 14C8.5 12.5 10 12 12 12C14 12 15.5 12.5 17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'offline':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 12C10.5 10.5 11 10 12 10C13 10 14 10.5 15 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Compact Status Indicator */}
      <div className="network-status-indicator" style={{ borderColor: getStatusColor() }}>
        <div className="status-dot" style={{ backgroundColor: getStatusColor() }} />
        <span className="status-icon" style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </span>
        {showDetails && (
          <span className="status-text">{getStatusText()}</span>
        )}
      </div>

      {/* Status Change Notification */}
      {showNotification && (
        <div
          className={`network-notification ${networkInfo.status} ${showNotification ? 'show' : ''}`}
          style={{ borderLeftColor: getStatusColor() }}
        >
          <div className="notification-icon" style={{ color: getStatusColor() }}>
            {getStatusIcon()}
          </div>
          <div className="notification-content">
            <strong>{getStatusText()}</strong>
            {networkInfo.status === 'offline' && (
              <p>You're offline. Some features may be limited.</p>
            )}
            {networkInfo.status === 'slow' && (
              <p>Your connection is slow. Data may take longer to load.</p>
            )}
            {networkInfo.status === 'online' && lastStatus === 'offline' && (
              <p>You're back online!</p>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => setShowNotification(false)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default NetworkStatus;
