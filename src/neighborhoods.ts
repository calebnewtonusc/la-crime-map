// LA Neighborhood GeoJSON data with approximate boundaries
// Coordinates are [longitude, latitude] in GeoJSON format

export interface NeighborhoodGeoJSON {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      name: string;
      violentCrime: number;
      carTheft: number;
      breakIns: number;
      pettyTheft: number;
    };
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
}

export const laNeighborhoods: NeighborhoodGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Downtown LA',
        violentCrime: 12,
        carTheft: 8,
        breakIns: 15,
        pettyTheft: 25
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.270, 34.048],
          [-118.270, 34.060],
          [-118.245, 34.060],
          [-118.235, 34.048],
          [-118.235, 34.035],
          [-118.260, 34.035],
          [-118.270, 34.048]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Hollywood',
        violentCrime: 8,
        carTheft: 10,
        breakIns: 12,
        pettyTheft: 20
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.365, 34.090],
          [-118.365, 34.105],
          [-118.340, 34.115],
          [-118.310, 34.115],
          [-118.290, 34.105],
          [-118.290, 34.090],
          [-118.320, 34.085],
          [-118.365, 34.090]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Venice',
        violentCrime: 5,
        carTheft: 12,
        breakIns: 10,
        pettyTheft: 18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.480, 33.985],
          [-118.480, 34.000],
          [-118.470, 34.010],
          [-118.455, 34.010],
          [-118.445, 34.000],
          [-118.445, 33.985],
          [-118.465, 33.980],
          [-118.480, 33.985]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Santa Monica',
        violentCrime: 4,
        carTheft: 9,
        breakIns: 8,
        pettyTheft: 15
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.520, 34.010],
          [-118.520, 34.040],
          [-118.500, 34.045],
          [-118.480, 34.045],
          [-118.470, 34.035],
          [-118.470, 34.010],
          [-118.490, 34.005],
          [-118.520, 34.010]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'West LA',
        violentCrime: 2,
        carTheft: 5,
        breakIns: 4,
        pettyTheft: 8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.470, 34.035],
          [-118.470, 34.060],
          [-118.445, 34.065],
          [-118.420, 34.065],
          [-118.410, 34.055],
          [-118.410, 34.035],
          [-118.435, 34.030],
          [-118.470, 34.035]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Palms',
        violentCrime: 3,
        carTheft: 6,
        breakIns: 7,
        pettyTheft: 10
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.410, 34.015],
          [-118.410, 34.035],
          [-118.390, 34.040],
          [-118.370, 34.040],
          [-118.360, 34.030],
          [-118.360, 34.015],
          [-118.385, 34.010],
          [-118.410, 34.015]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Silver Lake',
        violentCrime: 4,
        carTheft: 7,
        breakIns: 9,
        pettyTheft: 14
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.270, 34.070],
          [-118.270, 34.090],
          [-118.250, 34.095],
          [-118.230, 34.095],
          [-118.220, 34.085],
          [-118.220, 34.070],
          [-118.245, 34.065],
          [-118.270, 34.070]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Koreatown',
        violentCrime: 7,
        carTheft: 9,
        breakIns: 11,
        pettyTheft: 19
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.310, 34.050],
          [-118.310, 34.070],
          [-118.290, 34.075],
          [-118.270, 34.075],
          [-118.260, 34.065],
          [-118.260, 34.050],
          [-118.285, 34.045],
          [-118.310, 34.050]
        ]]
      }
    }
  ]
};
