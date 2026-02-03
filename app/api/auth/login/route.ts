import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';

// Pour l'instant, authentification simple basée sur l'email du profil
// En production, utiliser JWT et bcrypt pour les mots de passe
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Trouver le profil par email
    const profile = await prisma.cardProfile.findFirst({
      where: { email },
      include: {
        analytics: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Pour l'instant, on accepte n'importe quel mot de passe
    // En production, vérifier avec bcrypt
    // const isValid = await bcrypt.compare(password, profile.passwordHash);
    
    // Générer un token simple (en production, utiliser JWT)
    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      token,
      cardId: profile.id,
      email: profile.email,
      name: profile.name,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

