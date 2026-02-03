import { Analytics } from '@/types';
import { prisma } from '@/lib/db/prisma';

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackScan(cardId: string, type: 'nfc' | 'qr'): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(cardId);
    
    await prisma.analytics.update({
      where: { cardId },
      data: {
        scansNfc: type === 'nfc' ? analytics.scansNfc + 1 : analytics.scansNfc,
        scansQr: type === 'qr' ? analytics.scansQr + 1 : analytics.scansQr,
        scansTotal: analytics.scansTotal + 1,
        lastUpdated: new Date(),
      },
    });
    
    await this.updateConversionRate(cardId);
  }

  async trackContactExchange(cardId: string): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(cardId);
    
    await prisma.analytics.update({
      where: { cardId },
      data: {
        contactExchanges: analytics.contactExchanges + 1,
        lastUpdated: new Date(),
      },
    });
    
    await this.updateConversionRate(cardId);
  }

  async trackAppointment(cardId: string): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(cardId);
    
    await prisma.analytics.update({
      where: { cardId },
      data: {
        appointments: analytics.appointments + 1,
        lastUpdated: new Date(),
      },
    });
    
    await this.updateConversionRate(cardId);
  }

  async trackDirections(cardId: string): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(cardId);
    
    await prisma.analytics.update({
      where: { cardId },
      data: {
        directions: analytics.directions + 1,
        lastUpdated: new Date(),
      },
    });
    
    await this.updateConversionRate(cardId);
  }

  async trackAIInteraction(cardId: string): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(cardId);
    
    await prisma.analytics.update({
      where: { cardId },
      data: {
        aiInteractions: analytics.aiInteractions + 1,
        lastUpdated: new Date(),
      },
    });
    
    await this.updateConversionRate(cardId);
  }

  async getAnalytics(cardId: string): Promise<Analytics | null> {
    const dbAnalytics = await prisma.analytics.findUnique({
      where: { cardId },
    });

    if (!dbAnalytics) {
      return null;
    }

    return {
      cardId: dbAnalytics.cardId,
      scans: {
        nfc: dbAnalytics.scansNfc,
        qr: dbAnalytics.scansQr,
        total: dbAnalytics.scansTotal,
      },
      contactExchanges: dbAnalytics.contactExchanges,
      appointments: dbAnalytics.appointments,
      directions: dbAnalytics.directions,
      aiInteractions: dbAnalytics.aiInteractions,
      conversionRate: dbAnalytics.conversionRate,
      lastUpdated: dbAnalytics.lastUpdated,
    };
  }

  private async getOrCreateAnalytics(cardId: string) {
    let analytics = await prisma.analytics.findUnique({
      where: { cardId },
    });

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: {
          cardId,
          scansNfc: 0,
          scansQr: 0,
          scansTotal: 0,
          contactExchanges: 0,
          appointments: 0,
          directions: 0,
          aiInteractions: 0,
          conversionRate: 0,
        },
      });
    }

    return analytics;
  }

  private async updateConversionRate(cardId: string): Promise<void> {
    const analytics = await prisma.analytics.findUnique({
      where: { cardId },
    });

    if (!analytics || analytics.scansTotal === 0) {
      return;
    }

    const totalActions = analytics.contactExchanges + analytics.appointments + analytics.directions;
    const conversionRate = (totalActions / analytics.scansTotal) * 100;

    await prisma.analytics.update({
      where: { cardId },
      data: { conversionRate },
    });
  }
}

