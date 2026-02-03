import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const analytics = await analyticsService.getAnalytics(params.cardId);
    
    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics non trouvés' },
        { status: 404 }
      );
    }

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  }
}

