# LA Crime Map

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://la-crime-map.vercel.app)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)](https://leafletjs.com/)

An interactive, real-time crime data visualization platform for Los Angeles neighborhoods. Explore crime statistics across all 21 LAPD Community Police Station areas with an intuitive map interface, advanced analytics, and customizable time ranges.

## Live Demo

Visit the live application: **[la-crime-map.vercel.app](https://la-crime-map.vercel.app)**

## Features

### Interactive Crime Mapping
- **Real-Time Data Integration**: Fetches live crime data from the LA City Open Data Portal API
- **21 LAPD Areas**: Complete coverage of all Los Angeles police jurisdictions
- **Color-Coded Visualization**: Intuitive heat-map style coloring based on crime severity
- **Interactive Polygons**: Click, hover, and explore neighborhood boundaries
- **Detailed Popups**: View comprehensive crime statistics for each area

### Advanced Analytics
- **4 Crime Metrics**:
  - Violent Crime (assault, robbery, homicide, weapons offenses)
  - Car Theft (vehicles, motorcycles, bikes)
  - Break-ins (burglary, excluding vehicle)
  - Petty Theft (shoplifting, pickpocketing, vehicle burglary)
- **Analytics Dashboard**:
  - Bar chart showing top 10 most dangerous neighborhoods
  - Line chart displaying crime trends over time (12-week historical view)
  - Pie chart for crime type distribution by neighborhood
  - Summary statistics cards with key metrics
  - Export data to CSV functionality
- **Comparison Mode**: Compare up to 3 neighborhoods side-by-side
- **Time Range Selection**: View data from 1 week to 1 year

### User Experience
- **Search & Filter**: Find neighborhoods quickly with real-time search
- **Severity Threshold**: Filter areas by minimum crime rate
- **Multiple Sort Options**: Alphabetical or by crime rate
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode Interface**: Easy on the eyes with professional dark theme
- **Offline Support**: Service worker caching for improved performance
- **Interactive Tutorial**: First-time help modal with usage instructions

### SEO & Sharing
- Comprehensive meta tags for search engines
- Open Graph tags for social media sharing
- Twitter Card support
- Structured JSON-LD data for rich snippets
- Custom favicons and social preview images

## Technology Stack

### Frontend
- **React 19.2** - Modern UI framework
- **TypeScript 4.9** - Type-safe development
- **Leaflet 1.9** - Interactive mapping library
- **React-Leaflet 5.0** - React bindings for Leaflet
- **Recharts** - Beautiful and composable charts for data visualization

### Data
- **LA Open Data API** - Real-time crime statistics
- **GeoJSON** - Neighborhood boundary definitions
- **LocalStorage** - User preference persistence
- **Service Workers** - Offline caching and PWA support

### Optimization
- **Lazy Loading** - Code splitting for faster initial load
- **Memoization** - Performance optimization with React hooks
- **Debouncing** - Smooth interactions with optimized event handlers
- **Responsive Images** - Optimized assets for all screen sizes

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/la-crime-map.git
cd la-crime-map
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy

The app is optimized for deployment on Vercel, Netlify, or any static hosting service:

```bash
npm run build
# Deploy the build/ folder to your hosting provider
```

## Data Source

### LA City Open Data Portal
- **API Endpoint**: https://data.lacity.org/resource/2nrs-mtv8.json
- **Dataset**: Crime Data from 2020 to Present
- **Update Frequency**: Updated regularly by LAPD
- **Data Points**: 50,000+ recent crime records
- **Coverage**: All 21 LAPD Community Police Station areas

### Crime Classification
The app intelligently categorizes crimes using keyword matching:

| Category | Crime Types |
|----------|-------------|
| **Violent Crime** | Assault, robbery, rape, homicide, weapons, kidnapping |
| **Car Theft** | Vehicle theft (cars, motorcycles, scooters, bicycles) |
| **Break-ins** | Burglary from residences and businesses |
| **Petty Theft** | Shoplifting, pickpocketing, theft from vehicles |

### LAPD Areas
All 21 Community Police Station areas are included:
- Central, Rampart, Southwest, Hollenbeck, Harbor
- Hollywood, Wilshire, West LA, Van Nuys, West Valley
- Northeast, 77th Street, Newton, Pacific, N Hollywood
- Foothill, Devonshire, Southeast, Mission, Olympic, Topanga

## Project Structure

```
la-crime-map/
├── public/
│   ├── index.html              # SEO-optimized HTML
│   ├── manifest.json            # PWA manifest
│   ├── favicon.svg              # Custom crime map icon
│   └── og-image.png             # Social media preview
├── src/
│   ├── components/
│   │   ├── CrimeMap.tsx         # Lazy-loaded map component
│   │   ├── Footer.tsx           # Data attribution footer
│   │   ├── InfoModal.tsx        # Help and instructions
│   │   └── MapSkeleton.tsx      # Loading state
│   ├── utils/
│   │   ├── debounce.ts          # Performance utilities
│   │   └── optimizedGeoJSON.ts  # Memoized color functions
│   ├── App.tsx                  # Main application
│   ├── AppWrapper.tsx           # Footer & modal wrapper
│   ├── crimeDataService.ts      # API integration
│   ├── neighborhoods.ts         # GeoJSON boundaries
│   └── DataVisualization.tsx    # Analytics dashboard
└── README.md
```

## Key Features in Detail

### Interactive Map
- Pan and zoom across Los Angeles
- Color-coded neighborhoods based on crime severity
- Hover effects with visual feedback
- Click for detailed crime statistics popup
- Synchronized highlighting between map and statistics panel

### Real-Time Data Fetching
```typescript
// Fetch crime data with configurable time range
const data = await fetchCrimeData(weeks);

// Automatic caching with cache invalidation
// Graceful fallback to sample data on API errors
```

### User Preferences
The app remembers your preferences using LocalStorage:
- Selected crime metric
- Time range selection
- Severity threshold
- Sort order
- Search queries

### Performance Optimizations
- Lazy loading of map component
- Memoized color calculations
- Debounced hover handlers
- Service worker caching
- Optimized GeoJSON rendering

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Reduced motion support

## API Reference

### Crime Data Service

```typescript
interface NeighborhoodData {
  name: string;
  violentCrime: number;
  carTheft: number;
  breakIns: number;
  pettyTheft: number;
}

// Fetch crime data for specified weeks
fetchCrimeData(weeksBack: number): Promise<NeighborhoodData[]>

// Clear cached data
clearCrimeCache(): void
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Disclaimer

This visualization is for informational purposes only. Crime statistics are approximate and may not reflect all incidents. For official crime reports, please contact the [Los Angeles Police Department](https://www.lapdonline.org/).

## Acknowledgments

- Crime data provided by the [Los Angeles Open Data Portal](https://data.lacity.org/)
- Map tiles from [OpenStreetMap](https://www.openstreetmap.org/)
- Built with [React](https://reactjs.org/) and [Leaflet](https://leafletjs.com/)

## Contact & Support

- Report issues on [GitHub Issues](https://github.com/yourusername/la-crime-map/issues)
- For questions about the data, visit the [LA Open Data Portal](https://data.lacity.org/)

---

Made with data from the City of Los Angeles
