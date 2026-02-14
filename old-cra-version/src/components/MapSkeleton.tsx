// Loading skeleton for the map component
import React from 'react';
import './MapSkeleton.css';

const MapSkeleton: React.FC = () => {
  return (
    <div className="map-skeleton">
      <div className="skeleton-overlay">
        <div className="skeleton-pulse"></div>
        <div className="skeleton-text">
          <div className="skeleton-spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    </div>
  );
};

export default MapSkeleton;
