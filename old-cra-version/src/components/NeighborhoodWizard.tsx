import React, { useState, useMemo } from 'react';
import { NeighborhoodData } from '../crimeDataService';
import { getNeighborhoodInfo } from '../data/neighborhoodInfo';
import './NeighborhoodWizard.css';

interface NeighborhoodWizardProps {
  neighborhoods: NeighborhoodData[];
  onClose: () => void;
}

interface Preferences {
  safety: number; // 1-5
  transit: number;
  walkability: number;
  nightlife: number;
  quiet: number;
  affordability: number;
  schools: number;
  maxBudget: number;
}

export const NeighborhoodWizard: React.FC<NeighborhoodWizardProps> = ({ neighborhoods, onClose }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Preferences>({
    safety: 3,
    transit: 3,
    walkability: 3,
    nightlife: 3,
    quiet: 3,
    affordability: 3,
    schools: 3,
    maxBudget: 3000,
  });

  const updatePreference = (key: keyof Preferences, value: number) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const recommendations = useMemo(() => {
    return neighborhoods
      .map(n => {
        const info = getNeighborhoodInfo(n.name);
        const totalCrime = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft;

        // Calculate score based on preferences
        let score = 0;
        let maxScore = 0;

        // Safety (inverse of crime rate, 0-100 scale)
        const safetyScore = Math.max(0, 100 - totalCrime * 2);
        score += (safetyScore / 100) * preferences.safety * 20;
        maxScore += preferences.safety * 20;

        // Transit
        score += (info.transitScore / 100) * preferences.transit * 20;
        maxScore += preferences.transit * 20;

        // Walkability
        score += (info.walkScore / 100) * preferences.walkability * 20;
        maxScore += preferences.walkability * 20;

        // Nightlife (higher walk score + nightlife vibe)
        const nightlifeScore = info.vibe.includes('nightlife') ? 80 : info.walkScore / 2;
        score += (nightlifeScore / 100) * preferences.nightlife * 20;
        maxScore += preferences.nightlife * 20;

        // Quiet (inverse of noise + quiet vibe)
        const quietScore =
          (info.noiseLevel === 'Low' ? 100 : info.noiseLevel === 'Moderate' ? 60 : 20) +
          (info.vibe.includes('quiet') ? 20 : 0);
        score += (Math.min(quietScore, 100) / 100) * preferences.quiet * 20;
        maxScore += preferences.quiet * 20;

        // Affordability (inverse of rent, capped at budget)
        const avgRent = (info.avgRent1BR + info.avgRent2BR) / 2;
        const affordScore = avgRent <= preferences.maxBudget
          ? Math.max(0, 100 - (avgRent / preferences.maxBudget) * 50)
          : 0;
        score += (affordScore / 100) * preferences.affordability * 20;
        maxScore += preferences.affordability * 20;

        // Schools
        score += (info.schoolRating / 10) * preferences.schools * 20;
        maxScore += preferences.schools * 20;

        const finalScore = maxScore > 0 ? (score / maxScore) * 100 : 0;

        return {
          ...n,
          info,
          score: finalScore,
        };
      })
      .filter(n => n.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [neighborhoods, preferences]);

  const renderStep1 = () => (
    <div className="wizard-step">
      <h3>How important is safety to you?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.safety === val ? 'active' : ''}`}
            onClick={() => updatePreference('safety', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <h3>How important is public transit access?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.transit === val ? 'active' : ''}`}
            onClick={() => updatePreference('transit', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <h3>How important is walkability?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.walkability === val ? 'active' : ''}`}
            onClick={() => updatePreference('walkability', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <button className="next-button" onClick={() => setStep(2)}>
        Next
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <h3>Do you want nightlife nearby?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.nightlife === val ? 'active' : ''}`}
            onClick={() => updatePreference('nightlife', val)}
          >
            {val === 1 ? 'No Thanks' : val === 5 ? 'Yes Please!' : val}
          </button>
        ))}
      </div>

      <h3>How important is a quiet neighborhood?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.quiet === val ? 'active' : ''}`}
            onClick={() => updatePreference('quiet', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <h3>How important are good schools?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.schools === val ? 'active' : ''}`}
            onClick={() => updatePreference('schools', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <div className="wizard-buttons">
        <button className="back-button" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="next-button" onClick={() => setStep(3)}>
          Next
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h3>What's your budget?</h3>
      <div className="budget-input">
        <label>
          Max Monthly Rent: ${preferences.maxBudget.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="6000"
          step="100"
          value={preferences.maxBudget}
          onChange={(e) => updatePreference('maxBudget', Number(e.target.value))}
          className="budget-slider"
        />
        <div className="budget-labels">
          <span>$1,000</span>
          <span>$6,000</span>
        </div>
      </div>

      <h3>How important is affordability?</h3>
      <div className="importance-scale">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            className={`scale-button ${preferences.affordability === val ? 'active' : ''}`}
            onClick={() => updatePreference('affordability', val)}
          >
            {val === 1 ? 'Not Important' : val === 5 ? 'Very Important' : val}
          </button>
        ))}
      </div>

      <div className="wizard-buttons">
        <button className="back-button" onClick={() => setStep(2)}>
          Back
        </button>
        <button className="results-button" onClick={() => setStep(4)}>
          See Recommendations
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="wizard-step">
      <h3>Your Perfect Neighborhood Matches</h3>
      <div className="recommendations-list">
        {recommendations.map((n, index) => {
          const avgRent = Math.round((n.info.avgRent1BR + n.info.avgRent2BR) / 2);
          const totalCrime = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft;

          return (
            <div key={n.name} className="recommendation-item">
              <div className="rec-header">
                <div className="rec-rank">#{index + 1}</div>
                <div className="rec-name-score">
                  <h4>{n.name}</h4>
                  <div className="match-score">
                    {Math.round(n.score)}% Match
                  </div>
                </div>
              </div>

              <div className="rec-details">
                <div className="rec-stat">
                  <span className="stat-label">Avg Rent:</span>
                  <span className="stat-value">${avgRent.toLocaleString()}/mo</span>
                </div>
                <div className="rec-stat">
                  <span className="stat-label">Crime Rate:</span>
                  <span className="stat-value">{totalCrime}/week</span>
                </div>
                <div className="rec-stat">
                  <span className="stat-label">Walk Score:</span>
                  <span className="stat-value">{n.info.walkScore}/100</span>
                </div>
                <div className="rec-stat">
                  <span className="stat-label">Transit Score:</span>
                  <span className="stat-value">{n.info.transitScore}/100</span>
                </div>
                <div className="rec-stat">
                  <span className="stat-label">School Rating:</span>
                  <span className="stat-value">{n.info.schoolRating}/10</span>
                </div>
              </div>

              <div className="rec-tags">
                {n.info.vibe.map(tag => (
                  <span key={tag} className="vibe-tag">{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wizard-buttons">
        <button className="back-button" onClick={() => setStep(1)}>
          Start Over
        </button>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal">
        <button className="wizard-close" onClick={onClose}>×</button>

        <div className="wizard-header">
          <h2>Find Your Perfect Neighborhood</h2>
          <div className="wizard-progress">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`progress-dot ${step >= s ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="wizard-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};
