import { NextRequest, NextResponse } from 'next/server';
import os from 'os';

function getLocalIP(): string | null {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (iface) {
      for (const addr of iface) {
        // Ignore les adresses non-IPv4 et internes
        if (addr.family === 'IPv4' && !addr.internal) {
          return addr.address;
        }
      }
    }
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    // PRIORITÉ 1: URL publique configurée (pour la production)
    // Exemple: https://votre-domaine.com ou https://votre-app.vercel.app
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // PRIORITÉ 2: En développement uniquement, utiliser l'IP locale
    // Cela permet de tester le QR code depuis un téléphone sur le même Wi-Fi
    if (!baseUrl && process.env.NODE_ENV === 'development') {
      const localIP = getLocalIP();
      if (localIP) {
        const port = process.env.PORT || '3000';
        baseUrl = `http://${localIP}:${port}`;
        console.log(`[DEV] QR Code utilisant l'IP locale: ${baseUrl}`);
      } else {
        // Fallback sur l'origin de la requête (localhost)
        baseUrl = request.nextUrl.origin;
        console.log(`[DEV] QR Code utilisant localhost: ${baseUrl}`);
      }
    } 
    // PRIORITÉ 3: En production sans NEXT_PUBLIC_BASE_URL, utiliser l'origin
    // (peut fonctionner si déployé sur un service avec domaine)
    else if (!baseUrl) {
      baseUrl = request.nextUrl.origin;
      console.warn(`[PROD] NEXT_PUBLIC_BASE_URL non défini, utilisation de: ${baseUrl}`);
    }
    
    const qrCodeUrl = `${baseUrl}/${params.cardId}?scan=qr`;
    
    return NextResponse.json({
      url: qrCodeUrl,
      cardId: params.cardId,
      environment: process.env.NODE_ENV,
      isPublicUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
    });
  } catch (error: any) {
    console.error('Error generating QR code URL:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du QR Code' },
      { status: 500 }
    );
  }
}

