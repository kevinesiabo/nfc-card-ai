import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { date, startTime, endTime, location, meetingLink } = await request.json();

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Date, heure de début et heure de fin sont requis' },
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

    // Créer le créneau
    const timeSlot = await prisma.timeSlot.create({
      data: {
        cardId: params.cardId,
        date,
        startTime,
        endTime,
        available: true,
        location: location || null,
        meetingLink: meetingLink || null,
      },
    });

    return NextResponse.json(timeSlot, { status: 201 });
  } catch (error: any) {
    console.error('Error creating time slot:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du créneau' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        cardId: params.cardId,
        available: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json(timeSlots);
  } catch (error: any) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des créneaux' },
      { status: 500 }
    );
  }
}


