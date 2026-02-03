import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/lib/profiles/service-db';
import { CardProfile } from '@/types';

const profileService = ProfileService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const profile: CardProfile = await request.json();
    const createdProfile = await profileService.createProfile(profile);
    
    return NextResponse.json(createdProfile, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du profil' },
      { status: 500 }
    );
  }
}

