import Anthropic from '@anthropic-ai/sdk';
import { NeighborhoodData } from '@/lib/data/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface NeighborhoodDescription {
  vibe: string;
  safetyContext: string;
  bestFor: string[];
  avoidIf: string[];
  hiddenGems: string;
}

// Cache for generated descriptions (in production, use Redis or database)
const descriptionCache = new Map<string, NeighborhoodDescription>();

export async function generateNeighborhoodDescription(
  neighborhood: NeighborhoodData
): Promise<NeighborhoodDescription> {
  // Check cache first
  const cached = descriptionCache.get(neighborhood.name);
  if (cached) {
    return cached;
  }

  try {
    const prompt = `Generate a concise, helpful description for ${neighborhood.name} in Los Angeles based on this crime data:

Violent Crime: ${neighborhood.violentCrime}/10
Car Theft: ${neighborhood.carTheft}/10
Break-ins: ${neighborhood.breakIns}/10
Petty Theft: ${neighborhood.pettyTheft}/10
Safety Score: ${neighborhood.safetyScore || 'N/A'}
Safety Percentile: ${neighborhood.overallSafetyPercentile || 'N/A'}
Trend: ${neighborhood.trendIndicator}

Please provide:
1. Vibe: A one-sentence description of the neighborhood's character (max 120 chars)
2. Safety Context: 2-3 sentences explaining the crime situation with nuance and context
3. Best For: 3-4 types of people/lifestyles this neighborhood suits
4. Avoid If: 2-3 situations where this neighborhood might not be ideal
5. Hidden Gems: One interesting fact or recommendation about the area

Format your response as JSON:
{
  "vibe": "...",
  "safetyContext": "...",
  "bestFor": ["...", "..."],
  "avoidIf": ["...", "..."],
  "hiddenGems": "..."
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '{}';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const description: NeighborhoodDescription = JSON.parse(jsonMatch[0]);

    // Cache the result
    descriptionCache.set(neighborhood.name, description);

    return description;
  } catch (error) {
    console.error('Error generating description:', error);

    // Return fallback description
    const fallbackDescription: NeighborhoodDescription = {
      vibe: `${neighborhood.name} is a diverse LA neighborhood with its own unique character.`,
      safetyContext: `Crime levels are at ${neighborhood.violentCrime}/10 for violent crime, ${neighborhood.carTheft}/10 for car theft. Like most urban areas, staying aware of your surroundings is important.`,
      bestFor: ['Urban dwellers', 'LA explorers', 'Those seeking diversity'],
      avoidIf: ['Looking for suburban feel', 'Need absolute lowest crime rates'],
      hiddenGems: `Explore ${neighborhood.name} to discover its local character and hidden spots.`,
    };

    return fallbackDescription;
  }
}

export async function generateBatchDescriptions(
  neighborhoods: NeighborhoodData[]
): Promise<Map<string, NeighborhoodDescription>> {
  const results = new Map<string, NeighborhoodDescription>();

  // Generate descriptions in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < neighborhoods.length; i += batchSize) {
    const batch = neighborhoods.slice(i, i + batchSize);
    const promises = batch.map((n) => generateNeighborhoodDescription(n));

    const batchResults = await Promise.all(promises);
    batchResults.forEach((desc, idx) => {
      results.set(batch[idx].name, desc);
    });

    // Small delay between batches
    if (i + batchSize < neighborhoods.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Pre-generate descriptions for common neighborhoods
export async function warmCache(neighborhoods: NeighborhoodData[]) {
  const highPriority = [
    'Santa Monica',
    'Venice',
    'Hollywood',
    'Beverly Hills',
    'Downtown LA',
    'Silver Lake',
    'West Hollywood',
    'Pasadena',
  ];

  const toGenerate = neighborhoods.filter((n) =>
    highPriority.includes(n.name)
  );

  await generateBatchDescriptions(toGenerate);
}
