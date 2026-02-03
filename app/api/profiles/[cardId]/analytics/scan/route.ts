import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { type } = await request.json();
    await analyticsService.trackScan(params.cardId, type || 'nfc');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking scan:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking du scan' },
      { status: 500 }
    );
  }
}

