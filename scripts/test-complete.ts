import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../lib/profiles/service-db';
import { AnalyticsService } from '../lib/analytics/service-db';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function testComplete() {
  console.log('🧪 ========================================');
  console.log('🧪 VERIFICATION COMPLETE DU PROJET');
  console.log('🧪 ========================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // ============================================
  // 1. TESTS BASE DE DONNEES
  // ============================================
  console.log('📊 SECTION 1: BASE DE DONNEES\n');

  try {
    totalTests++;
    console.log('1.1 Connexion à la base de données...');
    await prisma.$connect();
    console.log('   ✅ Connexion réussie\n');
    passedTests++;
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  try {
    totalTests++;
    console.log('1.2 Récupération du profil demo-1...');
    const profileService = ProfileService.getInstance();
    const profile = await profileService.getProfile('demo-1');
    if (profile && profile.name === 'Jean Dupont') {
      console.log('   ✅ Profil trouvé:', profile.name);
      console.log('   ✅ Email:', profile.email);
      console.log('   ✅ Créneaux:', profile.availableSlots?.length || 0, '\n');
      passedTests++;
    } else {
      throw new Error('Profil non trouvé');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  try {
    totalTests++;
    console.log('1.3 Service Analytics...');
    const analyticsService = AnalyticsService.getInstance();
    await analyticsService.trackScan('demo-1', 'qr');
    const analytics = await analyticsService.getAnalytics('demo-1');
    if (analytics && analytics.scans.total > 0) {
      console.log('   ✅ Analytics fonctionnel');
      console.log('   ✅ Scans:', analytics.scans.total, '\n');
      passedTests++;
    } else {
      throw new Error('Analytics non fonctionnel');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  try {
    totalTests++;
    console.log('1.4 Vérification des tables...');
    const cardCount = await prisma.cardProfile.count();
    const slotCount = await prisma.timeSlot.count();
    const analyticsCount = await prisma.analytics.count();
    if (cardCount > 0 && slotCount > 0 && analyticsCount > 0) {
      console.log('   ✅ Profils:', cardCount);
      console.log('   ✅ Créneaux:', slotCount);
      console.log('   ✅ Analytics:', analyticsCount, '\n');
      passedTests++;
    } else {
      throw new Error('Tables vides');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  // ============================================
  // 2. TESTS OPENAI
  // ============================================
  console.log('🤖 SECTION 2: API OPENAI\n');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('   ⚠️ OPENAI_API_KEY non trouvée\n');
    failedTests++;
    totalTests++;
  } else {
    try {
      totalTests++;
      console.log('2.1 Test de connexion OpenAI...');
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Réponds "OK" si tu reçois ce message.' },
          { role: 'user', content: 'Test' },
        ],
        max_tokens: 10,
      });
      if (completion.choices[0]?.message?.content) {
        console.log('   ✅ Connexion OpenAI réussie\n');
        passedTests++;
      } else {
        throw new Error('Aucune réponse');
      }
    } catch (error: any) {
      console.log('   ❌ Erreur:', error.message, '\n');
      failedTests++;
    }
  }

  // ============================================
  // 3. TESTS DES SERVICES
  // ============================================
  console.log('⚙️ SECTION 3: SERVICES\n');

  try {
    totalTests++;
    console.log('3.1 Import des services...');
    const { AIService } = await import('../lib/ai/service');
    const { Button } = await import('../components/ui/Button');
    const { Card } = await import('../components/ui/Card');
    console.log('   ✅ Tous les imports fonctionnent\n');
    passedTests++;
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  try {
    totalTests++;
    console.log('3.2 Service ProfileService...');
    const profileService = ProfileService.getInstance();
    const testProfile = await profileService.getProfile('demo-1');
    if (testProfile) {
      console.log('   ✅ ProfileService fonctionnel\n');
      passedTests++;
    } else {
      throw new Error('Service non fonctionnel');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  try {
    totalTests++;
    console.log('3.3 Service AnalyticsService...');
    const analyticsService = AnalyticsService.getInstance();
    await analyticsService.trackDirections('demo-1');
    const stats = await analyticsService.getAnalytics('demo-1');
    if (stats) {
      console.log('   ✅ AnalyticsService fonctionnel\n');
      passedTests++;
    } else {
      throw new Error('Service non fonctionnel');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  // ============================================
  // 4. TESTS DES UTILITAIRES
  // ============================================
  console.log('🛠️ SECTION 4: UTILITAIRES\n');

  try {
    totalTests++;
    console.log('4.1 Fonctions utilitaires...');
    const { formatPhoneNumber, generateGoogleMapsLink, generateWhatsAppLink, generateGoogleCalendarLink } = await import('../lib/utils');
    
    const phone = formatPhoneNumber('+33612345678');
    const maps = generateGoogleMapsLink('Paris, France');
    const whatsapp = generateWhatsAppLink('+33612345678', 'Test');
    const calendar = generateGoogleCalendarLink({
      title: 'Test',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '11:00',
    });

    if (phone && maps && whatsapp && calendar) {
      console.log('   ✅ Toutes les fonctions utilitaires fonctionnent\n');
      passedTests++;
    } else {
      throw new Error('Fonctions non fonctionnelles');
    }
  } catch (error: any) {
    console.log('   ❌ Erreur:', error.message, '\n');
    failedTests++;
  }

  // ============================================
  // 5. VERIFICATION DES FICHIERS
  // ============================================
  console.log('📁 SECTION 5: STRUCTURE DES FICHIERS\n');

  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'tailwind.config.js',
    'prisma/schema.prisma',
    'app/layout.tsx',
    'app/page.tsx',
    'app/[cardId]/page.tsx',
    'app/api/ai/chat/route.ts',
    'app/api/profiles/[cardId]/route.ts',
    'lib/ai/service.ts',
    'lib/analytics/service-db.ts',
    'lib/profiles/service-db.ts',
    'components/ui/Button.tsx',
    'components/ui/Card.tsx',
    'components/ai/ChatInterface.tsx',
  ];

  for (const file of requiredFiles) {
    totalTests++;
    try {
      const fs = await import('fs');
      const path = join(__dirname, '..', file);
      if (fs.existsSync(path)) {
        console.log(`   ✅ ${file}`);
        passedTests++;
      } else {
        console.log(`   ❌ ${file} - MANQUANT`);
        failedTests++;
      }
    } catch (error: any) {
      console.log(`   ❌ ${file} - Erreur: ${error.message}`);
      failedTests++;
    }
  }
  console.log('');

  // ============================================
  // RESUME FINAL
  // ============================================
  console.log('🧪 ========================================');
  console.log('📊 RÉSUMÉ FINAL');
  console.log('🧪 ========================================');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${failedTests}/${totalTests}`);
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`📈 Taux de réussite: ${successRate}%`);
  console.log('');

  if (failedTests === 0) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ Le projet est 100% fonctionnel !\n');
    await prisma.$disconnect();
    process.exit(0);
  } else {
    console.log('⚠️ Certains tests ont échoué.');
    console.log('Vérifiez les erreurs ci-dessus.\n');
    await prisma.$disconnect();
    process.exit(1);
  }
}

testComplete().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

