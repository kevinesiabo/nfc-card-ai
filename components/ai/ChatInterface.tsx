'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User } from 'lucide-react';
import { AIService } from '@/lib/ai/service';
import { AIMessage } from '@/types';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  cardId: string;
  language?: string;
  onSuggestedAction?: (action: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  cardId,
  language = 'fr',
  onSuggestedAction,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  useEffect(() => {
    // Message de bienvenue
    const welcomeMessage: AIMessage = {
      role: 'assistant',
      content: language === 'fr' 
        ? 'Bonjour ! Je suis votre assistant IA. Je peux vous aider à échanger vos numéros, prendre un rendez-vous, ou obtenir un itinéraire. Comment puis-je vous aider ?'
        : 'Hello! I am your AI assistant. I can help you exchange phone numbers, schedule an appointment, or get directions. How can I help you?',
      timestamp: new Date(),
      language,
    };
    setMessages([welcomeMessage]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.processMessage(cardId, input, language);
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language,
      };
      setMessages((prev) => [...prev, aiMessage]);
      
      // Détecter les actions suggérées
      if (response.includes('échange') || response.includes('exchange')) {
        onSuggestedAction?.('exchange');
      } else if (response.includes('rendez-vous') || response.includes('appointment')) {
        onSuggestedAction?.('appointment');
      } else if (response.includes('itinéraire') || response.includes('directions')) {
        onSuggestedAction?.('directions');
      }
    } catch (error) {
      toast.error('Erreur lors de la communication avec l\'IA');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
        <Bot className="w-6 h-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold">Assistant IA</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'fr' ? 'Tapez votre message...' : 'Type your message...'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          icon={<Send className="w-4 h-4" />}
        >
          {language === 'fr' ? 'Envoyer' : 'Send'}
        </Button>
      </div>
    </Card>
  );
};

