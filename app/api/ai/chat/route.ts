import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, cardId, conversation, language = 'fr' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Construire le contexte de la conversation
    const systemPrompt = language === 'fr' 
      ? `Tu es un assistant IA professionnel pour une carte de visite NFC. Tu aides les visiteurs à :
- Échanger leurs numéros de téléphone de manière sécurisée
- Prendre des rendez-vous
- Obtenir des itinéraires
- Répondre à des questions sur le propriétaire de la carte

Sois courtois, professionnel et concis. Si l'utilisateur demande à échanger des numéros, prendre un rendez-vous ou obtenir un itinéraire, guide-le clairement vers ces actions.

Informations sur la carte (cardId: ${cardId}):
- C'est une carte de visite professionnelle NFC
- Le propriétaire peut être contacté via les boutons d'action disponibles`
      : `You are a professional AI assistant for an NFC business card. You help visitors to:
- Exchange phone numbers securely
- Schedule appointments
- Get directions
- Answer questions about the card owner

Be polite, professional, and concise. If the user asks to exchange numbers, schedule an appointment, or get directions, guide them clearly to these actions.

Card information (cardId: ${cardId}):
- This is a professional NFC business card
- The owner can be contacted via available action buttons`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(conversation && Array.isArray(conversation) ? conversation.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })) : []),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.';

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la communication avec l\'IA',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

