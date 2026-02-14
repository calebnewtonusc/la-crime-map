/**
 * Accessibility-friendly color schemes and pattern utilities
 * Supports high contrast mode and colorblind-friendly patterns
 */

type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft';

export interface ColorScheme {
  standard: string;
  highContrast: string;
  pattern?: string; // For colorblind mode
  patternDescription: string;
}

// WCAG AA compliant color schemes
export const accessibilityColorSchemes = {
  low: {
    standard: '#00ff00',
    highContrast: '#00ff00',
    pattern: 'dots',
    patternDescription: 'Low severity - dotted pattern'
  },
  moderate: {
    standard: '#ffff00',
    highContrast: '#ffff00',
    pattern: 'diagonal-lines',
    patternDescription: 'Moderate severity - diagonal lines'
  },
  high: {
    standard: '#ff9900',
    highContrast: '#ff9900',
    pattern: 'horizontal-lines',
    patternDescription: 'High severity - horizontal lines'
  },
  veryHigh: {
    standard: '#ff0000',
    highContrast: '#ff0000',
    pattern: 'crosshatch',
    patternDescription: 'Very high severity - crosshatch pattern'
  }
};

// SVG patterns for colorblind mode
export const createPatternDefs = (): string => {
  return `
    <defs>
      <!-- Dots pattern for low severity -->
      <pattern id="pattern-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.5" fill="#000" opacity="0.3"/>
      </pattern>

      <!-- Diagonal lines for moderate severity -->
      <pattern id="pattern-diagonal-lines" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="8" x2="8" y2="0" stroke="#000" stroke-width="2" opacity="0.3"/>
      </pattern>

      <!-- Horizontal lines for high severity -->
      <pattern id="pattern-horizontal-lines" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="4" x2="8" y2="4" stroke="#000" stroke-width="2" opacity="0.3"/>
      </pattern>

      <!-- Crosshatch for very high severity -->
      <pattern id="pattern-crosshatch" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="8" y2="8" stroke="#000" stroke-width="1.5" opacity="0.3"/>
        <line x1="8" y1="0" x2="0" y2="8" stroke="#000" stroke-width="1.5" opacity="0.3"/>
      </pattern>
    </defs>
  `;
};

// Get severity level based on value and metric
export const getSeverityLevel = (
  value: number,
  metric: CrimeMetric
): 'low' | 'moderate' | 'high' | 'veryHigh' => {
  // Thresholds for different crime types
  const thresholds: Record<CrimeMetric, [number, number, number]> = {
    violentCrime: [5, 10, 15],
    carTheft: [5, 10, 15],
    breakIns: [5, 10, 15],
    pettyTheft: [10, 20, 30]
  };

  const [low, moderate, high] = thresholds[metric];

  if (value < low) return 'low';
  if (value < moderate) return 'moderate';
  if (value < high) return 'high';
  return 'veryHigh';
};

// Get color with accessibility mode support
export const getAccessibleColor = (
  value: number,
  metric: CrimeMetric,
  options: {
    highContrast?: boolean;
    colorblindMode?: boolean;
  } = {}
): { color: string; pattern?: string; description: string } => {
  const severity = getSeverityLevel(value, metric);
  const scheme = accessibilityColorSchemes[severity];

  const color = options.highContrast ? scheme.highContrast : scheme.standard;
  const pattern = options.colorblindMode ? scheme.pattern : undefined;

  return {
    color,
    pattern,
    description: scheme.patternDescription
  };
};

// Generate CSS for patterns (for use in legend and other non-SVG contexts)
export const getPatternCSS = (pattern: string): string => {
  const patterns: Record<string, string> = {
    dots: `
      background-image: radial-gradient(circle, rgba(0,0,0,0.3) 2px, transparent 2px);
      background-size: 8px 8px;
    `,
    'diagonal-lines': `
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.3) 3px,
        rgba(0,0,0,0.3) 5px
      );
    `,
    'horizontal-lines': `
      background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.3) 3px,
        rgba(0,0,0,0.3) 5px
      );
    `,
    crosshatch: `
      background-image:
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 3px,
          rgba(0,0,0,0.3) 3px,
          rgba(0,0,0,0.3) 4px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 3px,
          rgba(0,0,0,0.3) 3px,
          rgba(0,0,0,0.3) 4px
        );
    `
  };

  return patterns[pattern] || '';
};

// Get text description for screen readers
export const getSeverityDescription = (
  value: number,
  metric: CrimeMetric,
  language: string = 'en'
): string => {
  const severity = getSeverityLevel(value, metric);

  const descriptions: Record<string, Record<string, string>> = {
    en: {
      low: 'low severity',
      moderate: 'moderate severity',
      high: 'high severity',
      veryHigh: 'very high severity'
    },
    es: {
      low: 'severidad baja',
      moderate: 'severidad moderada',
      high: 'severidad alta',
      veryHigh: 'severidad muy alta'
    }
  };

  return descriptions[language]?.[severity] || descriptions['en'][severity];
};
