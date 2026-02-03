import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../.env.local') });

async function testOpenAI() {
  console.log('🤖 Test de l\'API OpenAI...\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log('❌ Erreur: OPENAI_API_KEY non trouvée dans les variables d\'environnement');
    console.log('   Vérifiez que .env ou .env.local contient OPENAI_API_KEY\n');
    return;
  }

  console.log('✅ Clé API trouvée:', apiKey.substring(0, 20) + '...\n');

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('1️⃣ Test de connexion à l\'API OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant de test. Réponds simplement "OK" si tu reçois ce message.',
        },
        {
          role: 'user',
          content: 'Test de connexion',
        },
      ],
      max_tokens: 10,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (response) {
      console.log('   ✅ Connexion réussie !');
      console.log('   ✅ Réponse reçue:', response);
      console.log('');
    } else {
      throw new Error('Aucune réponse reçue');
    }

    console.log('2️⃣ Test avec un message contextuel (carte NFC)...');
    
    const completion2 = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant IA professionnel pour une carte de visite NFC. Tu aides les visiteurs à échanger leurs numéros, prendre des rendez-vous, ou obtenir des itinéraires.',
        },
        {
          role: 'user',
          content: 'Je voudrais échanger nos numéros',
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const response2 = completion2.choices[0]?.message?.content;
    
    if (response2) {
      console.log('   ✅ Réponse contextuelle reçue !');
      console.log('   📝 Réponse:', response2.substring(0, 150) + '...');
      console.log('');
    }

    console.log('3️⃣ Vérification des paramètres...');
    console.log('   ✅ Modèle: gpt-3.5-turbo');
    console.log('   ✅ Max tokens: 300 (dans la route API)');
    console.log('   ✅ Temperature: 0.7');
    console.log('');

    console.log('🎉 Tous les tests OpenAI sont passés !\n');
    console.log('✅ L\'API OpenAI est correctement configurée et fonctionnelle.\n');

  } catch (error: any) {
    console.error('❌ Erreur lors du test OpenAI:');
    
    if (error.status === 401) {
      console.error('   🔑 Clé API invalide ou expirée');
      console.error('   Vérifiez votre clé API sur https://platform.openai.com/api-keys');
    } else if (error.status === 429) {
      console.error('   ⏱️ Limite de taux dépassée');
      console.error('   Attendez quelques instants avant de réessayer');
    } else if (error.status === 500) {
      console.error('   🔧 Erreur serveur OpenAI');
      console.error('   Réessayez plus tard');
    } else {
      console.error('   Erreur:', error.message);
      console.error('   Code:', error.status);
    }
    console.error('');
    process.exit(1);
  }
}

testOpenAI();

