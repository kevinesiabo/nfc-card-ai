import {
  formatPhoneNumber,
  generateGoogleCalendarLink,
  generateGoogleMapsLink,
  generateWhatsAppLink,
  generateVCard,
} from '@/lib/utils';

describe('Utils Functions', () => {
  describe('formatPhoneNumber', () => {
    it('should format French phone number correctly', () => {
      expect(formatPhoneNumber('+33612345678')).toBe('+33 6 12 34 56 78');
      expect(formatPhoneNumber('0612345678')).toBe('+33 6 12 34 56 78');
    });

    it('should return original if not French number', () => {
      expect(formatPhoneNumber('+1234567890')).toBe('+1234567890');
    });
  });

  describe('generateGoogleCalendarLink', () => {
    it('should generate correct Google Calendar link', () => {
      const appointment = {
        title: 'Test Meeting',
        date: '2026-01-20',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Paris',
        description: 'Test description',
      };

      const link = generateGoogleCalendarLink(appointment);
      expect(link).toContain('calendar.google.com');
      expect(link).toContain('TEMPLATE');
      // URLSearchParams encode les espaces en +
      expect(link).toContain('Test+Meeting');
    });
  });

  describe('generateGoogleMapsLink', () => {
    it('should generate correct Google Maps link', () => {
      const address = '123 Avenue des Champs-Élysées, Paris';
      const link = generateGoogleMapsLink(address);
      expect(link).toContain('google.com/maps');
      expect(link).toContain(encodeURIComponent(address));
    });
  });

  describe('generateWhatsAppLink', () => {
    it('should generate correct WhatsApp link', () => {
      const phone = '+33612345678';
      const link = generateWhatsAppLink(phone);
      expect(link).toContain('wa.me');
      expect(link).toContain('612345678');
    });

    it('should include message if provided', () => {
      const phone = '+33612345678';
      const message = 'Hello';
      const link = generateWhatsAppLink(phone, message);
      expect(link).toContain('text=');
      expect(link).toContain(encodeURIComponent(message));
    });
  });

  describe('generateVCard', () => {
    it('should generate valid vCard format', () => {
      const profile = {
        name: 'Jean Dupont',
        phone: '+33612345678',
        email: 'jean@example.com',
        position: 'Director',
        company: 'Tech Solutions',
        address: '123 Paris',
      };

      const vcard = generateVCard(profile);
      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('END:VCARD');
      expect(vcard).toContain('FN:Jean Dupont');
      // Le format vCard utilise TEL;TYPE=CELL,VOICE: pour les numéros
      expect(vcard).toContain('TEL');
      expect(vcard).toContain('EMAIL');
    });

    it('should include optional fields when provided', () => {
      const profile = {
        name: 'Jean Dupont',
        phone: '+33612345678',
        email: 'jean@example.com',
        linkedin: 'https://linkedin.com/in/jean',
        twitter: 'https://twitter.com/jean',
      };

      const vcard = generateVCard(profile);
      expect(vcard).toContain('LinkedIn');
      expect(vcard).toContain('Twitter');
    });
  });
});

