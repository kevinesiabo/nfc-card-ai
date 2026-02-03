import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AnalyticsService } from '@/lib/analytics/service-db';

const analyticsService = AnalyticsService.getInstance();

export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { visitorName, visitorPhone, contextMessage } = await request.json();

    if (!visitorPhone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Vérifier que le profil existe
    const profile = await prisma.cardProfile.findUnique({
      where: { id: params.cardId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    // Créer l'échange de contact
    const contactExchange = await prisma.contactExchange.create({
      data: {
        cardId: params.cardId,
        visitorPhone,
        visitorName: visitorName || null,
        contextMessage: contextMessage || null,
        status: 'pending',
      },
    });

    // Tracker l'analytics
    await analyticsService.trackContactExchange(params.cardId);

    return NextResponse.json(contactExchange, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contact exchange:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'échange de contact' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const exchanges = await prisma.contactExchange.findMany({
      where: {
        cardId: params.cardId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 50, // Limiter à 50 derniers échanges
    });

    return NextResponse.json(exchanges);
  } catch (error: any) {
    console.error('Error fetching contact exchanges:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des échanges' },
      { status: 500 }
    );
  }
}

