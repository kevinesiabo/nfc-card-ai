'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Phone, Check, X, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateVCard, downloadVCard } from '@/lib/utils';
import { CardProfile } from '@/types';

interface ContactExchangeProps {
  cardId: string;
  cardPhone: string;
  cardProfile?: CardProfile;
  onExchangeComplete?: () => void;
}

export const ContactExchange: React.FC<ContactExchangeProps> = ({
  cardId,
  cardPhone,
  cardProfile,
  onExchangeComplete,
}) => {
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirmed'>('idle');
  const [cardDownloaded, setCardDownloaded] = useState(false);

  const handleDownloadCardContact = useCallback(() => {
    if (!cardProfile) return;
    
    const vcard = generateVCard({
      name: cardProfile.name,
      phone: cardProfile.phone,
      email: cardProfile.email,
      position: cardProfile.position,
      company: cardProfile.company,
      address: cardProfile.address,
      whatsapp: cardProfile.whatsapp,
      linkedin: cardProfile.socialMedia?.linkedin,
      twitter: cardProfile.socialMedia?.twitter,
    });
    
    downloadVCard(vcard, `${cardProfile.name.replace(/\s+/g, '_')}.vcf`);
    setCardDownloaded(true);
    toast.success('Contact ajouté à votre carnet !');
  }, [cardProfile]);

  // Télécharger automatiquement le vCard du propriétaire au chargement
  useEffect(() => {
    if (cardProfile && !cardDownloaded) {
      // Petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        handleDownloadCardContact();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cardProfile, cardDownloaded, handleDownloadCardContact]);

  const handleExchange = () => {
    if (!visitorPhone.trim()) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setStatus('pending');
    
    // Tracker l'analytics via l'API (en arrière-plan, non-bloquant)
    fetch(`/api/profiles/${cardId}/analytics/contact-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);
    
    // Simuler la validation bilatérale
    setTimeout(() => {
      setStatus('confirmed');
      toast.success('Échange de numéros réussi !');
      
      // Envoyer le numéro du visiteur au propriétaire via l'API
      fetch(`/api/profiles/${cardId}/contact-exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: visitorName || 'Visiteur',
          visitorPhone,
        }),
      }).catch(console.error);
      
      // Générer et télécharger le vCard du visiteur (pour le propriétaire)
      const visitorVCard = generateVCard({
        name: visitorName || 'Contact',
        phone: visitorPhone,
        email: '',
      });
      
      downloadVCard(visitorVCard, `${visitorName || 'Contact'}.vcf`);
      
      onExchangeComplete?.();
    }, 1500);
  };

  if (status === 'confirmed') {
    return (
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Échange réussi !</h3>
          <p className="text-gray-600 mb-4">
            Les numéros ont été échangés et ajoutés aux carnets de contacts.
          </p>
          <Button onClick={() => setStatus('idle')} variant="outline">
            Nouvel échange
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center mb-4">
        <Phone className="w-6 h-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold">Échange de numéros</h3>
      </div>

      {/* Section : Contact du propriétaire ajouté */}
      {cardDownloaded && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-sm font-medium text-green-800">
              Contact ajouté à votre carnet !
            </p>
          </div>
          <p className="text-xs text-green-700 mb-2">
            Le contact de {cardProfile?.name || 'cette personne'} a été automatiquement ajouté à vos contacts.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCardContact}
            icon={<Download className="w-4 h-4" />}
          >
            Télécharger à nouveau
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            📱 Partagez votre numéro
          </p>
          <p className="text-xs text-gray-600">
            Remplissez vos informations pour que {cardProfile?.name || 'le propriétaire'} puisse vous contacter facilement.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre nom (optionnel)
          </label>
          <input
            type="text"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            placeholder="Jean Dupont"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre numéro de téléphone *
          </label>
          <input
            type="tel"
            value={visitorPhone}
            onChange={(e) => setVisitorPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Numéro de la carte :</strong>
          </p>
          <p className="text-primary-600 font-medium">{cardPhone}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleExchange}
            disabled={status === 'pending' || !visitorPhone.trim()}
            className="flex-1"
            icon={status === 'pending' ? undefined : <Share2 className="w-4 h-4" />}
          >
            {status === 'pending' ? 'Envoi en cours...' : 'Partager mon numéro'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setVisitorPhone('');
              setVisitorName('');
            }}
            icon={<X className="w-4 h-4" />}
          >
            Annuler
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          En cliquant sur "Partager mon numéro", vous acceptez que votre numéro soit partagé avec {cardProfile?.name || 'le propriétaire'}.
        </p>
      </div>
    </Card>
  );
};

