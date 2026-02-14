import { NextResponse } from 'next/server';
import { laNeighborhoods } from '@/lib/data/neighborhoods';
import { generateSmartInsights } from '@/lib/ai/generate-insights';

export async function GET() {
  try {
    const neighborhoods = laNeighborhoods.features.map((f) => f.properties);
    const insights = await generateSmartInsights(neighborhoods);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
