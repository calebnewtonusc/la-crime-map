#!/bin/bash

# LA Crime Map - Real Data Integration Helper Script
# This script helps you integrate real LA neighborhood data into your app

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_DIR/public/data"

echo "========================================="
echo "LA Crime Map - Real Data Integration"
echo "========================================="
echo ""

# Check if data files exist
if [ ! -f "$DATA_DIR/la-neighborhoods-real.geojson" ]; then
    echo "❌ Error: la-neighborhoods-real.geojson not found!"
    echo "   Please run the download command first:"
    echo "   curl -L -s \"https://hub.arcgis.com/api/download/v1/items/d6c55385a0e749519f238b77135eafac/geojson?redirect=true&layers=0\" -o public/data/la-neighborhoods-real.geojson"
    exit 1
fi

if [ ! -f "$DATA_DIR/la-neighborhoods-converted.geojson" ]; then
    echo "❌ Error: la-neighborhoods-converted.geojson not found!"
    echo "   Please run the conversion script first:"
    echo "   npx ts-node scripts/convert-real-neighborhoods.ts"
    exit 1
fi

echo "✅ Found real neighborhood data files"
echo ""

# Show statistics
echo "📊 Data Statistics:"
echo "-------------------"

NUM_NEIGHBORHOODS=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$DATA_DIR/la-neighborhoods-real.geojson', 'utf8')).features.length)")
FILE_SIZE=$(du -h "$DATA_DIR/la-neighborhoods-real.geojson" | cut -f1)

echo "Total neighborhoods: $NUM_NEIGHBORHOODS"
echo "File size: $FILE_SIZE"
echo ""

# Show sample neighborhoods
echo "📍 Sample neighborhoods:"
echo "-----------------------"
node -e "
const data = JSON.parse(require('fs').readFileSync('$DATA_DIR/la-neighborhoods-converted.geojson', 'utf8'));
data.features.slice(0, 10).forEach((f, i) => {
  const p = f.properties;
  console.log(\`\${i+1}. \${p.name.padEnd(30)} - Violent: \${p.violentCrime}, Cars: \${p.carTheft}\`);
});
"
echo ""

echo "🔧 Integration Options:"
echo "----------------------"
echo "1. Use converted data (placeholder crime stats)"
echo "2. Fetch real crime data first (requires API call)"
echo "3. View documentation"
echo "4. Exit"
echo ""

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📝 To use the converted data in your app, add this to lib/data/neighborhoods.ts:"
        echo ""
        echo "import realData from '../../public/data/la-neighborhoods-converted.geojson'"
        echo "export const laNeighborhoods: NeighborhoodGeoJSON = realData as NeighborhoodGeoJSON"
        echo ""
        echo "✅ This will give you 114 neighborhoods with accurate boundaries!"
        ;;
    2)
        echo ""
        echo "🌐 Fetching real crime data from LA Open Data Portal..."
        echo ""
        cd "$PROJECT_DIR"
        npx ts-node scripts/fetch-crime-data.ts
        echo ""
        echo "✅ Done! Use la-neighborhoods-with-crime-data.geojson in your app."
        ;;
    3)
        echo ""
        echo "📚 Documentation files:"
        echo "  - DATA_INTEGRATION_SUMMARY.md"
        echo "  - REAL_DATA_INTEGRATION.md"
        echo "  - scripts/QUICK_START.md"
        echo ""
        if command -v open &> /dev/null; then
            read -p "Open summary in browser? (y/n): " open_choice
            if [ "$open_choice" = "y" ]; then
                # Convert markdown to viewable format or just open in default viewer
                open "$PROJECT_DIR/DATA_INTEGRATION_SUMMARY.md"
            fi
        fi
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "Done!"
echo "========================================="
