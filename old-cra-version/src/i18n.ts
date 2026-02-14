import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Header
      'header.title': 'LA Crime Map',
      'header.subtitle': 'Visualize crime by neighborhood',
      'header.loading': 'Loading data...',
      'header.dataSource': 'Data: {{source}}',
      'header.refresh': 'Refresh',
      'header.refreshTitle': 'Clear cache and refresh data',

      // View Modes
      'view.map': 'Map View',
      'view.analytics': 'Analytics Dashboard',

      // Controls
      'controls.search': 'Search neighborhoods...',
      'controls.clearSearch': 'Clear search',
      'controls.timePeriod': 'Time Period:',
      'controls.minSeverity': 'Min Severity: {{value}}',
      'controls.sortBy': 'Sort By:',
      'controls.compareMode': 'Compare Mode',
      'controls.exitCompare': 'Exit Compare',

      // Time Ranges
      'time.lastWeek': 'Last Week',
      'time.lastMonth': 'Last Month',
      'time.last3Months': 'Last 3 Months',
      'time.lastYear': 'Last Year',

      // Sort Options
      'sort.crimeRate': 'Crime Rate',
      'sort.alphabetical': 'Alphabetical',

      // Crime Types
      'crime.violentCrime': 'Violent Crime',
      'crime.carTheft': 'Car Theft',
      'crime.breakIns': 'Break-ins',
      'crime.pettyTheft': 'Petty Theft',

      // Map Legend
      'legend.low': 'Low',
      'legend.moderate': 'Moderate',
      'legend.high': 'High',
      'legend.veryHigh': 'Very High',

      // Stats Panel
      'stats.currentMetric': 'Current Metric: {{metric}}',
      'stats.closePanel': 'Close statistics panel',
      'stats.togglePanel': 'Toggle statistics panel',
      'stats.perWeek': 'per week',
      'stats.showingResults': 'Showing {{filtered}} of {{total}} neighborhoods',
      'stats.noResults': 'No neighborhoods match your filters',

      // Compare Mode
      'compare.title': 'Compare Neighborhoods ({{count}}/3)',
      'compare.hint': 'Click neighborhoods on the map to compare (max 3)',
      'compare.clearSelection': 'Clear Selection',
      'compare.total': 'Total',

      // Analytics
      'analytics.title': 'Crime Analytics Dashboard',
      'analytics.exportCSV': 'Export to CSV',
      'analytics.totalCrimes': 'Total Crimes (Weekly)',
      'analytics.neighborhoods': 'Neighborhoods',
      'analytics.averagePerArea': 'Average Per Area',
      'analytics.metricTotal': '{{metric}} Total',
      'analytics.safestArea': 'Safest Area',
      'analytics.highestCrime': 'Highest Crime',
      'analytics.top10': 'Top 10 Areas - {{metric}}',
      'analytics.trend': 'Crime Trend - {{metric}} (Last 12 Weeks)',
      'analytics.distribution': 'Crime Type Distribution',
      'analytics.selectNeighborhood': 'Select Neighborhood:',
      'analytics.allNeighborhoods': 'All Neighborhoods',
      'analytics.detailedStats': 'Detailed Statistics by Crime Type',
      'analytics.crimeType': 'Crime Type',
      'analytics.total': 'Total',
      'analytics.avgPerArea': 'Avg/Area',
      'analytics.percentOfTotal': '% of Total',
      'analytics.historicalNote': 'Note: Historical trend data is simulated for demonstration purposes',

      // Accessibility
      'a11y.settings': 'Accessibility Settings',
      'a11y.openSettings': 'Open accessibility settings',
      'a11y.closeSettings': 'Close accessibility settings',
      'a11y.highContrast': 'High Contrast Mode',
      'a11y.colorblindMode': 'Colorblind-Friendly Patterns',
      'a11y.fontSize': 'Font Size',
      'a11y.fontSizeSmall': 'Small',
      'a11y.fontSizeMedium': 'Medium',
      'a11y.fontSizeLarge': 'Large',
      'a11y.fontSizeXLarge': 'Extra Large',
      'a11y.language': 'Language',
      'a11y.skipToMain': 'Skip to main content',
      'a11y.skipToNav': 'Skip to navigation',
      'a11y.statement': 'Accessibility Statement',
      'a11y.announceDataLoaded': 'Crime data loaded successfully. {{count}} neighborhoods available.',
      'a11y.announceMetricChange': 'Switched to {{metric}}. Showing crime statistics.',
      'a11y.announceNeighborhoodHover': '{{name}}: {{value}} {{metric}} per week',
      'a11y.announceSearchResults': '{{count}} neighborhoods found',

      // Footer
      'footer.dataSource': 'Data source: LA City Open Data Portal',
      'footer.disclaimer': 'This visualization is for informational purposes only.',
      'footer.contact': 'Report issues or feedback',

      // Error Messages
      'error.dataLoadFailed': 'Failed to load crime data. Using sample data.',
      'error.noData': 'No data available for the selected time period.',

      // Popup
      'popup.neighborhood': 'Neighborhood',
      'popup.violentCrime': 'Violent Crime',
      'popup.carTheft': 'Car Theft',
      'popup.breakIns': 'Break-ins',
      'popup.pettyTheft': 'Petty Theft',
    }
  },
  es: {
    translation: {
      // Header
      'header.title': 'Mapa de Crimen de LA',
      'header.subtitle': 'Visualice el crimen por vecindario',
      'header.loading': 'Cargando datos...',
      'header.dataSource': 'Datos: {{source}}',
      'header.refresh': 'Actualizar',
      'header.refreshTitle': 'Borrar caché y actualizar datos',

      // View Modes
      'view.map': 'Vista de Mapa',
      'view.analytics': 'Panel de Análisis',

      // Controls
      'controls.search': 'Buscar vecindarios...',
      'controls.clearSearch': 'Borrar búsqueda',
      'controls.timePeriod': 'Período de Tiempo:',
      'controls.minSeverity': 'Severidad Mínima: {{value}}',
      'controls.sortBy': 'Ordenar Por:',
      'controls.compareMode': 'Modo Comparar',
      'controls.exitCompare': 'Salir de Comparar',

      // Time Ranges
      'time.lastWeek': 'Última Semana',
      'time.lastMonth': 'Último Mes',
      'time.last3Months': 'Últimos 3 Meses',
      'time.lastYear': 'Último Año',

      // Sort Options
      'sort.crimeRate': 'Tasa de Crimen',
      'sort.alphabetical': 'Alfabético',

      // Crime Types
      'crime.violentCrime': 'Crimen Violento',
      'crime.carTheft': 'Robo de Autos',
      'crime.breakIns': 'Robos',
      'crime.pettyTheft': 'Hurto Menor',

      // Map Legend
      'legend.low': 'Bajo',
      'legend.moderate': 'Moderado',
      'legend.high': 'Alto',
      'legend.veryHigh': 'Muy Alto',

      // Stats Panel
      'stats.currentMetric': 'Métrica Actual: {{metric}}',
      'stats.closePanel': 'Cerrar panel de estadísticas',
      'stats.togglePanel': 'Alternar panel de estadísticas',
      'stats.perWeek': 'por semana',
      'stats.showingResults': 'Mostrando {{filtered}} de {{total}} vecindarios',
      'stats.noResults': 'Ningún vecindario coincide con sus filtros',

      // Compare Mode
      'compare.title': 'Comparar Vecindarios ({{count}}/3)',
      'compare.hint': 'Haga clic en los vecindarios en el mapa para comparar (máximo 3)',
      'compare.clearSelection': 'Borrar Selección',
      'compare.total': 'Total',

      // Analytics
      'analytics.title': 'Panel de Análisis de Crimen',
      'analytics.exportCSV': 'Exportar a CSV',
      'analytics.totalCrimes': 'Crímenes Totales (Semanales)',
      'analytics.neighborhoods': 'Vecindarios',
      'analytics.averagePerArea': 'Promedio Por Área',
      'analytics.metricTotal': 'Total de {{metric}}',
      'analytics.safestArea': 'Área Más Segura',
      'analytics.highestCrime': 'Mayor Crimen',
      'analytics.top10': 'Top 10 Áreas - {{metric}}',
      'analytics.trend': 'Tendencia de Crimen - {{metric}} (Últimas 12 Semanas)',
      'analytics.distribution': 'Distribución de Tipos de Crimen',
      'analytics.selectNeighborhood': 'Seleccionar Vecindario:',
      'analytics.allNeighborhoods': 'Todos los Vecindarios',
      'analytics.detailedStats': 'Estadísticas Detalladas por Tipo de Crimen',
      'analytics.crimeType': 'Tipo de Crimen',
      'analytics.total': 'Total',
      'analytics.avgPerArea': 'Prom/Área',
      'analytics.percentOfTotal': '% del Total',
      'analytics.historicalNote': 'Nota: Los datos de tendencia histórica son simulados con fines de demostración',

      // Accessibility
      'a11y.settings': 'Configuración de Accesibilidad',
      'a11y.openSettings': 'Abrir configuración de accesibilidad',
      'a11y.closeSettings': 'Cerrar configuración de accesibilidad',
      'a11y.highContrast': 'Modo de Alto Contraste',
      'a11y.colorblindMode': 'Patrones Amigables para Daltónicos',
      'a11y.fontSize': 'Tamaño de Fuente',
      'a11y.fontSizeSmall': 'Pequeño',
      'a11y.fontSizeMedium': 'Mediano',
      'a11y.fontSizeLarge': 'Grande',
      'a11y.fontSizeXLarge': 'Extra Grande',
      'a11y.language': 'Idioma',
      'a11y.skipToMain': 'Saltar al contenido principal',
      'a11y.skipToNav': 'Saltar a la navegación',
      'a11y.statement': 'Declaración de Accesibilidad',
      'a11y.announceDataLoaded': 'Datos de crimen cargados exitosamente. {{count}} vecindarios disponibles.',
      'a11y.announceMetricChange': 'Cambiado a {{metric}}. Mostrando estadísticas de crimen.',
      'a11y.announceNeighborhoodHover': '{{name}}: {{value}} {{metric}} por semana',
      'a11y.announceSearchResults': '{{count}} vecindarios encontrados',

      // Footer
      'footer.dataSource': 'Fuente de datos: Portal de Datos Abiertos de la Ciudad de LA',
      'footer.disclaimer': 'Esta visualización es solo con fines informativos.',
      'footer.contact': 'Reportar problemas o comentarios',

      // Error Messages
      'error.dataLoadFailed': 'Error al cargar los datos de crimen. Usando datos de muestra.',
      'error.noData': 'No hay datos disponibles para el período de tiempo seleccionado.',

      // Popup
      'popup.neighborhood': 'Vecindario',
      'popup.violentCrime': 'Crimen Violento',
      'popup.carTheft': 'Robo de Autos',
      'popup.breakIns': 'Robos',
      'popup.pettyTheft': 'Hurto Menor',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
