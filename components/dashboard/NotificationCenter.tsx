'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, X, Users, Calendar, MapPin, MessageSquare, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'new_contact' | 'new_appointment' | 'new_scan' | 'new_direction';
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
  read: boolean;
}

interface NotificationCenterProps {
  cardId: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ cardId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!cardId) return;

    // Connexion Server-Sent Events
    const eventSource = new EventSource(`/api/profiles/${cardId}/notifications`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        console.log('Notifications connectées');
        return;
      }

      // Créer une nouvelle notification
      const notification: Notification = {
        id: `${data.type}_${Date.now()}`,
        type: data.type,
        title: getNotificationTitle(data.type),
        message: getNotificationMessage(data.type, data.data),
        timestamp: new Date(),
        data: data.data,
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Afficher une toast
      toast.success(notification.message, {
        icon: getNotificationIcon(data.type),
        duration: 5000,
      });
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // Reconnecter après 5 secondes
      setTimeout(() => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        // La reconnexion se fera automatiquement au prochain render
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [cardId]);

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'new_contact':
        return 'Nouveau contact';
      case 'new_appointment':
        return 'Nouveau rendez-vous';
      case 'new_scan':
        return 'Nouveau scan';
      case 'new_direction':
        return 'Demande d\'itinéraire';
      default:
        return 'Nouvelle notification';
    }
  };

  const getNotificationMessage = (type: string, data: any): string => {
    switch (type) {
      case 'new_contact':
        return `${data.visitorName || 'Quelqu\'un'} a partagé son numéro : ${data.visitorPhone}`;
      case 'new_appointment':
        return `${data.visitorName} a pris un rendez-vous le ${format(new Date(data.date), 'dd MMMM', { locale: fr })} à ${data.startTime}`;
      case 'new_scan':
        return 'Votre carte a été scannée';
      case 'new_direction':
        return 'Quelqu\'un a demandé un itinéraire';
      default:
        return 'Nouvelle activité sur votre carte';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_contact':
        return '👤';
      case 'new_appointment':
        return '📅';
      case 'new_scan':
        return '📱';
      case 'new_direction':
        return '📍';
      default:
        return '🔔';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notifications */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-96 max-h-[600px] overflow-hidden z-50 shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  icon={<X className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            {getNotificationIcon(notification.type)}
                            <h4 className="font-medium text-gray-900 ml-2">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(notification.timestamp, 'dd MMM yyyy à HH:mm', {
                              locale: fr,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

