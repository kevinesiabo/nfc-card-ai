'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from './Card';
import { Button } from './Button';
import { Download, QrCode, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeProps {
  value: string;
  cardName?: string;
  size?: number;
  showDownload?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeProps> = ({
  value,
  cardName = 'Carte',
  size = 256,
  showDownload = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    const svg = document.getElementById('qrcode-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cardName.replace(/\s+/g, '_')}_QRCode.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('QR Code téléchargé !');
          }
        }, 'image/png');
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">QR Code - {cardName}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              icon={<X className="w-4 h-4" />}
            />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                id="qrcode-svg"
                value={value}
                size={size}
                level="H"
                includeMargin={true}
              />
            </div>
            {showDownload && (
              <Button
                onClick={handleDownload}
                icon={<Download className="w-4 h-4" />}
              >
                Télécharger le QR Code
              </Button>
            )}
            <p className="text-xs text-gray-500 text-center">
              Scannez ce QR Code avec votre appareil photo pour accéder à la carte
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
        <QRCodeSVG
          value={value}
          size={120}
          level="H"
          includeMargin={true}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        icon={<QrCode className="w-4 h-4" />}
      >
        Voir le QR Code
      </Button>
    </div>
  );
};

