import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { laNeighborhoods, NeighborhoodGeoJSON } from './neighborhoods';
import { fetchCrimeData, NeighborhoodData } from './crimeDataService';

// Crime metrics type
type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

function App() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime');
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodGeoJSON>(laNeighborhoods);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('Loading...');

  // Fetch real crime data on mount
  useEffect(() => {
    async function loadRealCrimeData() {
      setLoading(true);
      try {
        console.log('Fetching real crime data from LA Open Data API...');
        const realData = await fetchCrimeData(4); // 4 weeks of data

        if (realData.length === 0) {
          setDataSource('Using sample data (API returned no data)');
          setLoading(false);
          return;
        }

        console.log(`Got ${realData.length} neighborhoods with crime data`);

        // Create a map of neighborhood name to crime stats
        const crimeMap = new Map<string, NeighborhoodData>();
        realData.forEach(neighborhood => {
          crimeMap.set(neighborhood.name, neighborhood);
        });

        // Update GeoJSON properties with real data
        const updatedGeoJSON: NeighborhoodGeoJSON = {
          ...laNeighborhoods,
          features: laNeighborhoods.features.map(feature => {
            const realCrimeData = crimeMap.get(feature.properties.name);

            if (realCrimeData) {
              // Use real data
              return {
                ...feature,
                properties: {
                  name: feature.properties.name,
                  violentCrime: realCrimeData.violentCrime,
                  carTheft: realCrimeData.carTheft,
                  breakIns: realCrimeData.breakIns,
                  pettyTheft: realCrimeData.pettyTheft
                }
              };
            } else {
              // Keep mock data if no real data available
              return feature;
            }
          })
        };

        setNeighborhoodData(updatedGeoJSON);
        setDataSource('Real LA Crime Data (last 4 weeks)');
        console.log('Successfully loaded real crime data');

      } catch (error) {
        console.error('Error loading crime data:', error);
        setDataSource('Using sample data (API error)');
      } finally {
        setLoading(false);
      }
    }

    loadRealCrimeData();
  }, []);

  // Extract neighborhood data from GeoJSON for the stats panel
  const neighborhoods: NeighborhoodData[] = neighborhoodData.features.map(
    feature => feature.properties
  );

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

  // Style function for GeoJSON polygons
  const style = (feature: any) => {
    const props = feature.properties;
    const value = props[selectedMetric] || 0;
    const color = getColor(value, selectedMetric);
    const isHovered = hoveredNeighborhood === props.name;

    return {
      fillColor: color,
      weight: isHovered ? 3 : 2,
      opacity: 1,
      color: isHovered ? '#ffffff' : '#666666',
      dashArray: '',
      fillOpacity: isHovered ? 0.8 : 0.6
    };
  };

  // Event handlers for interactivity
  const onEachFeature = (feature: any, layer: Layer) => {
    const props = feature.properties;

    layer.on({
      mouseover: (e) => {
        setHoveredNeighborhood(props.name);
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#ffffff',
          fillOpacity: 0.8
        });
      },
      mouseout: (e) => {
        setHoveredNeighborhood(null);
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: () => {
        // Scroll to neighborhood in stats panel
        const element = document.getElementById(`neighborhood-${props.name.replace(/\s+/g, '-')}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // Bind popup with neighborhood info
    layer.bindPopup(`
      <div style="color: #000; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px;">${props.name}</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td><strong>Violent Crime:</strong></td>
            <td style="text-align: right;">${props.violentCrime}/week</td>
          </tr>
          <tr>
            <td><strong>Car Theft:</strong></td>
            <td style="text-align: right;">${props.carTheft}/week</td>
          </tr>
          <tr>
            <td><strong>Break-ins:</strong></td>
            <td style="text-align: right;">${props.breakIns}/week</td>
          </tr>
          <tr>
            <td><strong>Petty Theft:</strong></td>
            <td style="text-align: right;">${props.pettyTheft}/week</td>
          </tr>
        </table>
      </div>
    `);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>LA Crime Map</h1>
        <p>Visualize crime by neighborhood</p>
        <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.8 }}>
          {loading ? 'Loading data...' : `Data: ${dataSource}`}
        </p>
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
          <GeoJSON
            key={`${selectedMetric}-${loading}`} // Re-render when metric or data changes
            data={neighborhoodData}
            style={style}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      <div className="stats-panel">
        <h3>Current Metric: {metricLabels[selectedMetric]}</h3>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#00ff00' }}></span>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ffff00' }}></span>
            <span>Moderate</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff9900' }}></span>
            <span>High</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff0000' }}></span>
            <span>Very High</span>
          </div>
        </div>

        <div className="neighborhood-list">
          {neighborhoods
            .sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0))
            .map(n => (
              <div
                key={n.name}
                id={`neighborhood-${n.name.replace(/\s+/g, '-')}`}
                className={`neighborhood-item ${hoveredNeighborhood === n.name ? 'highlighted' : ''}`}
                style={{
                  borderLeft: `4px solid ${getColor(n[selectedMetric] || 0, selectedMetric)}`
                }}
              >
                <span className="neighborhood-name">{n.name}</span>
                <span className="crime-value">{n[selectedMetric] || 0} per week</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
