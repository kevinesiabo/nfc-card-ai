// Script de test pour les routes API
// À exécuter après avoir lancé le serveur: npm run dev

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Tests des routes API...\n');

  try {
    // Test 1: Route GET /api/profiles/demo-1
    console.log('1️⃣ Test GET /api/profiles/demo-1...');
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/demo-1`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profil récupéré:', data.name);
      } else {
        console.log('⚠️ Serveur non démarré ou route non accessible');
      }
    } catch (error: any) {
      console.log('⚠️ Serveur non démarré:', error.message);
    }
    console.log('');

    // Test 2: Route POST /api/ai/chat
    console.log('2️⃣ Test POST /api/ai/chat...');
    try {
      const response = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Bonjour',
          cardId: 'demo-1',
          conversation: [],
          language: 'fr',
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Réponse IA reçue:', data.response?.substring(0, 50) + '...');
      } else {
        const error = await response.json();
        console.log('⚠️ Erreur:', error.error);
      }
    } catch (error: any) {
      console.log('⚠️ Serveur non démarré:', error.message);
    }
    console.log('');

    console.log('💡 Pour tester complètement les API, lancez: npm run dev');
    console.log('   Puis réexécutez ce script\n');

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
  }
}

testAPI();

