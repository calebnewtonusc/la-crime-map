import React, { useState } from 'react';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Crime metrics type
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

interface NeighborhoodData {
  name: string;
  violentCrime: number; // per week
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
}

// Mock data - we'll replace with real LA data
const mockNeighborhoods: NeighborhoodData[] = [
  { name: 'Downtown LA', violentCrime: 12, carTheft: 8, breakIns: 15, pettyTheft: 25 },
  { name: 'Venice', violentCrime: 5, carTheft: 12, breakIns: 10, pettyTheft: 18 },
  { name: 'Hollywood', violentCrime: 8, carTheft: 10, breakIns: 12, pettyTheft: 20 },
  { name: 'Palms', violentCrime: 3, carTheft: 6, breakIns: 7, pettyTheft: 10 },
  { name: 'West LA', violentCrime: 2, carTheft: 5, breakIns: 4, pettyTheft: 8 },
];

function App() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime');

  const metricLabels: Record<CrimeMetric, string> = {
    violentCrime: 'Violent Crime',
    carTheft: 'Car Theft',
    breakIns: 'Break-ins',
    pettyTheft: 'Petty Theft'
  };

  // Get color based on crime rate
  const getColor = (value: number, metric: CrimeMetric): string => {
    // Different thresholds for different metrics
    const thresholds: Record<CrimeMetric, number[]> = {
      violentCrime: [2, 5, 10],
      carTheft: [5, 10, 15],
      breakIns: [5, 10, 15],
      pettyTheft: [10, 20, 30]
    };

    const t = thresholds[metric];
    if (value < t[0]) return '#00ff00'; // Green - low
    if (value < t[1]) return '#ffff00'; // Yellow - moderate
    if (value < t[2]) return '#ff9900'; // Orange - high
    return '#ff0000'; // Red - very high
  };

  return (
    <div className="App">
      <div className="header">
        <h1>LA Crime Map</h1>
        <p>Visualize crime by neighborhood</p>
      </div>

      <div className="metric-selector">
        {(Object.keys(metricLabels) as CrimeMetric[]).map(metric => (
          <button
            key={metric}
            className={selectedMetric === metric ? 'active' : ''}
            onClick={() => setSelectedMetric(metric)}
          >
            {metricLabels[metric]}
          </button>
        ))}
      </div>

      <div className="map-container">
        <MapContainer
          center={[34.0522, -118.2437]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </MapContainer>
      </div>

      <div className="stats-panel">
        <h3>Current Metric: {metricLabels[selectedMetric]}</h3>
        <div className="neighborhood-list">
          {mockNeighborhoods.map(n => (
            <div
              key={n.name}
              className="neighborhood-item"
              style={{
                borderLeft: `4px solid ${getColor(n[selectedMetric], selectedMetric)}`
              }}
            >
              <span className="neighborhood-name">{n.name}</span>
              <span className="crime-value">{n[selectedMetric]} per week</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
