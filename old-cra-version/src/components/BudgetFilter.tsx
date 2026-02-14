import React, { useState, useMemo } from 'react';
import { NeighborhoodData } from '../crimeDataService';
import { getNeighborhoodInfo } from '../data/neighborhoodInfo';
import './BudgetFilter.css';

interface BudgetFilterProps {
  neighborhoods: NeighborhoodData[];
  selectedMetric: 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
}

export const BudgetFilter: React.FC<BudgetFilterProps> = ({ neighborhoods, selectedMetric }) => {
  const [maxBudget, setMaxBudget] = useState(3000);
  const [bedroomType, setBedroomType] = useState<'1BR' | '2BR'>('1BR');
  const [showResults, setShowResults] = useState(false);

  const safestInBudget = useMemo(() => {
    return neighborhoods
      .map(n => ({
        ...n,
        info: getNeighborhoodInfo(n.name),
      }))
      .filter(n => {
        const rent = bedroomType === '1BR' ? n.info.avgRent1BR : n.info.avgRent2BR;
        return rent <= maxBudget;
      })
      .sort((a, b) => {
        // Sort by safety (lowest crime first)
        const crimeA = a[selectedMetric] || 0;
        const crimeB = b[selectedMetric] || 0;
        return crimeA - crimeB;
      })
      .slice(0, 10);
  }, [neighborhoods, maxBudget, bedroomType, selectedMetric]);

  const handleSearch = () => {
    setShowResults(true);
  };

  return (
    <div className="budget-filter-container">
      <h3>Safest Neighborhoods in Your Budget</h3>

      <div className="budget-controls">
        <div className="budget-input-group">
          <label>
            Max Monthly Rent: ${maxBudget.toLocaleString()}
          </label>
          <input
            type="range"
            min="1000"
            max="6000"
            step="100"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="budget-slider"
          />
          <div className="budget-range-labels">
            <span>$1,000</span>
            <span>$6,000</span>
          </div>
        </div>

        <div className="bedroom-selector">
          <label>Apartment Size:</label>
          <div className="bedroom-buttons">
            <button
              className={`bedroom-option ${bedroomType === '1BR' ? 'active' : ''}`}
              onClick={() => setBedroomType('1BR')}
            >
              1 Bedroom
            </button>
            <button
              className={`bedroom-option ${bedroomType === '2BR' ? 'active' : ''}`}
              onClick={() => setBedroomType('2BR')}
            >
              2 Bedroom
            </button>
          </div>
        </div>

        <button onClick={handleSearch} className="find-button">
          Find Safest Areas
        </button>
      </div>

      {showResults && (
        <div className="budget-results">
          <h4>Top {safestInBudget.length} Safest Neighborhoods (under ${maxBudget.toLocaleString()}/{bedroomType})</h4>

          {safestInBudget.length > 0 ? (
            <div className="results-list">
              {safestInBudget.map((n, index) => {
                const rent = bedroomType === '1BR' ? n.info.avgRent1BR : n.info.avgRent2BR;
                const crimeRate = n[selectedMetric] || 0;

                return (
                  <div key={n.name} className="budget-result-item">
                    <div className="result-rank">#{index + 1}</div>
                    <div className="result-details">
                      <div className="result-name">{n.name}</div>
                      <div className="result-stats">
                        <span className="stat-item">
                          <strong>${rent.toLocaleString()}/mo</strong> ({bedroomType})
                        </span>
                        <span className="stat-item">
                          Crime: <strong>{crimeRate}/week</strong>
                        </span>
                        <span className="stat-item">
                          Walk Score: <strong>{n.info.walkScore}</strong>
                        </span>
                      </div>
                      <div className="result-tags">
                        {n.info.vibe.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <p>No neighborhoods found in this price range.</p>
              <p>Try increasing your budget or selecting a different apartment size.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
