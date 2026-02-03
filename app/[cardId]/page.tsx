'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ActionButton } from '@/components/actions/ActionButton';
import { ChatInterface } from '@/components/ai/ChatInterface';
import { ContactExchange } from '@/components/actions/ContactExchange';
import { AppointmentBooking } from '@/components/actions/AppointmentBooking';
import { AddTimeSlot } from '@/components/actions/AddTimeSlot';
import { GDPRConsent } from '@/components/security/GDPRConsent';
import { QRCodeDisplay } from '@/components/ui/QRCode';
import { Bot, X } from 'lucide-react';
import { generateWhatsAppLink, generateGoogleMapsLink, formatPhoneNumber } from '@/lib/utils';
import { CardProfile } from '@/types';
import toast from 'react-hot-toast';

// Récupérer les données depuis l'API
async function getCardProfile(cardId: string): Promise<CardProfile | null> {
  try {
    // Nettoyer le cardId au cas où il contiendrait des segments supplémentaires
    const cleanCardId = cardId.split('/').pop() || cardId;
    const response = await fetch(`/api/profiles/${cleanCardId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching profile:', response.status, errorData);
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default function CardPage() {
  const params = useParams();
  // Nettoyer le cardId pour éviter les problèmes de routing
  const rawCardId = params?.cardId as string;
  const cardId = rawCardId?.split('/').pop() || rawCardId;
  const [profile, setProfile] = useState<CardProfile | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'chat' | 'exchange' | 'appointment' | 'add-slot'>('home');
  const [analytics, setAnalytics] = useState<any>(null);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (cardId) {
      const loadProfile = async () => {
        try {
          const profileData = await getCardProfile(cardId);
          if (profileData) {
            setProfile(profileData);
            
            // Récupérer l'URL du QR code depuis l'API (avec IP locale en dev)
            try {
              const qrResponse = await fetch(`/api/profiles/${profileData.id}/qr-code`);
              if (qrResponse.ok) {
                const qrData = await qrResponse.json();
                setQrCodeUrl(qrData.url);
              }
            } catch (error) {
              console.error('Error fetching QR code URL:', error);
              // Fallback sur l'URL actuelle
              setQrCodeUrl(`${typeof window !== 'undefined' ? window.location.origin : ''}/${profileData.id}?scan=qr`);
            }
            
            // Tracker le scan via l'API (détecter NFC ou QR)
            try {
              const urlParams = typeof window !== 'undefined' 
                ? new URLSearchParams(window.location.search)
                : new URLSearchParams();
              const scanType = urlParams.get('scan') || 'nfc';
              
              await fetch(`/api/profiles/${profileData.id}/analytics/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: scanType }),
              });
              // Récupérer les analytics
              const analyticsResponse = await fetch(`/api/profiles/${profileData.id}/analytics`);
              if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                setAnalytics(analyticsData);
              }
            } catch (error) {
              console.error('Error tracking analytics:', error);
            }
          } else {
            toast.error('Carte non trouvée');
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast.error('Erreur lors du chargement de la carte');
        }
      };
      loadProfile();
    }
  }, [cardId]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${profile.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${profile.email}`;
  };

  const handleWhatsApp = () => {
    window.open(generateWhatsAppLink(profile.whatsapp || profile.phone, 'Bonjour, je vous contacte via votre carte NFC.'), '_blank');
  };

  const handleDirections = () => {
    if (profile.address) {
      // Tracker l'analytics via l'API
      fetch(`/api/profiles/${profile.id}/analytics/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(console.error);
      window.open(generateGoogleMapsLink(profile.address), '_blank');
    } else {
      toast.error('Adresse non disponible');
    }
  };

  const handleAppointment = () => {
    setActiveView('appointment');
  };

  const handleSocial = () => {
    const socialLinks = [
      { name: 'LinkedIn', url: profile.socialMedia?.linkedin },
      { name: 'Twitter', url: profile.socialMedia?.twitter },
      { name: 'Facebook', url: profile.socialMedia?.facebook },
      { name: 'Instagram', url: profile.socialMedia?.instagram },
    ].filter(link => link.url);

    if (socialLinks.length > 0) {
      window.open(socialLinks[0].url, '_blank');
    } else {
      toast.error('Aucun réseau social disponible');
    }
  };

  const handleAIAction = (action: string) => {
    if (action === 'exchange') {
      setActiveView('exchange');
    } else if (action === 'appointment') {
      setActiveView('appointment');
    } else if (action === 'directions') {
      handleDirections();
    }
  };

  if (activeView === 'chat') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveView('home')}
              icon={<X className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
          <ChatInterface
            cardId={profile.id}
            language="fr"
            onSuggestedAction={handleAIAction}
          />
        </div>
        <GDPRConsent onConsent={setGdprConsent} />
      </div>
    );
  }

  if (activeView === 'exchange') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveView('home')}
              icon={<X className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
          <ContactExchange
            cardId={profile.id}
            cardPhone={formatPhoneNumber(profile.phone)}
            cardProfile={profile}
            onExchangeComplete={() => {
              toast.success('Échange réussi !');
              setTimeout(() => setActiveView('home'), 2000);
            }}
          />
        </div>
        <GDPRConsent onConsent={setGdprConsent} />
      </div>
    );
  }

  if (activeView === 'appointment') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setActiveView('home')}
              icon={<X className="w-4 h-4" />}
            >
              Retour
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('add-slot')}
            >
              Ajouter un créneau
            </Button>
          </div>
          <AppointmentBooking
            cardId={profile.id}
            availableSlots={profile.availableSlots || []}
            defaultLocation={profile.address}
            onSlotsUpdated={async () => {
              // Recharger le profil pour obtenir les nouveaux créneaux
              const updatedProfile = await getCardProfile(profile.id);
              if (updatedProfile) {
                setProfile(updatedProfile);
              }
            }}
          />
        </div>
        <GDPRConsent onConsent={setGdprConsent} />
      </div>
    );
  }

  if (activeView === 'add-slot') {
    const handleSlotAdded = async () => {
      // Recharger le profil pour obtenir les nouveaux créneaux
      const updatedProfile = await getCardProfile(profile.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setActiveView('appointment');
      }
    };

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setActiveView('appointment')}
              icon={<X className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
          <AddTimeSlot
            cardId={profile.id}
            onSlotAdded={handleSlotAdded}
            defaultLocation={profile.address}
          />
        </div>
        <GDPRConsent onConsent={setGdprConsent} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec présentation */}
        <Card className="mb-6 text-center">
          <div className="flex flex-col items-center">
            {profile.photo && (
              <div className="w-24 h-24 rounded-full bg-primary-100 mb-4 flex items-center justify-center overflow-hidden">
                <Image src={profile.photo} alt={profile.name} width={96} height={96} className="w-full h-full object-cover" />
              </div>
            )}
            {!profile.photo && (
              <div className="w-24 h-24 rounded-full bg-primary-600 text-white mb-4 flex items-center justify-center text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            <p className="text-xl text-gray-600 mb-1">{profile.position}</p>
            <p className="text-lg text-primary-600 font-medium">{profile.company}</p>
            {profile.logo && (
              <Image src={profile.logo} alt={profile.company} width={48} height={48} className="h-12 mt-4" />
            )}
          </div>
        </Card>

        {/* QR Code */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">QR Code</h2>
              <p className="text-sm text-gray-600">
                Scannez ce code pour partager facilement cette carte ou utilisez-le comme alternative au NFC
              </p>
            </div>
            <QRCodeDisplay
              value={qrCodeUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/${profile.id}?scan=qr`}
              cardName={profile.name}
            />
          </div>
        </Card>

        {/* Boutons d'action principaux */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ActionButton
              type="call"
              label="Appeler"
              onClick={handleCall}
            />
            <ActionButton
              type="email"
              label="Envoyer un email"
              onClick={handleEmail}
            />
            <ActionButton
              type="whatsapp"
              label="WhatsApp"
              onClick={handleWhatsApp}
            />
            <ActionButton
              type="directions"
              label="Itinéraire"
              onClick={handleDirections}
            />
            <ActionButton
              type="appointment"
              label="Prendre rendez-vous"
              onClick={handleAppointment}
            />
            <ActionButton
              type="social"
              label="Réseaux sociaux"
              onClick={handleSocial}
            />
          </div>
        </Card>

        {/* Assistant IA */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Bot className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold">Assistant IA</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('chat')}
            >
              Ouvrir le chat
            </Button>
          </div>
          <p className="text-gray-600 mb-4">
            Posez-moi vos questions ou demandez-moi de l&apos;aide pour échanger vos numéros, prendre un rendez-vous, ou obtenir un itinéraire.
          </p>
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Essayez :</strong> &quot;Je voudrais échanger nos numéros&quot; ou &quot;Je veux prendre un rendez-vous&quot;
            </p>
          </div>
        </Card>

        {/* Analytics (optionnel, pour le propriétaire) */}
        {analytics && (
          <Card className="bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">{analytics.scans.total}</div>
                <div className="text-sm text-gray-600">Scans</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{analytics.contactExchanges}</div>
                <div className="text-sm text-gray-600">Échanges</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{analytics.appointments}</div>
                <div className="text-sm text-gray-600">Rendez-vous</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{analytics.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Conversion</div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <GDPRConsent onConsent={setGdprConsent} />
    </div>
  );
}

