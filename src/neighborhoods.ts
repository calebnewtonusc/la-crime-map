// LA Neighborhood GeoJSON data with approximate boundaries
// Coordinates are [longitude, latitude] in GeoJSON format
// Covers 35+ major neighborhoods and cities in LA County

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
    // Central LA
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
    },
    {
      type: 'Feature',
      properties: {
        name: 'Echo Park',
        violentCrime: 5,
        carTheft: 8,
        breakIns: 10,
        pettyTheft: 16
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.270, 34.065],
          [-118.270, 34.085],
          [-118.250, 34.090],
          [-118.235, 34.085],
          [-118.235, 34.065],
          [-118.255, 34.060],
          [-118.270, 34.065]
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
          [-118.270, 34.100],
          [-118.250, 34.105],
          [-118.230, 34.100],
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
        name: 'Los Feliz',
        violentCrime: 3,
        carTheft: 6,
        breakIns: 7,
        pettyTheft: 12
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.300, 34.095],
          [-118.300, 34.125],
          [-118.275, 34.130],
          [-118.255, 34.125],
          [-118.250, 34.105],
          [-118.270, 34.095],
          [-118.300, 34.095]
        ]]
      }
    },

    // Hollywood Area
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
          [-118.365, 34.115],
          [-118.340, 34.120],
          [-118.310, 34.120],
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
        name: 'West Hollywood',
        violentCrime: 6,
        carTheft: 8,
        breakIns: 9,
        pettyTheft: 15
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.385, 34.080],
          [-118.385, 34.100],
          [-118.365, 34.105],
          [-118.355, 34.100],
          [-118.355, 34.080],
          [-118.370, 34.075],
          [-118.385, 34.080]
        ]]
      }
    },

    // Westside
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
          [-118.520, 34.045],
          [-118.500, 34.050],
          [-118.480, 34.050],
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
        name: 'Venice',
        violentCrime: 5,
        carTheft: 12,
        breakIns: 10,
        pettyTheft: 18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.480, 33.980],
          [-118.480, 34.010],
          [-118.470, 34.015],
          [-118.455, 34.015],
          [-118.445, 34.005],
          [-118.445, 33.980],
          [-118.465, 33.975],
          [-118.480, 33.980]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Marina del Rey',
        violentCrime: 2,
        carTheft: 7,
        breakIns: 6,
        pettyTheft: 11
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.455, 33.970],
          [-118.455, 33.990],
          [-118.440, 33.995],
          [-118.425, 33.990],
          [-118.420, 33.975],
          [-118.435, 33.970],
          [-118.455, 33.970]
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
          [-118.470, 34.065],
          [-118.445, 34.070],
          [-118.420, 34.070],
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
        name: 'Beverly Hills',
        violentCrime: 1,
        carTheft: 4,
        breakIns: 3,
        pettyTheft: 7
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.420, 34.060],
          [-118.420, 34.090],
          [-118.395, 34.095],
          [-118.375, 34.090],
          [-118.375, 34.060],
          [-118.395, 34.055],
          [-118.420, 34.060]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Bel Air',
        violentCrime: 1,
        carTheft: 3,
        breakIns: 4,
        pettyTheft: 5
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.475, 34.075],
          [-118.475, 34.110],
          [-118.450, 34.115],
          [-118.430, 34.110],
          [-118.430, 34.075],
          [-118.450, 34.070],
          [-118.475, 34.075]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Brentwood',
        violentCrime: 2,
        carTheft: 4,
        breakIns: 5,
        pettyTheft: 8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.500, 34.045],
          [-118.500, 34.080],
          [-118.475, 34.085],
          [-118.455, 34.080],
          [-118.455, 34.045],
          [-118.475, 34.040],
          [-118.500, 34.045]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Culver City',
        violentCrime: 4,
        carTheft: 7,
        breakIns: 8,
        pettyTheft: 13
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.410, 34.005],
          [-118.410, 34.035],
          [-118.385, 34.040],
          [-118.365, 34.035],
          [-118.365, 34.005],
          [-118.385, 34.000],
          [-118.410, 34.005]
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
          [-118.410, 34.040],
          [-118.390, 34.045],
          [-118.370, 34.040],
          [-118.360, 34.030],
          [-118.360, 34.015],
          [-118.385, 34.010],
          [-118.410, 34.015]
        ]]
      }
    },

    // San Fernando Valley
    {
      type: 'Feature',
      properties: {
        name: 'Van Nuys',
        violentCrime: 8,
        carTheft: 11,
        breakIns: 13,
        pettyTheft: 18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.470, 34.175],
          [-118.470, 34.215],
          [-118.440, 34.220],
          [-118.410, 34.215],
          [-118.410, 34.175],
          [-118.435, 34.170],
          [-118.470, 34.175]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'North Hollywood',
        violentCrime: 7,
        carTheft: 10,
        breakIns: 11,
        pettyTheft: 16
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.400, 34.160],
          [-118.400, 34.200],
          [-118.370, 34.205],
          [-118.345, 34.200],
          [-118.345, 34.160],
          [-118.370, 34.155],
          [-118.400, 34.160]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Sherman Oaks',
        violentCrime: 3,
        carTheft: 6,
        breakIns: 7,
        pettyTheft: 11
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.475, 34.140],
          [-118.475, 34.170],
          [-118.445, 34.175],
          [-118.420, 34.170],
          [-118.420, 34.140],
          [-118.445, 34.135],
          [-118.475, 34.140]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Studio City',
        violentCrime: 2,
        carTheft: 5,
        breakIns: 6,
        pettyTheft: 9
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.400, 34.135],
          [-118.400, 34.165],
          [-118.370, 34.170],
          [-118.350, 34.165],
          [-118.350, 34.135],
          [-118.375, 34.130],
          [-118.400, 34.135]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Encino',
        violentCrime: 2,
        carTheft: 4,
        breakIns: 5,
        pettyTheft: 8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.540, 34.140],
          [-118.540, 34.175],
          [-118.510, 34.180],
          [-118.485, 34.175],
          [-118.485, 34.140],
          [-118.510, 34.135],
          [-118.540, 34.140]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Burbank',
        violentCrime: 4,
        carTheft: 7,
        breakIns: 8,
        pettyTheft: 13
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.345, 34.170],
          [-118.345, 34.210],
          [-118.310, 34.215],
          [-118.285, 34.210],
          [-118.285, 34.170],
          [-118.310, 34.165],
          [-118.345, 34.170]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Glendale',
        violentCrime: 3,
        carTheft: 6,
        breakIns: 7,
        pettyTheft: 11
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.285, 34.130],
          [-118.285, 34.175],
          [-118.250, 34.180],
          [-118.225, 34.175],
          [-118.225, 34.130],
          [-118.250, 34.125],
          [-118.285, 34.130]
        ]]
      }
    },

    // South LA
    {
      type: 'Feature',
      properties: {
        name: 'Inglewood',
        violentCrime: 11,
        carTheft: 14,
        breakIns: 15,
        pettyTheft: 22
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.370, 33.945],
          [-118.370, 33.975],
          [-118.340, 33.980],
          [-118.315, 33.975],
          [-118.315, 33.945],
          [-118.340, 33.940],
          [-118.370, 33.945]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Compton',
        violentCrime: 16,
        carTheft: 18,
        breakIns: 19,
        pettyTheft: 28
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.240, 33.880],
          [-118.240, 33.910],
          [-118.210, 33.915],
          [-118.185, 33.910],
          [-118.185, 33.880],
          [-118.210, 33.875],
          [-118.240, 33.880]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'South LA',
        violentCrime: 14,
        carTheft: 16,
        breakIns: 17,
        pettyTheft: 25
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.310, 33.990],
          [-118.310, 34.020],
          [-118.280, 34.025],
          [-118.255, 34.020],
          [-118.255, 33.990],
          [-118.280, 33.985],
          [-118.310, 33.990]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Watts',
        violentCrime: 15,
        carTheft: 17,
        breakIns: 18,
        pettyTheft: 26
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.255, 33.930],
          [-118.255, 33.960],
          [-118.225, 33.965],
          [-118.200, 33.960],
          [-118.200, 33.930],
          [-118.225, 33.925],
          [-118.255, 33.930]
        ]]
      }
    },

    // East LA & SGV
    {
      type: 'Feature',
      properties: {
        name: 'Pasadena',
        violentCrime: 5,
        carTheft: 8,
        breakIns: 9,
        pettyTheft: 14
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.175, 34.125],
          [-118.175, 34.170],
          [-118.140, 34.175],
          [-118.110, 34.170],
          [-118.110, 34.125],
          [-118.140, 34.120],
          [-118.175, 34.125]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Alhambra',
        violentCrime: 4,
        carTheft: 7,
        breakIns: 8,
        pettyTheft: 12
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.160, 34.075],
          [-118.160, 34.105],
          [-118.130, 34.110],
          [-118.105, 34.105],
          [-118.105, 34.075],
          [-118.130, 34.070],
          [-118.160, 34.075]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'East LA',
        violentCrime: 10,
        carTheft: 13,
        breakIns: 14,
        pettyTheft: 20
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.190, 34.015],
          [-118.190, 34.045],
          [-118.160, 34.050],
          [-118.135, 34.045],
          [-118.135, 34.015],
          [-118.160, 34.010],
          [-118.190, 34.015]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'El Monte',
        violentCrime: 9,
        carTheft: 12,
        breakIns: 13,
        pettyTheft: 18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.070, 34.055],
          [-118.070, 34.090],
          [-118.035, 34.095],
          [-118.010, 34.090],
          [-118.010, 34.055],
          [-118.035, 34.050],
          [-118.070, 34.055]
        ]]
      }
    },

    // Long Beach Area
    {
      type: 'Feature',
      properties: {
        name: 'Long Beach',
        violentCrime: 10,
        carTheft: 13,
        breakIns: 14,
        pettyTheft: 21
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.220, 33.745],
          [-118.220, 33.805],
          [-118.175, 33.810],
          [-118.140, 33.805],
          [-118.140, 33.745],
          [-118.175, 33.740],
          [-118.220, 33.745]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Torrance',
        violentCrime: 3,
        carTheft: 6,
        breakIns: 7,
        pettyTheft: 11
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.360, 33.815],
          [-118.360, 33.860],
          [-118.320, 33.865],
          [-118.290, 33.860],
          [-118.290, 33.815],
          [-118.320, 33.810],
          [-118.360, 33.815]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Redondo Beach',
        violentCrime: 2,
        carTheft: 5,
        breakIns: 6,
        pettyTheft: 10
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.400, 33.835],
          [-118.400, 33.865],
          [-118.370, 33.870],
          [-118.345, 33.865],
          [-118.345, 33.835],
          [-118.370, 33.830],
          [-118.400, 33.835]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Manhattan Beach',
        violentCrime: 1,
        carTheft: 4,
        breakIns: 5,
        pettyTheft: 8
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.420, 33.875],
          [-118.420, 33.900],
          [-118.395, 33.905],
          [-118.375, 33.900],
          [-118.375, 33.875],
          [-118.395, 33.870],
          [-118.420, 33.875]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'El Segundo',
        violentCrime: 2,
        carTheft: 4,
        breakIns: 5,
        pettyTheft: 9
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.425, 33.905],
          [-118.425, 33.930],
          [-118.400, 33.935],
          [-118.380, 33.930],
          [-118.380, 33.905],
          [-118.400, 33.900],
          [-118.425, 33.905]
        ]]
      }
    }
  ]
};
