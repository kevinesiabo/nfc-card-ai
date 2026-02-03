'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContactExchange {
  id: string;
  visitorName: string | null;
  visitorPhone: string;
  timestamp: string;
  status: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardId, setCardId] = useState<string | null>(null);

  useEffect(() => {
    const storedCardId = localStorage.getItem('card_id');
    if (!storedCardId) return;

    setCardId(storedCardId);
    loadContacts(storedCardId);
  }, []);

  const loadContacts = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles/${id}/contact-exchange`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="w-8 h-8 mr-3" />
          Contacts échangés
        </h1>
        <p className="text-gray-600 mt-2">
          Historique de tous les échanges de contacts ({contacts.length} contact{contacts.length > 1 ? 's' : ''})
        </p>
      </div>

      {contacts.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun contact échangé
          </h3>
          <p className="text-gray-600">
            Les contacts partagés par les visiteurs apparaîtront ici.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {contact.visitorName || 'Visiteur anonyme'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(contact.timestamp), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="ml-13 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${contact.visitorPhone}`} className="hover:text-primary-600">
                        {contact.visitorPhone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : contact.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.status === 'accepted' ? 'Accepté' : 
                         contact.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

