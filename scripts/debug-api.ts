import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../lib/profiles/service-db';

const prisma = new PrismaClient();

async function debug() {
  console.log('🔍 Diagnostic du problème...\n');

  // 1. Vérifier la connexion à la base de données
  console.log('1️⃣ Vérification de la connexion DB...');
  try {
    await prisma.$connect();
    console.log('   ✅ Connexion DB OK\n');
  } catch (error: any) {
    console.log('   ❌ Erreur de connexion:', error.message, '\n');
    return;
  }

  // 2. Vérifier si le profil existe directement avec Prisma
  console.log('2️⃣ Recherche directe du profil "demo-1" avec Prisma...');
  try {
    const directProfile = await prisma.cardProfile.findUnique({
      where: { id: 'demo-1' },
      include: { socialMedia: true, timeSlots: true },
    });
    if (directProfile) {
      console.log('   ✅ Profil trouvé directement:');
      console.log('      - ID:', directProfile.id);
      console.log('      - Nom:', directProfile.name);
      console.log('      - Email:', directProfile.email);
      console.log('      - Social Media:', directProfile.socialMedia ? 'Oui' : 'Non');
      console.log('      - Time Slots:', directProfile.timeSlots.length, '\n');
    } else {
      console.log('   ❌ Profil NON trouvé directement\n');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
  }

  // 3. Vérifier via le service
  console.log('3️⃣ Recherche via ProfileService...');
  try {
    const profileService = ProfileService.getInstance();
    const serviceProfile = await profileService.getProfile('demo-1');
    if (serviceProfile) {
      console.log('   ✅ Profil trouvé via service:');
      console.log('      - ID:', serviceProfile.id);
      console.log('      - Nom:', serviceProfile.name);
      console.log('      - Email:', serviceProfile.email, '\n');
    } else {
      console.log('   ❌ Profil NON trouvé via service\n');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur service:', error.message);
    console.log('   Stack:', error.stack, '\n');
  }

  // 4. Lister tous les profils
  console.log('4️⃣ Liste de tous les profils dans la DB...');
  try {
    const allProfiles = await prisma.cardProfile.findMany({
      select: { id: true, name: true, email: true },
    });
    if (allProfiles.length > 0) {
      console.log('   ✅ Profils trouvés:');
      allProfiles.forEach(p => {
        console.log(`      - ${p.id}: ${p.name} (${p.email})`);
      });
      console.log('');
    } else {
      console.log('   ⚠️  Aucun profil dans la base de données\n');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
  }

  // 5. Vérifier la configuration DATABASE_URL
  console.log('5️⃣ Configuration DATABASE_URL...');
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    console.log('   ✅ DATABASE_URL configuré:', dbUrl.replace(/file:.*\/([^\/]+)$/, 'file:.../$1'), '\n');
  } else {
    console.log('   ❌ DATABASE_URL non configuré\n');
  }

  await prisma.$disconnect();
  console.log('✅ Diagnostic terminé');
}

debug().catch(console.error);

