'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Bell, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const handleSaveNotifications = () => {
    // Sauvegarder les préférences de notifications
    localStorage.setItem('notification_preferences', JSON.stringify(notifications));
    toast.success('Préférences sauvegardées !');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      toast.error('Fonctionnalité à venir');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Paramètres
        </h1>
        <p className="text-gray-600 mt-2">Gérez vos préférences et paramètres</p>
      </div>

      {/* Notifications */}
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-600">Recevoir des emails pour les nouveaux contacts et rendez-vous</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-gray-600">Recevoir des notifications push en temps réel</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Notifications SMS</p>
              <p className="text-sm text-gray-600">Recevoir des SMS pour les rendez-vous importants</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
          <div className="pt-4 border-t border-gray-200">
            <Button onClick={handleSaveNotifications}>
              Enregistrer les préférences
            </Button>
          </div>
        </div>
      </Card>

      {/* Sécurité */}
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold">Sécurité</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Changer le mot de passe</p>
            <p className="text-sm text-gray-600 mb-4">
              Mettez à jour votre mot de passe pour sécuriser votre compte
            </p>
            <Button variant="outline">
              Modifier le mot de passe
            </Button>
          </div>
        </div>
      </Card>

      {/* Zone de danger */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center mb-4">
          <Trash2 className="w-5 h-5 mr-2 text-red-600" />
          <h2 className="text-xl font-semibold text-red-900">Zone de danger</h2>
        </div>
        <div>
          <p className="text-gray-700 mb-4">
            La suppression de votre compte est définitive. Toutes vos données seront perdues.
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="border-red-300 text-red-600 hover:bg-red-100"
          >
            Supprimer mon compte
          </Button>
        </div>
      </Card>
    </div>
  );
}

