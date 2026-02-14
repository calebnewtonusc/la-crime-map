import React, { useState } from 'react';
import { geocodeAddress, GeocodingResult } from '../services/geocodingService';
import './AddressSearch.css';

interface AddressSearchProps {
  onLocationFound: (location: GeocodingResult, radius: number) => void;
}

type RadiusOption = 0.25 | 0.5 | 1;

export const AddressSearch: React.FC<AddressSearchProps> = ({ onLocationFound }) => {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState<RadiusOption>(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<GeocodingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeAddress(address);

      if (result) {
        setLastResult(result);
        onLocationFound(result, radius);
        setError(null);
      } else {
        setError('Address not found. Please try a different address.');
      }
    } catch (err) {
      setError('Failed to search address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: RadiusOption) => {
    setRadius(newRadius);
    if (lastResult) {
      onLocationFound(lastResult, newRadius);
    }
  };

  return (
    <div className="address-search-container">
      <h3>Search by Address</h3>
      <form onSubmit={handleSearch} className="address-search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address (e.g., 123 Main St, Los Angeles)"
            className="address-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="radius-selector">
          <label>Show crime within:</label>
          <div className="radius-options">
            {[0.25, 0.5, 1].map((r) => (
              <button
                key={r}
                type="button"
                className={`radius-option ${radius === r ? 'active' : ''}`}
                onClick={() => handleRadiusChange(r as RadiusOption)}
              >
                {r} mile{r > 0.25 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </form>

      {error && <div className="search-error">{error}</div>}

      {lastResult && (
        <div className="search-result">
          <strong>Location found:</strong>
          <p>{lastResult.display_name}</p>
          <small>Showing crimes within {radius} mile{radius > 0.25 ? 's' : ''}</small>
        </div>
      )}
    </div>
  );
};
