'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MapPin, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
// Analytics via API
import { generateGoogleCalendarLink } from '@/lib/utils';
import { TimeSlot } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AppointmentBookingProps {
  cardId: string;
  availableSlots: TimeSlot[];
  defaultLocation?: string;
  onSlotsUpdated?: () => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  cardId,
  availableSlots,
  defaultLocation,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [step, setStep] = useState<'calendar' | 'slots' | 'details' | 'confirmed'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Initialiser le calendrier sur le mois du premier créneau disponible
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (availableSlots.length > 0) {
      const firstSlotDate = new Date(availableSlots[0].date);
      return startOfMonth(firstSlotDate);
    }
    return new Date();
  });

  const availableSlotsFiltered = availableSlots.filter(slot => slot.available);

  // Grouper les créneaux par date (normaliser les dates pour éviter les problèmes de timezone)
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, TimeSlot[]> = {};
    availableSlotsFiltered.forEach(slot => {
      // Normaliser la date au format YYYY-MM-DD (enlever l'heure si présente)
      const normalizedDate = slot.date.includes('T') ? slot.date.split('T')[0] : slot.date;
      if (!grouped[normalizedDate]) {
        grouped[normalizedDate] = [];
      }
      grouped[normalizedDate].push(slot);
    });
    // Debug: afficher les dates groupées
    console.log('Dates avec créneaux:', Object.keys(grouped));
    return grouped;
  }, [availableSlotsFiltered]);

  // Vérifier si le mois actuel a des créneaux
  const hasSlotsInCurrentMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return Object.keys(slotsByDate).some(dateStr => {
      const date = new Date(dateStr);
      return date >= monthStart && date <= monthEnd;
    });
  }, [slotsByDate, currentMonth]);

  // Générer les jours du calendrier
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Fin de semaine
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (slotsByDate[dateStr] && slotsByDate[dateStr].length > 0) {
      setSelectedDate(date);
      setStep('slots');
    } else {
      toast.error('Aucun créneau disponible pour cette date');
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleBackToCalendar = () => {
    setSelectedDate(null);
    setStep('calendar');
  };

  const handleConfirm = () => {
    if (!selectedSlot || !visitorName || !visitorEmail || !visitorPhone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Tracker l'analytics via l'API
    fetch(`/api/profiles/${cardId}/analytics/appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);

    // Générer le lien Google Calendar
    const calendarLink = generateGoogleCalendarLink({
      title: `Rendez-vous avec ${visitorName}`,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      location: selectedSlot.location || defaultLocation || '',
      description: `Rendez-vous pris via carte NFC\nContact: ${visitorPhone}\nEmail: ${visitorEmail}`,
    });

    // Ouvrir Google Calendar
    window.open(calendarLink, '_blank');
    
    setStep('confirmed');
    toast.success('Rendez-vous confirmé et ajouté à votre calendrier !');
  };

  if (step === 'confirmed') {
    return (
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Rendez-vous confirmé !</h3>
          <p className="text-gray-600 mb-4">
            Votre rendez-vous a été ajouté à votre calendrier.
          </p>
          {selectedSlot?.meetingLink && (
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => window.open(selectedSlot.meetingLink, '_blank')}
                icon={<Video className="w-4 h-4" />}
              >
                Rejoindre la visioconférence
              </Button>
            </div>
          )}
          <Button onClick={() => {
            setStep('calendar');
            setSelectedSlot(null);
            setSelectedDate(null);
            setVisitorName('');
            setVisitorEmail('');
            setVisitorPhone('');
          }} variant="outline">
            Prendre un autre rendez-vous
          </Button>
        </div>
      </Card>
    );
  }

  if (step === 'details') {
    return (
      <Card>
        <div className="flex items-center mb-4">
          <Calendar className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Détails du rendez-vous</h3>
        </div>

        {selectedSlot && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 text-primary-600 mr-2" />
              <span className="font-medium">{new Date(selectedSlot.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-primary-600 mr-2" />
              <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
            </div>
            {selectedSlot.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-primary-600 mr-2" />
                <span>{selectedSlot.location}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre nom *
            </label>
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre email *
            </label>
            <input
              type="email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              placeholder="jean.dupont@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre téléphone *
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

          <div className="flex space-x-2">
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!visitorName || !visitorEmail || !visitorPhone}
            >
              Confirmer le rendez-vous
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep('slots')}
            >
              Retour
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (step === 'slots' && selectedDate) {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const slotsForDate = slotsByDate[dateStr] || [];

    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">
              Créneaux disponibles - {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleBackToCalendar}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
        </div>

        {slotsForDate.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun créneau disponible pour cette date.</p>
            <Button variant="outline" onClick={handleBackToCalendar} className="mt-4">
              Choisir une autre date
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {slotsForDate.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                    {slot.location && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {slot.location}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Sélectionner
                  </Button>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Prendre un rendez-vous</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[150px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {availableSlotsFiltered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Aucun créneau disponible pour le moment.</p>
        </div>
      ) : !hasSlotsInCurrentMonth ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Créneaux non disponibles</p>
          <p className="text-sm text-gray-500 mb-4">
            Aucun créneau disponible pour ce mois.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Mois précédent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              Mois suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="calendar-container">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              // Vérifier si cette date a des créneaux (normaliser la date)
              const normalizedDate = dayStr;
              const hasSlots = slotsByDate[normalizedDate] && slotsByDate[normalizedDate].length > 0;
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={idx}
                  onClick={() => isCurrentMonth && handleDateSelect(day)}
                  disabled={!isCurrentMonth || !hasSlots}
                  className={`
                    aspect-square p-2 rounded-lg text-sm transition-all
                    ${!isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${isCurrentMonth && !hasSlots ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed' : ''}
                    ${isCurrentMonth && hasSlots ? 'text-gray-700 hover:bg-primary-50 hover:border-primary-300 border border-transparent cursor-pointer' : ''}
                    ${isToday ? 'font-bold ring-2 ring-primary-400' : ''}
                    ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700' : ''}
                    ${hasSlots && isCurrentMonth ? 'relative' : ''}
                  `}
                >
                  {format(day, 'd')}
                  {hasSlots && isCurrentMonth && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary-600 mr-1"></div>
              <span>Créneaux disponibles</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

