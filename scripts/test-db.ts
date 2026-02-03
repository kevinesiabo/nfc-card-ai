import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../lib/profiles/service-db';
import { AnalyticsService } from '../lib/analytics/service-db';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🧪 Tests de la base de données...\n');

  try {
    // Test 1: Connexion à la base de données
    console.log('1️⃣ Test de connexion...');
    await prisma.$connect();
    console.log('✅ Connexion réussie\n');

    // Test 2: Vérifier que le profil demo-1 existe
    console.log('2️⃣ Test de récupération du profil...');
    const profileService = ProfileService.getInstance();
    const profile = await profileService.getProfile('demo-1');
    if (profile) {
      console.log('✅ Profil trouvé:', profile.name);
      console.log('   - Email:', profile.email);
      console.log('   - Créneaux disponibles:', profile.availableSlots?.length || 0);
    } else {
      console.log('❌ Profil non trouvé');
      return;
    }
    console.log('');

    // Test 3: Test Analytics Service
    console.log('3️⃣ Test du service Analytics...');
    const analyticsService = AnalyticsService.getInstance();
    
    // Récupérer les analytics actuels
    let analytics = await analyticsService.getAnalytics('demo-1');
    console.log('   Analytics initiaux:', analytics ? '✅' : '❌');
    
    // Tester le tracking
    await analyticsService.trackScan('demo-1', 'nfc');
    await analyticsService.trackAIInteraction('demo-1');
    
    analytics = await analyticsService.getAnalytics('demo-1');
    if (analytics) {
      console.log('   - Scans NFC:', analytics.scans.nfc);
      console.log('   - Interactions IA:', analytics.aiInteractions);
      console.log('✅ Analytics fonctionnel\n');
    } else {
      console.log('❌ Erreur analytics\n');
    }

    // Test 4: Vérifier les tables
    console.log('4️⃣ Test des tables...');
    const cardCount = await prisma.cardProfile.count();
    const slotCount = await prisma.timeSlot.count();
    const analyticsCount = await prisma.analytics.count();
    
    console.log('   - Profils:', cardCount);
    console.log('   - Créneaux:', slotCount);
    console.log('   - Analytics:', analyticsCount);
    console.log('✅ Tables accessibles\n');

    // Test 5: Test de création de profil
    console.log('5️⃣ Test de création de profil...');
    const testProfile = await profileService.createProfile({
      id: 'test-' + Date.now(),
      name: 'Test User',
      position: 'Test Position',
      company: 'Test Company',
      phone: '+33600000000',
      email: 'test@example.com',
    });
    console.log('✅ Profil de test créé:', testProfile.id);
    
    // Nettoyer
    await prisma.cardProfile.delete({ where: { id: testProfile.id } });
    console.log('✅ Profil de test supprimé\n');

    console.log('🎉 Tous les tests de base de données sont passés !\n');

  } catch (error: any) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

