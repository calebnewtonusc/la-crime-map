#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Reduce coordinate precision in GeoJSON to optimize file size
 * Reduces from 8 decimals to 4 decimals (11m accuracy)
 */
function roundCoordinate(coord, precision = 4) {
  return parseFloat(coord.toFixed(precision));
}

function processCoordinates(coords) {
  if (typeof coords[0] === 'number') {
    // Single coordinate pair [lng, lat]
    return coords.map(c => roundCoordinate(c));
  }
  // Nested array
  return coords.map(c => processCoordinates(c));
}

function optimizeGeoJSON(geojson) {
  const optimized = JSON.parse(JSON.stringify(geojson));

  if (optimized.type === 'FeatureCollection') {
    optimized.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        feature.geometry.coordinates = processCoordinates(feature.geometry.coordinates);
      }
    });
  } else if (optimized.type === 'Feature') {
    if (optimized.geometry && optimized.geometry.coordinates) {
      optimized.geometry.coordinates = processCoordinates(optimized.geometry.coordinates);
    }
  }

  return optimized;
}

function optimizeFile(inputPath, outputPath) {
  console.log(`Optimizing: ${inputPath}`);

  const originalData = fs.readFileSync(inputPath, 'utf8');
  const originalSize = Buffer.byteLength(originalData, 'utf8');
  console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);

  const geojson = JSON.parse(originalData);
  const optimized = optimizeGeoJSON(geojson);

  const optimizedData = JSON.stringify(optimized);
  const optimizedSize = Buffer.byteLength(optimizedData, 'utf8');

  fs.writeFileSync(outputPath, optimizedData, 'utf8');

  const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
  console.log(`  Optimized size: ${(optimizedSize / 1024).toFixed(2)} KB`);
  console.log(`  Size reduction: ${reduction}%`);
  console.log(`  Saved to: ${outputPath}\n`);
}

// Main execution
const dataDir = path.join(__dirname, '../public/data');
const files = [
  'la-neighborhoods-converted.geojson',
  'la-neighborhoods-real.geojson'
];

console.log('Starting GeoJSON optimization...\n');

files.forEach(file => {
  const inputPath = path.join(dataDir, file);
  const outputPath = path.join(dataDir, file);

  if (fs.existsSync(inputPath)) {
    optimizeFile(inputPath, outputPath);
  } else {
    console.log(`Warning: File not found - ${inputPath}`);
  }
});

console.log('GeoJSON optimization complete!');
