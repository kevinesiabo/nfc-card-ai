/**
 * Tests d'intégration pour le flux complet d'une carte
 */

import { ProfileService } from '@/lib/profiles/service-db';
import { AnalyticsService } from '@/lib/analytics/service-db';
import { generateVCard } from '@/lib/utils';

describe('Card Flow Integration Tests', () => {
  describe('Complete card interaction flow', () => {
    it('should handle complete visitor journey', async () => {
      // 1. Load profile
      const profileService = ProfileService.getInstance();
      const profile = await profileService.getProfile('demo-1');
      
      expect(profile).toBeDefined();
      expect(profile?.availableSlots).toBeDefined();

      // 2. Track scan
      const analyticsService = AnalyticsService.getInstance();
      await analyticsService.trackScan('demo-1', 'nfc');

      // 3. Generate vCard
      if (profile) {
        const vcard = generateVCard({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          position: profile.position,
          company: profile.company,
        });

        expect(vcard).toContain('BEGIN:VCARD');
        expect(vcard).toContain(profile.name);
      }

      // 4. Get analytics
      const analytics = await analyticsService.getAnalytics('demo-1');
      expect(analytics).toBeDefined();
    });

    it('should track multiple interactions', async () => {
      const analyticsService = AnalyticsService.getInstance();

      // Track multiple events
      await analyticsService.trackScan('demo-1', 'nfc');
      await analyticsService.trackContactExchange('demo-1');
      await analyticsService.trackDirections('demo-1');

      const analytics = await analyticsService.getAnalytics('demo-1');
      
      expect(analytics?.scans.total).toBeGreaterThan(0);
      expect(analytics?.contactExchanges).toBeGreaterThan(0);
      expect(analytics?.directions).toBeGreaterThan(0);
    });
  });
});

