import { AIMessage, AIContext } from '@/types';

// Service IA avec intégration OpenAI
export class AIService {
  private static instance: AIService;
  private conversations: Map<string, AIContext> = new Map();

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async processMessage(cardId: string, userMessage: string, language: string = 'fr'): Promise<string> {
    const context = this.getOrCreateContext(cardId, language);
    
    // Ajouter le message utilisateur
    context.conversation.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      language,
    });

    try {
      // Appeler l'API OpenAI via notre route API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          cardId,
          conversation: context.conversation.slice(0, -1), // Exclure le dernier message (celui qu'on vient d'ajouter)
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      const aiResponse = data.response || this.generateFallbackResponse(userMessage, language);
      
      // Ajouter la réponse de l'assistant
      context.conversation.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        language,
      });

      return aiResponse;
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback vers les réponses statiques en cas d'erreur
      const fallbackResponse = this.generateContextualResponse(userMessage, context, language);
      context.conversation.push({
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        language,
      });
      return fallbackResponse;
    }
  }

  private getOrCreateContext(cardId: string, language: string): AIContext {
    if (!this.conversations.has(cardId)) {
      this.conversations.set(cardId, {
        cardId,
        conversation: [],
        currentLanguage: language,
        suggestedActions: [],
      });
    }
    return this.conversations.get(cardId)!;
  }

  private generateFallbackResponse(message: string, language: string): string {
    return language === 'fr' 
      ? 'Je rencontre un problème technique. Pouvez-vous réessayer ?'
      : 'I\'m experiencing a technical issue. Can you try again?';
  }

  private generateContextualResponse(message: string, context: AIContext, language: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Réponses contextuelles selon la langue
    const responses: Record<string, Record<string, string>> = {
      fr: {
        'échange numéro': 'Bien sûr ! Voulez-vous échanger vos numéros maintenant ? Je peux vous aider à le faire de manière sécurisée.',
        'rendez-vous': 'Parfait ! Je peux vous aider à prendre un rendez-vous. Quels créneaux vous conviennent ?',
        'itinéraire': 'Je peux vous donner l\'itinéraire. Voulez-vous que je vous envoie le lien Google Maps ?',
        'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ? Je peux vous aider à échanger vos numéros, prendre un rendez-vous, ou obtenir un itinéraire.',
        'aide': 'Je peux vous aider à :\n• Échanger vos numéros\n• Prendre un rendez-vous\n• Obtenir un itinéraire\n• Répondre à vos questions',
      },
      en: {
        'exchange number': 'Of course! Would you like to exchange phone numbers now? I can help you do it securely.',
        'appointment': 'Perfect! I can help you schedule an appointment. What time slots work for you?',
        'directions': 'I can give you directions. Would you like me to send you the Google Maps link?',
        'hello': 'Hello! How can I help you today? I can help you exchange phone numbers, schedule an appointment, or get directions.',
        'help': 'I can help you with:\n• Exchanging phone numbers\n• Scheduling an appointment\n• Getting directions\n• Answering your questions',
      },
    };

    // Chercher une correspondance
    for (const [key, response] of Object.entries(responses[language] || responses['fr'])) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Réponse par défaut
    return language === 'fr' 
      ? 'Je comprends. Comment puis-je vous aider ? Je peux vous aider à échanger vos numéros, prendre un rendez-vous, ou obtenir un itinéraire.'
      : 'I understand. How can I help you? I can help you exchange phone numbers, schedule an appointment, or get directions.';
  }

  getSuggestedActions(cardId: string): string[] {
    const context = this.conversations.get(cardId);
    return context?.suggestedActions || [
      'Échanger les numéros',
      'Prendre un rendez-vous',
      'Obtenir un itinéraire',
    ];
  }

  getConversationHistory(cardId: string): AIMessage[] {
    const context = this.conversations.get(cardId);
    return context?.conversation || [];
  }
}

