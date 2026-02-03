import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../lib/profiles/service-db';
import { AnalyticsService } from '../lib/analytics/service-db';

const prisma = new PrismaClient();

async function runAllTests() {
  console.log('🧪 ========================================');
  console.log('🧪 TESTS COMPLETS DU PROJET');
  console.log('🧪 ========================================\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Connexion à la base de données
  try {
    console.log('1️⃣ Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('   ✅ Connexion réussie\n');
    testsPassed++;
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Test 2: Récupération du profil
  try {
    console.log('2️⃣ Test de récupération du profil...');
    const profileService = ProfileService.getInstance();
    const profile = await profileService.getProfile('demo-1');
    if (profile && profile.name === 'Jean Dupont') {
      console.log('   ✅ Profil récupéré:', profile.name);
      console.log('   ✅ Email:', profile.email);
      console.log('   ✅ Créneaux:', profile.availableSlots?.length || 0);
      testsPassed++;
    } else {
      throw new Error('Profil non trouvé ou incorrect');
    }
    console.log('');
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Test 3: Service Analytics
  try {
    console.log('3️⃣ Test du service Analytics...');
    const analyticsService = AnalyticsService.getInstance();
    
    // Test tracking
    await analyticsService.trackScan('demo-1', 'qr');
    await analyticsService.trackContactExchange('demo-1');
    
    const analytics = await analyticsService.getAnalytics('demo-1');
    if (analytics && analytics.scans.total > 0) {
      console.log('   ✅ Analytics fonctionnel');
      console.log('   ✅ Scans totaux:', analytics.scans.total);
      console.log('   ✅ Échanges:', analytics.contactExchanges);
      testsPassed++;
    } else {
      throw new Error('Analytics non fonctionnel');
    }
    console.log('');
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Test 4: Vérification des tables
  try {
    console.log('4️⃣ Test des tables de la base de données...');
    const cardCount = await prisma.cardProfile.count();
    const slotCount = await prisma.timeSlot.count();
    const analyticsCount = await prisma.analytics.count();
    
    if (cardCount > 0 && slotCount > 0 && analyticsCount > 0) {
      console.log('   ✅ Profils:', cardCount);
      console.log('   ✅ Créneaux:', slotCount);
      console.log('   ✅ Analytics:', analyticsCount);
      testsPassed++;
    } else {
      throw new Error('Tables vides');
    }
    console.log('');
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Test 5: Création et suppression de profil
  try {
    console.log('5️⃣ Test de création/suppression de profil...');
    const profileService = ProfileService.getInstance();
    const testId = 'test-' + Date.now();
    
    const testProfile = await profileService.createProfile({
      id: testId,
      name: 'Test User',
      position: 'Test Position',
      company: 'Test Company',
      phone: '+33600000000',
      email: 'test@example.com',
    });
    
    if (testProfile && testProfile.id === testId) {
      console.log('   ✅ Profil créé:', testProfile.id);
      
      // Nettoyer
      await prisma.cardProfile.delete({ where: { id: testId } });
      console.log('   ✅ Profil supprimé');
      testsPassed++;
    } else {
      throw new Error('Échec de création');
    }
    console.log('');
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Test 6: Vérification des imports
  try {
    console.log('6️⃣ Test des imports et dépendances...');
    // Vérifier que les modules peuvent être importés
    const { AIService } = await import('../lib/ai/service');
    const { Button } = await import('../components/ui/Button');
    const { Card } = await import('../components/ui/Card');
    
    console.log('   ✅ Tous les imports fonctionnent');
    testsPassed++;
    console.log('');
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    testsFailed++;
  }

  // Résumé
  console.log('🧪 ========================================');
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('🧪 ========================================');
  console.log(`✅ Tests réussis: ${testsPassed}`);
  console.log(`❌ Tests échoués: ${testsFailed}`);
  console.log(`📈 Taux de réussite: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('');

  if (testsFailed === 0) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }

  await prisma.$disconnect();
  process.exit(testsFailed === 0 ? 0 : 1);
}

runAllTests().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

