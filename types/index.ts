// Types principaux pour l'application

export interface CardProfile {
  id: string;
  name: string;
  position: string;
  company: string;
  photo?: string;
  logo?: string;
  phone: string;
  email: string;
  whatsapp?: string;
  address?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  availableSlots?: TimeSlot[];
  timezone?: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  location?: string;
  meetingLink?: string;
}

export interface ContactExchange {
  id: string;
  cardId: string;
  visitorPhone: string;
  visitorName?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
  contextMessage?: string;
}

export interface Appointment {
  id: string;
  cardId: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Analytics {
  cardId: string;
  scans: {
    nfc: number;
    qr: number;
    total: number;
  };
  contactExchanges: number;
  appointments: number;
  directions: number;
  aiInteractions: number;
  conversionRate: number;
  lastUpdated: Date;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: string;
}

export interface AIContext {
  cardId: string;
  conversation: AIMessage[];
  currentLanguage: string;
  suggestedActions?: string[];
}

