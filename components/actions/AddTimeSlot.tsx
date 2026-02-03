'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MapPin, Video, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AddTimeSlotProps {
  cardId: string;
  onSlotAdded?: () => void;
  defaultLocation?: string;
}

export const AddTimeSlot: React.FC<AddTimeSlotProps> = ({
  cardId,
  onSlotAdded,
  defaultLocation,
}) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState(defaultLocation || '');
  const [meetingLink, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error('Veuillez remplir la date, l\'heure de début et l\'heure de fin');
      return;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (startTime >= endTime) {
      toast.error('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/profiles/${cardId}/time-slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
          location: location || null,
          meetingLink: meetingLink || null,
        }),
      });

      if (response.ok) {
        toast.success('Créneau ajouté avec succès !');
        // Réinitialiser le formulaire
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocation(defaultLocation || '');
        setMeetingLink('');
        onSlotAdded?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'ajout du créneau');
      }
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error('Erreur lors de l\'ajout du créneau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center mb-4">
        <Plus className="w-6 h-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold">Ajouter un créneau disponible</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure début *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure fin *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Lieu (optionnel)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Bureau principal, En ligne, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Video className="w-4 h-4 inline mr-1" />
            Lien de visioconférence (optionnel)
          </label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://meet.google.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={loading || !date || !startTime || !endTime}
            className="flex-1"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le créneau'}
          </Button>
        </div>
      </form>
    </Card>
  );
};


