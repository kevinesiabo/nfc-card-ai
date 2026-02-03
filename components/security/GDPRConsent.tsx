'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Check } from 'lucide-react';

interface GDPRConsentProps {
  onConsent: (accepted: boolean) => void;
}

export const GDPRConsent: React.FC<GDPRConsentProps> = ({ onConsent }) => {
  const [accepted, setAccepted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      onConsent(consent === 'true');
    }
  }, [onConsent]);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem('gdpr-consent', 'true');
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
    onConsent(true);
  };

  const handleReject = () => {
    localStorage.setItem('gdpr-consent', 'false');
    setShowBanner(false);
    onConsent(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <Card className="max-w-2xl mx-auto shadow-2xl">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Consentement aux données personnelles</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ce site utilise des cookies et collecte des données personnelles pour améliorer votre expérience. 
              En continuant, vous acceptez notre politique de confidentialité conforme au RGPD.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleAccept}
                variant="primary"
                size="sm"
                icon={<Check className="w-4 h-4" />}
              >
                J&apos;accepte
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
              >
                Refuser
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

