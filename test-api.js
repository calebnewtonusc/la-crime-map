// Simple test script to verify LA Crime API data fetching
const https = require('https');

// Test date range - 4 weeks ending Dec 1, 2024
const endDate = new Date('2024-12-01');
const startDate = new Date('2024-12-01');
startDate.setDate(startDate.getDate() - (4 * 7));

const startDateStr = startDate.toISOString().split('T')[0];
const endDateStr = endDate.toISOString().split('T')[0];

const url = `https://data.lacity.org/resource/2nrs-mtv8.json?$where=date_occ>='${startDateStr}T00:00:00.000' AND date_occ<='${endDateStr}T23:59:59.999'&$limit=50000&$select=area_name,crm_cd_desc,date_occ`;

console.log('Fetching crime data...');
console.log('Date range:', startDateStr, 'to', endDateStr);
console.log('URL:', url);
console.log('');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const records = JSON.parse(data);
      console.log(`Total records fetched: ${records.length}`);

      // Count by area
      const areaCount = {};
      const crimeTypes = {
        violentCrime: 0,
        carTheft: 0,
        breakIns: 0,
        pettyTheft: 0,
        other: 0
      };

      records.forEach(record => {
        if (record.area_name) {
          areaCount[record.area_name] = (areaCount[record.area_name] || 0) + 1;
        }

        const desc = (record.crm_cd_desc || '').toUpperCase();
        if (desc.includes('ASSAULT') || desc.includes('ROBBERY') || desc.includes('RAPE') || desc.includes('HOMICIDE')) {
          crimeTypes.violentCrime++;
        } else if (desc.includes('VEHICLE - STOLEN') || desc.includes('VEHICLE, STOLEN')) {
          crimeTypes.carTheft++;
        } else if (desc.includes('BURGLARY') && !desc.includes('VEHICLE')) {
          crimeTypes.breakIns++;
        } else if (desc.includes('THEFT') || desc.includes('SHOPLIFT')) {
          crimeTypes.pettyTheft++;
        } else {
          crimeTypes.other++;
        }
      });

      console.log('\nCrime breakdown:');
      console.log('- Violent Crime:', crimeTypes.violentCrime);
      console.log('- Car Theft:', crimeTypes.carTheft);
      console.log('- Break-ins:', crimeTypes.breakIns);
      console.log('- Petty Theft:', crimeTypes.pettyTheft);
      console.log('- Other:', crimeTypes.other);

      console.log('\nTop 10 areas by crime count:');
      const sortedAreas = Object.entries(areaCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      sortedAreas.forEach(([area, count]) => {
        const perWeek = Math.round(count / 4);
        console.log(`- ${area}: ${count} total (${perWeek}/week)`);
      });

      console.log('\n✓ API test successful!');
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Response:', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
});
