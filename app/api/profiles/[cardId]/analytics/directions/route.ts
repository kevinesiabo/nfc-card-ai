import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    await analyticsService.trackDirections(params.cardId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking directions:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking des directions' },
      { status: 500 }
    );
  }
}

