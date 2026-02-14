import { NextRequest, NextResponse } from 'next/server';
import { laNeighborhoods } from '@/lib/data/neighborhoods';
import { generateNeighborhoodDescription } from '@/lib/ai/generate-descriptions';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Neighborhood name is required' },
        { status: 400 }
      );
    }

    // Find neighborhood
    const neighborhood = laNeighborhoods.features.find(
      (f) => f.properties.name === name
    );

    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood not found' },
        { status: 404 }
      );
    }

    const description = await generateNeighborhoodDescription(
      neighborhood.properties
    );

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate description',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
