import React, { useState } from 'react';
import { NeighborhoodData } from '../crimeDataService';
import { NeighborhoodGeoJSON } from '../neighborhoods';
import { AddressSearch } from './AddressSearch';
import { BudgetFilter } from './BudgetFilter';
import { NeighborhoodWizard } from './NeighborhoodWizard';
import { FavoritesManager } from './FavoritesManager';
import { GeocodingResult } from '../services/geocodingService';
import { getNeighborhoodInfo } from '../data/neighborhoodInfo';
import { metroStations } from '../data/transitData';
import './ApartmentHuntingView.css';

interface ApartmentHuntingViewProps {
  neighborhoods: NeighborhoodData[];
  neighborhoodData: NeighborhoodGeoJSON;
  selectedMetric: 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
}

type Tab = 'search' | 'budget' | 'favorites' | 'info';

export const ApartmentHuntingView: React.FC<ApartmentHuntingViewProps> = ({
  neighborhoods,
  selectedMetric,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(0.5);
  const [showTransit, setShowTransit] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const [showNoise, setShowNoise] = useState(false);

  const handleLocationFound = (location: GeocodingResult, radius: number) => {
    setSelectedLocation({ lat: location.lat, lon: location.lon });
    setSearchRadius(radius);
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setActiveTab('search');
  };

  return (
    <div className="apartment-hunting-view">
      <div className="hunting-header">
        <h2>Apartment Hunting Tools</h2>
        <button className="wizard-launch-button" onClick={() => setShowWizard(true)}>
          Find My Perfect Neighborhood
        </button>
      </div>

      <div className="hunting-tabs">
        <button
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Address Search
        </button>
        <button
          className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget Filter
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Saved Addresses
        </button>
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Neighborhood Info
        </button>
      </div>

      <div className="hunting-content">
        {activeTab === 'search' && (
          <div className="tab-content">
            <AddressSearch onLocationFound={handleLocationFound} />

            <div className="overlay-controls">
              <h4>Map Overlays</h4>
              <div className="overlay-toggles">
                <label className="overlay-toggle">
                  <input
                    type="checkbox"
                    checked={showTransit}
                    onChange={(e) => setShowTransit(e.target.checked)}
                  />
                  <span>Show Metro Stations</span>
                </label>
                <label className="overlay-toggle">
                  <input
                    type="checkbox"
                    checked={showSchools}
                    onChange={(e) => setShowSchools(e.target.checked)}
                  />
                  <span>Show School Ratings</span>
                </label>
                <label className="overlay-toggle">
                  <input
                    type="checkbox"
                    checked={showNoise}
                    onChange={(e) => setShowNoise(e.target.checked)}
                  />
                  <span>Show Noise Indicators</span>
                </label>
              </div>
            </div>

            {showTransit && (
              <div className="transit-info">
                <h4>Nearby Metro Stations</h4>
                <div className="transit-legend">
                  <div className="legend-item">
                    <span className="transit-icon red-line"></span>
                    <span>Red Line</span>
                  </div>
                  <div className="legend-item">
                    <span className="transit-icon blue-line"></span>
                    <span>Blue Line</span>
                  </div>
                  <div className="legend-item">
                    <span className="transit-icon expo-line"></span>
                    <span>Expo Line</span>
                  </div>
                  <div className="legend-item">
                    <span className="transit-icon gold-line"></span>
                    <span>Gold Line</span>
                  </div>
                </div>
                <p className="info-text">
                  {metroStations.length} Metro stations in the LA area.
                  Toggle to view on map.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <BudgetFilter neighborhoods={neighborhoods} selectedMetric={selectedMetric} />
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="tab-content">
            <FavoritesManager
              neighborhoods={neighborhoods}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="tab-content">
            <NeighborhoodInfoPanel neighborhoods={neighborhoods} />
          </div>
        )}
      </div>

      {showWizard && (
        <NeighborhoodWizard
          neighborhoods={neighborhoods}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
};

// Neighborhood info panel component
const NeighborhoodInfoPanel: React.FC<{ neighborhoods: NeighborhoodData[] }> = ({ neighborhoods }) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  const selected = selectedNeighborhood
    ? neighborhoods.find(n => n.name === selectedNeighborhood)
    : null;

  const selectedInfo = selected ? getNeighborhoodInfo(selected.name) : null;

  return (
    <div className="neighborhood-info-panel">
      <h3>Detailed Neighborhood Information</h3>

      <select
        value={selectedNeighborhood || ''}
        onChange={(e) => setSelectedNeighborhood(e.target.value || null)}
        className="neighborhood-select"
      >
        <option value="">Select a neighborhood...</option>
        {neighborhoods
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(n => (
            <option key={n.name} value={n.name}>
              {n.name}
            </option>
          ))}
      </select>

      {selected && selectedInfo && (
        <div className="info-details">
          <div className="info-section">
            <h4>Rental Prices</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">1 Bedroom:</span>
                <span className="value">${selectedInfo.avgRent1BR.toLocaleString()}/mo</span>
              </div>
              <div className="info-item">
                <span className="label">2 Bedroom:</span>
                <span className="value">${selectedInfo.avgRent2BR.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Crime Statistics (per week)</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Violent Crime:</span>
                <span className="value">{selected.violentCrime}</span>
              </div>
              <div className="info-item">
                <span className="label">Car Theft:</span>
                <span className="value">{selected.carTheft}</span>
              </div>
              <div className="info-item">
                <span className="label">Break-ins:</span>
                <span className="value">{selected.breakIns}</span>
              </div>
              <div className="info-item">
                <span className="label">Petty Theft:</span>
                <span className="value">{selected.pettyTheft}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Livability Scores</h4>
            <div className="score-bars">
              <div className="score-bar">
                <div className="score-label">
                  <span>Walk Score</span>
                  <span className="score-value">{selectedInfo.walkScore}/100</span>
                </div>
                <div className="bar-background">
                  <div className="bar-fill" style={{ width: `${selectedInfo.walkScore}%` }}></div>
                </div>
              </div>
              <div className="score-bar">
                <div className="score-label">
                  <span>Bike Score</span>
                  <span className="score-value">{selectedInfo.bikeScore}/100</span>
                </div>
                <div className="bar-background">
                  <div className="bar-fill" style={{ width: `${selectedInfo.bikeScore}%` }}></div>
                </div>
              </div>
              <div className="score-bar">
                <div className="score-label">
                  <span>Transit Score</span>
                  <span className="score-value">{selectedInfo.transitScore}/100</span>
                </div>
                <div className="bar-background">
                  <div className="bar-fill" style={{ width: `${selectedInfo.transitScore}%` }}></div>
                </div>
              </div>
              <div className="score-bar">
                <div className="score-label">
                  <span>School Rating</span>
                  <span className="score-value">{selectedInfo.schoolRating}/10</span>
                </div>
                <div className="bar-background">
                  <div className="bar-fill" style={{ width: `${selectedInfo.schoolRating * 10}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Environment</h4>
            <div className="environment-tags">
              <div className={`env-tag noise-${selectedInfo.noiseLevel.toLowerCase()}`}>
                Noise Level: {selectedInfo.noiseLevel}
              </div>
              {selectedInfo.nearAirport && (
                <div className="env-tag warning">Near Airport</div>
              )}
              {selectedInfo.nearFreeway && (
                <div className="env-tag warning">Near Freeway</div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h4>Neighborhood Vibe</h4>
            <div className="vibe-tags">
              {selectedInfo.vibe.map(tag => (
                <span key={tag} className="vibe-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h4>User Reviews</h4>
            <div className="reviews-placeholder">
              <p>User reviews coming soon!</p>
              <p className="placeholder-text">
                This feature will allow residents and former residents to share their experiences
                about living in {selected.name}.
              </p>
              <button className="placeholder-button" disabled>
                Add Your Review (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="no-selection">
          <p>Select a neighborhood to view detailed information</p>
        </div>
      )}
    </div>
  );
};
