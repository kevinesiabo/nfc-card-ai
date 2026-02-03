import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Route pour tracker les événements et déclencher des notifications
export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { type, data } = await request.json();

    // Ici, on pourrait stocker les événements dans une table de notifications
    // Pour l'instant, on retourne juste un succès
    // Les notifications seront détectées par le système SSE qui vérifie périodiquement

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking' },
      { status: 500 }
    );
  }
}

