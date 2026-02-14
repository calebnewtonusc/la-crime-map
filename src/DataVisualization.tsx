import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { NeighborhoodData } from './crimeDataService';
import './DataVisualization.css';

interface DataVisualizationProps {
  neighborhoods: NeighborhoodData[];
  selectedMetric: 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];

const metricLabels: Record<string, string> = {
  violentCrime: 'Violent Crime',
  carTheft: 'Car Theft',
  breakIns: 'Break-ins',
  pettyTheft: 'Petty Theft'
};

export const DataVisualization: React.FC<DataVisualizationProps> = ({ neighborhoods, selectedMetric }) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCrimes = neighborhoods.reduce((sum, n) =>
      sum + n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft, 0
    );

    const avgPerNeighborhood = totalCrimes / neighborhoods.length;

    const metricTotal = neighborhoods.reduce((sum, n) => sum + (n[selectedMetric] || 0), 0);

    // Use safety score if available, otherwise use total crime
    const safestNeighborhood = neighborhoods.reduce((best, n) => {
      if (n.safetyScore !== null && best.safetyScore !== null) {
        return n.safetyScore > best.safetyScore ? n : best;
      }
      const nTotal = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft;
      const bestTotal = best.violentCrime + best.carTheft + best.breakIns + best.pettyTheft;
      return nTotal < bestTotal ? n : best;
    });

    const mostDangerous = neighborhoods.reduce((worst, n) => {
      if (n.safetyScore !== null && worst.safetyScore !== null) {
        return n.safetyScore < worst.safetyScore ? n : worst;
      }
      const nTotal = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft;
      const worstTotal = worst.violentCrime + worst.carTheft + worst.breakIns + worst.pettyTheft;
      return nTotal > worstTotal ? n : worst;
    });

    // Count neighborhoods with sufficient data
    const withPopulationData = neighborhoods.filter(n => n.populationDataAvailable).length;
    const withSufficientData = neighborhoods.filter(n => n.hasSufficientData).length;

    return {
      totalCrimes,
      avgPerNeighborhood,
      metricTotal,
      safestNeighborhood,
      mostDangerous,
      neighborhoodCount: neighborhoods.length,
      withPopulationData,
      withSufficientData
    };
  }, [neighborhoods, selectedMetric]);

  // Top 10 neighborhoods for selected metric (raw counts)
  const top10Data = useMemo(() => {
    return neighborhoods
      .sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0))
      .slice(0, 10)
      .map(n => ({
        name: n.name.length > 15 ? n.name.substring(0, 15) + '...' : n.name,
        fullName: n.name,
        value: n[selectedMetric] || 0
      }));
  }, [neighborhoods, selectedMetric]);

  // Top 10 neighborhoods by per capita rates
  const top10PerCapita = useMemo(() => {
    const metricPerCapitaKey = `${selectedMetric}PerCapita` as keyof NeighborhoodData;

    return neighborhoods
      .filter(n => n[metricPerCapitaKey] !== null)
      .sort((a, b) => {
        const aVal = a[metricPerCapitaKey] as number;
        const bVal = b[metricPerCapitaKey] as number;
        return bVal - aVal;
      })
      .slice(0, 10)
      .map(n => ({
        name: n.name.length > 15 ? n.name.substring(0, 15) + '...' : n.name,
        fullName: n.name,
        value: n[metricPerCapitaKey] as number,
        rawValue: n[selectedMetric] || 0
      }));
  }, [neighborhoods, selectedMetric]);

  // Safest neighborhoods by safety score
  const safestAreas = useMemo(() => {
    return neighborhoods
      .filter(n => n.safetyScore !== null)
      .sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0))
      .slice(0, 10)
      .map(n => ({
        name: n.name.length > 15 ? n.name.substring(0, 15) + '...' : n.name,
        fullName: n.name,
        safetyScore: n.safetyScore || 0,
        percentile: n.overallSafetyPercentile || 0
      }));
  }, [neighborhoods]);

  // Crime type distribution for selected neighborhood or overall
  const crimeDistribution = useMemo(() => {
    if (selectedNeighborhood) {
      const neighborhood = neighborhoods.find(n => n.name === selectedNeighborhood);
      if (!neighborhood) return [];

      return [
        { name: 'Violent Crime', value: neighborhood.violentCrime },
        { name: 'Car Theft', value: neighborhood.carTheft },
        { name: 'Break-ins', value: neighborhood.breakIns },
        { name: 'Petty Theft', value: neighborhood.pettyTheft }
      ].filter(item => item.value > 0);
    } else {
      // Overall distribution
      const totals = neighborhoods.reduce((acc, n) => ({
        violentCrime: acc.violentCrime + n.violentCrime,
        carTheft: acc.carTheft + n.carTheft,
        breakIns: acc.breakIns + n.breakIns,
        pettyTheft: acc.pettyTheft + n.pettyTheft
      }), { violentCrime: 0, carTheft: 0, breakIns: 0, pettyTheft: 0 });

      return [
        { name: 'Violent Crime', value: totals.violentCrime },
        { name: 'Car Theft', value: totals.carTheft },
        { name: 'Break-ins', value: totals.breakIns },
        { name: 'Petty Theft', value: totals.pettyTheft }
      ].filter(item => item.value > 0);
    }
  }, [neighborhoods, selectedNeighborhood]);

  // Mock historical data - in a real app, this would come from an API
  const historicalData = useMemo(() => {
    // Generate 12 weeks of mock data with some variation
    return Array.from({ length: 12 }, (_, i) => {
      const weekNumber = i + 1;
      const baseValue = stats.metricTotal / neighborhoods.length;
      const variation = Math.sin(i / 2) * baseValue * 0.3; // Add sinusoidal variation

      return {
        week: `Week ${weekNumber}`,
        value: Math.round(baseValue + variation),
        avgValue: Math.round(baseValue)
      };
    });
  }, [stats, neighborhoods.length, selectedMetric]);

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Neighborhood', 'Violent Crime', 'Car Theft', 'Break-ins', 'Petty Theft', 'Total'];
    const rows = neighborhoods.map(n => {
      const total = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft;
      return [n.name, n.violentCrime, n.carTheft, n.breakIns, n.pettyTheft, total];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `la-crime-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="data-visualization">
      <div className="viz-header">
        <h2>Crime Analytics Dashboard</h2>
        <button className="export-button" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      {/* Summary Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-label">Total Crimes (Weekly)</div>
          <div className="stat-value">{stats.totalCrimes.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Neighborhoods</div>
          <div className="stat-value">{stats.neighborhoodCount}</div>
          <div className="stat-sublabel">{stats.withSufficientData} with complete data</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Per Area</div>
          <div className="stat-value">{Math.round(stats.avgPerNeighborhood)}</div>
          <div className="stat-sublabel">crimes per week</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{metricLabels[selectedMetric]} Total</div>
          <div className="stat-value">{stats.metricTotal.toLocaleString()}</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-label">Safest Area</div>
          <div className="stat-value small">{stats.safestNeighborhood.name}</div>
          {stats.safestNeighborhood.safetyScore !== null && (
            <div className="stat-sublabel">Safety Score: {stats.safestNeighborhood.safetyScore}</div>
          )}
          {stats.safestNeighborhood.overallSafetyPercentile !== null && (
            <div className="stat-sublabel">Safer than {stats.safestNeighborhood.overallSafetyPercentile}% of LA</div>
          )}
        </div>

        <div className="stat-card highlight">
          <div className="stat-label">Highest Crime</div>
          <div className="stat-value small">{stats.mostDangerous.name}</div>
          {stats.mostDangerous.safetyScore !== null && (
            <div className="stat-sublabel">Safety Score: {stats.mostDangerous.safetyScore}</div>
          )}
          {stats.mostDangerous.overallSafetyPercentile !== null && (
            <div className="stat-sublabel">Safer than {stats.mostDangerous.overallSafetyPercentile}% of LA</div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-label">Data Coverage</div>
          <div className="stat-value">{Math.round((stats.withPopulationData / stats.neighborhoodCount) * 100)}%</div>
          <div className="stat-sublabel">{stats.withPopulationData} areas with population data</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Data Quality</div>
          <div className="stat-value">
            {neighborhoods.length > 0
              ? Math.round(neighborhoods.reduce((sum, n) => sum + n.dataQualityScore, 0) / neighborhoods.length)
              : 0}
          </div>
          <div className="stat-sublabel">out of 100</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">

        {/* Bar Chart - Top 10 Most Dangerous Neighborhoods */}
        <div className="chart-container">
          <h3>Top 10 Areas - {metricLabels[selectedMetric]}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10Data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#888"
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <YAxis
                stroke="#888"
                tick={{ fill: '#888' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                labelFormatter={(label) => {
                  const item = top10Data.find(d => d.name === label);
                  return item ? item.fullName : label;
                }}
                formatter={(value) => [`${value} per week`, metricLabels[selectedMetric]]}
              />
              <Bar dataKey="value" fill="#0066cc">
                {top10Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Historical Trend */}
        <div className="chart-container">
          <h3>Crime Trend - {metricLabels[selectedMetric]} (Last 12 Weeks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="week"
                stroke="#888"
                tick={{ fill: '#888' }}
              />
              <YAxis
                stroke="#888"
                tick={{ fill: '#888' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                formatter={(value) => [`${value} crimes/week`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0066cc"
                strokeWidth={2}
                name="Actual"
                dot={{ fill: '#0066cc', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="avgValue"
                stroke="#888"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Average"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-note">
            Note: Historical trend data is simulated for demonstration purposes
          </div>
        </div>

        {/* Pie Chart - Crime Type Distribution */}
        <div className="chart-container">
          <h3>Crime Type Distribution</h3>
          <div className="neighborhood-selector">
            <label>Select Neighborhood: </label>
            <select
              value={selectedNeighborhood || ''}
              onChange={(e) => setSelectedNeighborhood(e.target.value || null)}
            >
              <option value="">All Neighborhoods</option>
              {neighborhoods.map(n => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={crimeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {crimeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                formatter={(value) => [`${value} crimes/week`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Per Capita Rates Chart */}
        <div className="chart-container">
          <h3>Top 10 Areas - {metricLabels[selectedMetric]} Per Capita</h3>
          {top10PerCapita.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top10PerCapita} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    label={{ value: 'Per 1000 residents/year', angle: -90, position: 'insideLeft', fill: '#888' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                    labelFormatter={(label) => {
                      const item = top10PerCapita.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        `${Number(value).toFixed(2)} per 1000/year (${item.rawValue}/week)`,
                        metricLabels[selectedMetric]
                      ];
                    }}
                  />
                  <Bar dataKey="value" fill="#FF6B6B">
                    {top10PerCapita.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-note">
                Per capita rates account for neighborhood population, providing fair comparison
              </div>
            </>
          ) : (
            <div className="no-data-message">
              Insufficient population data available for per capita analysis
            </div>
          )}
        </div>

        {/* Safety Score Rankings */}
        <div className="chart-container">
          <h3>Top 10 Safest Neighborhoods</h3>
          {safestAreas.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={safestAreas} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fill: '#888' }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                    labelFormatter={(label) => {
                      const item = safestAreas.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        `Safety Score: ${value} (Safer than ${item.percentile}% of LA)`,
                        ''
                      ];
                    }}
                  />
                  <Bar dataKey="safetyScore" fill="#52B788">
                    {safestAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.safetyScore > 80 ? '#52B788' : entry.safetyScore > 60 ? '#4ECDC4' : '#FFA07A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-note">
                Safety scores are weighted composite metrics (0-100, higher is safer)
              </div>
            </>
          ) : (
            <div className="no-data-message">
              Insufficient data available for safety score calculation
            </div>
          )}
        </div>

        {/* Additional Stats Table */}
        <div className="chart-container">
          <h3>Detailed Statistics by Crime Type</h3>
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Crime Type</th>
                  <th>Total</th>
                  <th>Avg/Area</th>
                  <th>% of Total</th>
                  <th>Avg Per Capita</th>
                </tr>
              </thead>
              <tbody>
                {(['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'] as const).map(metric => {
                  const total = neighborhoods.reduce((sum, n) => sum + n[metric], 0);
                  const avg = total / neighborhoods.length;
                  const percentage = (total / stats.totalCrimes) * 100;

                  const perCapitaKey = `${metric}PerCapita` as keyof NeighborhoodData;
                  const perCapitaValues = neighborhoods
                    .map(n => n[perCapitaKey])
                    .filter(v => v !== null) as number[];
                  const avgPerCapita = perCapitaValues.length > 0
                    ? perCapitaValues.reduce((sum, v) => sum + v, 0) / perCapitaValues.length
                    : null;

                  return (
                    <tr key={metric} className={selectedMetric === metric ? 'highlighted' : ''}>
                      <td>{metricLabels[metric]}</td>
                      <td>{total.toLocaleString()}</td>
                      <td>{avg.toFixed(1)}</td>
                      <td>{percentage.toFixed(1)}%</td>
                      <td>
                        {avgPerCapita !== null
                          ? `${avgPerCapita.toFixed(2)} per 1k/yr`
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
