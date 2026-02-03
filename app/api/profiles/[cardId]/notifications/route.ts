import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Server-Sent Events pour les notifications en temps réel
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  // Créer un ReadableStream pour SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Fonction pour envoyer un événement
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Envoyer un message de connexion
      sendEvent({ type: 'connected', message: 'Connexion établie' });

      // Vérifier périodiquement les nouvelles interactions
      const checkInterval = setInterval(async () => {
        try {
          // Vérifier les nouveaux scans
          const recentScans = await prisma.analytics.findUnique({
            where: { cardId: params.cardId },
            select: {
              scansTotal: true,
              scansNfc: true,
              scansQr: true,
              lastUpdated: true,
            },
          });

          // Vérifier les nouveaux contacts échangés
          const recentContacts = await prisma.contactExchange.findFirst({
            where: {
              cardId: params.cardId,
              status: 'pending',
            },
            orderBy: {
              timestamp: 'desc',
            },
          });

          // Vérifier les nouveaux rendez-vous
          const recentAppointments = await prisma.appointment.findFirst({
            where: {
              cardId: params.cardId,
              status: 'pending',
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          // Envoyer les notifications si nécessaire
          if (recentContacts) {
            sendEvent({
              type: 'new_contact',
              data: {
                id: recentContacts.id,
                visitorName: recentContacts.visitorName,
                visitorPhone: recentContacts.visitorPhone,
                timestamp: recentContacts.timestamp,
              },
            });
          }

          if (recentAppointments) {
            sendEvent({
              type: 'new_appointment',
              data: {
                id: recentAppointments.id,
                visitorName: recentAppointments.visitorName,
                date: recentAppointments.date,
                startTime: recentAppointments.startTime,
                timestamp: recentAppointments.createdAt,
              },
            });
          }
        } catch (error) {
          console.error('Error checking notifications:', error);
        }
      }, 5000); // Vérifier toutes les 5 secondes

      // Nettoyer l'interval quand le client se déconnecte
      request.signal.addEventListener('abort', () => {
        clearInterval(checkInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

