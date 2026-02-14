/**
 * API Route: Update Crime Data with REAL LAPD Data
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateNeighborhoodData } from '@/lib/services/data-updater';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.DATA_UPDATE_API_KEY || 'dev-key';

    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting real crime data update...');
    const result = await updateNeighborhoodData();

    return NextResponse.json({
      message: result.success ? 'Real LAPD data updated' : 'Update failed',
      ...result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to trigger real LAPD data update',
    source: 'LA City Open Data Portal (data.lacity.org)',
    endpoint: '/api/update-crime-data',
  });
}
