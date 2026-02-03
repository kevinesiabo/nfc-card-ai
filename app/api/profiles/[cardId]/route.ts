import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/lib/profiles/service-db';

const profileService = ProfileService.getInstance();

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const profile = await profileService.getProfile(params.cardId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const updates = await request.json();
    const updatedProfile = await profileService.updateProfile(params.cardId, updates);
    
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Carte non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}

