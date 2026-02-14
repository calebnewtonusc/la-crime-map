# LA Crime Map

An interactive map visualization of **real crime statistics** from the Los Angeles Open Data Portal across LA neighborhoods. View crime data by neighborhood with color-coded polygons and interactive features.

## Features

- **Real Crime Data** from LA City Open Data API (updated automatically)
- Interactive neighborhood boundary polygons on Leaflet map
- Color-coded visualization based on crime severity
- Multiple crime metrics: Violent Crime, Car Theft, Break-ins, Petty Theft
- Hover effects to highlight neighborhoods on map and stats panel
- Click neighborhoods to view detailed crime statistics in popup
- Synchronized stats panel showing all neighborhoods with current metric
- Color legend for easy interpretation

## Data Source

This app uses real crime data from the **Los Angeles Open Data Portal**:
- **API**: https://data.lacity.org/resource/2nrs-mtv8.json
- **Dataset**: Crime Data from 2020 to Present
- **Update Frequency**: Data is fetched for the most recent 4-week period
- **Coverage**: All 21 LAPD Community Police Station areas

### Crime Categories

The app categorizes crimes into four metrics:

1. **Violent Crime**: Assault, robbery, rape, homicide, weapons offenses, kidnapping
2. **Car Theft**: Vehicle stolen (cars, motorcycles, scooters, bikes)
3. **Break-ins**: Burglary (excluding vehicle burglary)
4. **Petty Theft**: All theft crimes, shoplifting, pickpocketing, vehicle burglary

### LAPD Areas Included

All 21 LAPD Community Police Station areas:
- Central, Rampart, Southwest, Hollenbeck, Harbor
- Hollywood, Wilshire, West LA, Van Nuys, West Valley
- Northeast, 77th Street, Newton, Pacific, N Hollywood
- Foothill, Devonshire, Southeast, Mission, Olympic, Topanga

## Technical Implementation

### Data Service (`crimeDataService.ts`)

The data service fetches real crime data from the LA Open Data API using Socrata's SODA API:

```typescript
// Fetches crime data for the last N weeks
fetchCrimeData(weeksBack: number = 4): Promise<NeighborhoodData[]>
```

Features:
- Fetches up to 50,000 recent crime records
- Categorizes crimes into 4 metrics using keyword matching
- Aggregates by LAPD area name
- Calculates per-week rates for consistency
- Handles API errors gracefully with fallback to sample data

### App Integration

The app loads real data on mount via `useEffect`:
- Displays loading state while fetching
- Shows data source in header ("Real LA Crime Data" vs "Using sample data")
- Merges real crime stats with GeoJSON neighborhood boundaries
- Updates map colors and stats panel dynamically

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
