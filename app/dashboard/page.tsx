'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Users, Calendar, MapPin, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cardId, setCardId] = useState<string | null>(null);

  useEffect(() => {
    const storedCardId = localStorage.getItem('card_id');
    if (!storedCardId) return;

    setCardId(storedCardId);
    loadAnalytics(storedCardId);
  }, []);

  const loadAnalytics = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles/${id}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Scans totaux',
      value: analytics?.scans?.total || 0,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Échanges de contacts',
      value: analytics?.contactExchanges || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Rendez-vous',
      value: analytics?.appointments || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Itinéraires',
      value: analytics?.directions || 0,
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Interactions IA',
      value: analytics?.aiInteractions || 0,
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      label: 'Taux de conversion',
      value: `${(analytics?.conversionRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de vos statistiques</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Détails des scans */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Détails des scans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {analytics?.scans?.nfc || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Scans NFC</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {analytics?.scans?.qr || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Scans QR Code</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {analytics?.scans?.total || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
        </div>
      </Card>

      {/* Actions rapides */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`/${cardId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium mb-1">Voir ma carte</h3>
            <p className="text-sm text-gray-600">Ouvrir votre carte publique</p>
          </a>
          <a
            href={`/${cardId}?scan=qr`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium mb-1">Tester le QR Code</h3>
            <p className="text-sm text-gray-600">Voir votre QR Code en action</p>
          </a>
        </div>
      </Card>
    </div>
  );
}

