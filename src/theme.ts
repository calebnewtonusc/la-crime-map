// Professional color system with colorblind-safe palettes
// Inspired by Zillow, Trulia, and other real estate/data visualization apps

export type Theme = 'light' | 'dark';

// Colorblind-safe color scheme using viridis-inspired palette
// These colors work for deuteranopia, protanopia, and tritanopia
export const colorScales = {
  // Professional gradient from safe (blue) to warning (amber) to danger (purple-red)
  // This avoids red-green issues and uses a scientifically-validated colorblind-safe palette
  risk: {
    veryLow: '#4575b4',    // Deep blue - safest
    low: '#74add1',        // Light blue
    moderate: '#fee090',   // Light amber
    high: '#f46d43',       // Coral/orange
    veryHigh: '#d73027',   // Red-purple (distinguishable from green)
  },

  // Alternative gradients for different metrics
  heatmap: [
    '#313695', // Darkest blue
    '#4575b4', // Deep blue
    '#74add1', // Light blue
    '#abd9e9', // Very light blue
    '#fee090', // Light yellow
    '#fdae61', // Orange
    '#f46d43', // Coral
    '#d73027', // Red
    '#a50026', // Dark red
  ],
};

// Brand colors
export const brandColors = {
  primary: '#2563eb',      // Professional blue
  primaryHover: '#1d4ed8',
  secondary: '#0891b2',    // Teal
  accent: '#7c3aed',       // Purple
  success: '#059669',      // Green
  warning: '#d97706',      // Amber
  danger: '#dc2626',       // Red
  info: '#0284c7',         // Sky blue
};

// Light theme colors
export const lightTheme = {
  // Backgrounds
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    modal: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    disabled: '#cbd5e1',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    heavy: '#94a3b8',
    focus: brandColors.primary,
  },

  // Surface colors for cards, panels, etc.
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    hover: '#f1f5f9',
    active: '#e2e8f0',
  },

  // Status colors
  status: {
    success: '#059669',
    successBg: '#d1fae5',
    warning: '#d97706',
    warningBg: '#fef3c7',
    danger: '#dc2626',
    dangerBg: '#fee2e2',
    info: '#0284c7',
    infoBg: '#e0f2fe',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Dark theme colors
export const darkTheme = {
  // Backgrounds
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    elevated: '#1e293b',
    modal: '#1e293b',
  },

  // Text colors
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    disabled: '#64748b',
    inverse: '#0f172a',
  },

  // Border colors
  border: {
    light: '#334155',
    medium: '#475569',
    heavy: '#64748b',
    focus: brandColors.primary,
  },

  // Surface colors
  surface: {
    primary: '#1e293b',
    secondary: '#334155',
    tertiary: '#475569',
    hover: '#334155',
    active: '#475569',
  },

  // Status colors
  status: {
    success: '#10b981',
    successBg: '#064e3b',
    warning: '#f59e0b',
    warningBg: '#78350f',
    danger: '#ef4444',
    dangerBg: '#7f1d1d',
    info: '#06b6d4',
    infoBg: '#164e63',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
  },
};

// Typography scale
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Spacing scale (in pixels)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

// Border radius
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Breakpoints for responsive design
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Get color for crime rate (colorblind-safe)
export function getCrimeRateColor(value: number, metric: string, theme: Theme = 'light'): string {
  // Metric-specific thresholds
  const thresholds: Record<string, number[]> = {
    violentCrime: [2, 5, 10, 15],
    carTheft: [5, 10, 15, 20],
    breakIns: [5, 10, 15, 20],
    pettyTheft: [10, 20, 30, 40]
  };

  const t = thresholds[metric] || [5, 10, 15, 20];

  if (value < t[0]) return colorScales.risk.veryLow;
  if (value < t[1]) return colorScales.risk.low;
  if (value < t[2]) return colorScales.risk.moderate;
  if (value < t[3]) return colorScales.risk.high;
  return colorScales.risk.veryHigh;
}

// Get risk level label
export function getRiskLevel(value: number, metric: string): {
  level: string;
  label: string;
  description: string;
} {
  const thresholds: Record<string, number[]> = {
    violentCrime: [2, 5, 10, 15],
    carTheft: [5, 10, 15, 20],
    breakIns: [5, 10, 15, 20],
    pettyTheft: [10, 20, 30, 40]
  };

  const t = thresholds[metric] || [5, 10, 15, 20];

  if (value < t[0]) {
    return {
      level: 'veryLow',
      label: 'Very Low',
      description: 'Significantly below average'
    };
  }
  if (value < t[1]) {
    return {
      level: 'low',
      label: 'Low',
      description: 'Below average'
    };
  }
  if (value < t[2]) {
    return {
      level: 'moderate',
      label: 'Moderate',
      description: 'Near average'
    };
  }
  if (value < t[3]) {
    return {
      level: 'high',
      label: 'High',
      description: 'Above average'
    };
  }
  return {
    level: 'veryHigh',
    label: 'Very High',
    description: 'Significantly above average'
  };
}

// Data quality confidence levels
export interface DataQuality {
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
  sampleSize: number;
  message: string;
}

export function getDataQuality(date: Date, sampleSize: number): DataQuality {
  const daysSinceUpdate = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  let confidence: 'high' | 'medium' | 'low';
  let message: string;

  if (daysSinceUpdate <= 7 && sampleSize > 100) {
    confidence = 'high';
    message = 'Recent data with high statistical confidence';
  } else if (daysSinceUpdate <= 30 && sampleSize > 50) {
    confidence = 'medium';
    message = 'Recent data with moderate statistical confidence';
  } else {
    confidence = 'low';
    message = 'Older data or limited sample size - use with caution';
  }

  return {
    confidence,
    lastUpdated: date.toLocaleDateString(),
    sampleSize,
    message
  };
}

export default {
  colorScales,
  brandColors,
  lightTheme,
  darkTheme,
  typography,
  spacing,
  borderRadius,
  breakpoints,
  getCrimeRateColor,
  getRiskLevel,
  getDataQuality,
};
