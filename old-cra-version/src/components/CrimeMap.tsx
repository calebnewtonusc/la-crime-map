// Lazy-loaded map component for better performance
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NeighborhoodGeoJSON } from '../neighborhoods';

type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

interface CrimeMapProps {
  neighborhoodData: NeighborhoodGeoJSON;
  selectedMetric: CrimeMetric;
  onHover: (name: string | null) => void;
  getColor: (value: number, metric: CrimeMetric) => string;
}

const CrimeMap: React.FC<CrimeMapProps> = ({
  neighborhoodData,
  selectedMetric,
  onHover,
  getColor
}) => {
  // Style function for GeoJSON polygons
  const style = React.useCallback((feature: any) => {
    const props = feature.properties;
    const value = props[selectedMetric] || 0;
    const color = getColor(value, selectedMetric);

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: '#666666',
      dashArray: '',
      fillOpacity: 0.6
    };
  }, [selectedMetric, getColor]);

  // Event handlers for interactivity
  const onEachFeature = React.useCallback((feature: any, layer: Layer) => {
    const props = feature.properties;

    layer.on({
      mouseover: (e) => {
        onHover(props.name);
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#ffffff',
          fillOpacity: 0.8
        });
      },
      mouseout: (e) => {
        onHover(null);
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
  }, [style, onHover]);

  return (
    <MapContainer
      center={[34.0522, -118.2437]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      preferCanvas={true} // Use canvas for better performance with many features
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <GeoJSON
        key={selectedMetric} // Re-render when metric changes
        data={neighborhoodData}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default React.memo(CrimeMap);
