import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    await analyticsService.trackAppointment(params.cardId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking du rendez-vous' },
      { status: 500 }
    );
  }
}

