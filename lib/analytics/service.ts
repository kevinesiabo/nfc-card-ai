import { Analytics } from '@/types';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private analytics: Map<string, Analytics> = new Map();

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackScan(cardId: string, type: 'nfc' | 'qr'): void {
    const analytics = this.getOrCreateAnalytics(cardId);
    if (type === 'nfc') {
      analytics.scans.nfc++;
    } else {
      analytics.scans.qr++;
    }
    analytics.scans.total++;
    analytics.lastUpdated = new Date();
    this.updateConversionRate(analytics);
  }

  trackContactExchange(cardId: string): void {
    const analytics = this.getOrCreateAnalytics(cardId);
    analytics.contactExchanges++;
    analytics.lastUpdated = new Date();
    this.updateConversionRate(analytics);
  }

  trackAppointment(cardId: string): void {
    const analytics = this.getOrCreateAnalytics(cardId);
    analytics.appointments++;
    analytics.lastUpdated = new Date();
    this.updateConversionRate(analytics);
  }

  trackDirections(cardId: string): void {
    const analytics = this.getOrCreateAnalytics(cardId);
    analytics.directions++;
    analytics.lastUpdated = new Date();
    this.updateConversionRate(analytics);
  }

  trackAIInteraction(cardId: string): void {
    const analytics = this.getOrCreateAnalytics(cardId);
    analytics.aiInteractions++;
    analytics.lastUpdated = new Date();
    this.updateConversionRate(analytics);
  }

  getAnalytics(cardId: string): Analytics | null {
    return this.analytics.get(cardId) || null;
  }

  private getOrCreateAnalytics(cardId: string): Analytics {
    if (!this.analytics.has(cardId)) {
      this.analytics.set(cardId, {
        cardId,
        scans: { nfc: 0, qr: 0, total: 0 },
        contactExchanges: 0,
        appointments: 0,
        directions: 0,
        aiInteractions: 0,
        conversionRate: 0,
        lastUpdated: new Date(),
      });
    }
    return this.analytics.get(cardId)!;
  }

  private updateConversionRate(analytics: Analytics): void {
    if (analytics.scans.total > 0) {
      const totalActions = analytics.contactExchanges + analytics.appointments + analytics.directions;
      analytics.conversionRate = (totalActions / analytics.scans.total) * 100;
    }
  }
}

