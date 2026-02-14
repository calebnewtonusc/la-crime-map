import Anthropic from '@anthropic-ai/sdk';
import { NeighborhoodData } from '@/lib/data/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface SmartInsight {
  title: string;
  description: string;
  type: 'trend' | 'comparison' | 'alert' | 'tip';
  neighborhoods?: string[];
}

// Cache for insights (refresh every hour)
let insightsCache: SmartInsight[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function generateSmartInsights(
  neighborhoods: NeighborhoodData[]
): Promise<SmartInsight[]> {
  // Check cache
  const now = Date.now();
  if (insightsCache && now - lastCacheTime < CACHE_DURATION) {
    return insightsCache;
  }

  try {
    // Calculate some statistics
    const stats = calculateStats(neighborhoods);

    const prompt = `Analyze this LA crime data and generate 4-5 interesting, actionable insights for users:

Statistics:
- Total neighborhoods: ${neighborhoods.length}
- Safest neighborhoods: ${stats.safest.join(', ')}
- Highest crime areas: ${stats.highest.join(', ')}
- Average violent crime: ${stats.avgViolent.toFixed(1)}
- Average car theft: ${stats.avgCarTheft.toFixed(1)}
- Improving neighborhoods: ${stats.improving.join(', ')}
- Worsening neighborhoods: ${stats.worsening.join(', ')}
- Low crime westside count: ${stats.westsideCount}
- High crime south LA count: ${stats.southLACount}

Generate insights that are:
1. Interesting and actionable
2. Based on real patterns in the data
3. Helpful for people deciding where to live/visit
4. Mix of trends, comparisons, and safety tips

Format as JSON array:
[
  {
    "title": "Short, catchy title",
    "description": "1-2 sentences explaining the insight",
    "type": "trend|comparison|alert|tip",
    "neighborhoods": ["list", "of", "relevant", "neighborhoods"]
  }
]`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '[]';

    // Parse JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const insights: SmartInsight[] = JSON.parse(jsonMatch[0]);

    // Cache the results
    insightsCache = insights;
    lastCacheTime = now;

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);

    // Return fallback insights
    return getFallbackInsights(neighborhoods);
  }
}

function calculateStats(neighborhoods: NeighborhoodData[]) {
  const sorted = [...neighborhoods].sort((a, b) => {
    const aTotal = a.violentCrime + a.carTheft + a.breakIns + a.pettyTheft;
    const bTotal = b.violentCrime + b.carTheft + b.breakIns + b.pettyTheft;
    return aTotal - bTotal;
  });

  const improving = neighborhoods.filter(
    (n) => n.trendIndicator === 'improving'
  );
  const worsening = neighborhoods.filter(
    (n) => n.trendIndicator === 'worsening'
  );

  const westsideAreas = [
    'Santa Monica',
    'Venice',
    'West LA',
    'Beverly Hills',
    'Brentwood',
    'Marina del Rey',
  ];
  const southLAAreas = ['South LA', 'Compton', 'Watts', 'Inglewood'];

  return {
    safest: sorted.slice(0, 3).map((n) => n.name),
    highest: sorted.slice(-3).map((n) => n.name),
    avgViolent:
      neighborhoods.reduce((sum, n) => sum + n.violentCrime, 0) /
      neighborhoods.length,
    avgCarTheft:
      neighborhoods.reduce((sum, n) => sum + n.carTheft, 0) /
      neighborhoods.length,
    improving: improving.map((n) => n.name),
    worsening: worsening.map((n) => n.name),
    westsideCount: neighborhoods.filter((n) =>
      westsideAreas.includes(n.name)
    ).length,
    southLACount: neighborhoods.filter((n) =>
      southLAAreas.includes(n.name)
    ).length,
  };
}

function getFallbackInsights(
  neighborhoods: NeighborhoodData[]
): SmartInsight[] {
  const stats = calculateStats(neighborhoods);

  return [
    {
      title: 'Westside Safety Premium',
      description: `Neighborhoods like ${stats.safest[0]} and ${stats.safest[1]} consistently show lower crime rates, making them ideal for families prioritizing safety.`,
      type: 'comparison',
      neighborhoods: stats.safest,
    },
    {
      title: 'Car Theft Hotspots',
      description: `Car theft rates are notably higher in ${stats.highest[0]} and ${stats.highest[1]}. Always park in well-lit areas and use steering wheel locks.`,
      type: 'alert',
      neighborhoods: stats.highest,
    },
    {
      title: 'Improving Neighborhoods',
      description: `Crime trends are improving in several areas, offering good value for those willing to be early adopters in gentrifying neighborhoods.`,
      type: 'trend',
      neighborhoods: stats.improving.slice(0, 3),
    },
    {
      title: 'Safety Tips for Urban Living',
      description:
        'Regardless of neighborhood, always stay aware of your surroundings, especially after dark. Trust your instincts and avoid isolated areas at night.',
      type: 'tip',
    },
  ];
}

export async function generateTrendExplanation(
  neighborhood: NeighborhoodData,
  crimeType: string
): Promise<string> {
  try {
    const prompt = `Explain in 2-3 sentences why ${crimeType} might be ${
      neighborhood.trendIndicator
    } in ${neighborhood.name}, Los Angeles.

Current ${crimeType} rate: ${
      neighborhood[crimeType as keyof NeighborhoodData]
    }/10

Be specific but acknowledge that you're providing possible factors, not definitive causes. Focus on urban development patterns, economic factors, and policing strategies that could influence this trend.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error generating trend explanation:', error);
    return `Crime trends can fluctuate based on various factors including economic conditions, policing strategies, and community initiatives. The ${neighborhood.trendIndicator} trend in ${neighborhood.name} reflects these complex urban dynamics.`;
  }
}

export async function generateComparison(
  neighborhood1: NeighborhoodData,
  neighborhood2: NeighborhoodData
): Promise<string> {
  try {
    const prompt = `Compare ${neighborhood1.name} and ${neighborhood2.name} in Los Angeles based on this crime data:

${neighborhood1.name}:
- Violent Crime: ${neighborhood1.violentCrime}/10
- Car Theft: ${neighborhood1.carTheft}/10
- Break-ins: ${neighborhood1.breakIns}/10
- Petty Theft: ${neighborhood1.pettyTheft}/10
- Safety Score: ${neighborhood1.safetyScore}

${neighborhood2.name}:
- Violent Crime: ${neighborhood2.violentCrime}/10
- Car Theft: ${neighborhood2.carTheft}/10
- Break-ins: ${neighborhood2.breakIns}/10
- Petty Theft: ${neighborhood2.pettyTheft}/10
- Safety Score: ${neighborhood2.safetyScore}

Provide a helpful 3-4 sentence comparison that helps someone decide between these neighborhoods. Be balanced and nuanced.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error generating comparison:', error);
    return `${neighborhood1.name} and ${neighborhood2.name} each have distinct safety profiles. Consider visiting both areas and reviewing the detailed crime statistics to make an informed decision.`;
  }
}
