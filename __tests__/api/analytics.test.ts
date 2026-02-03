import { GET } from '@/app/api/profiles/[cardId]/analytics/route';
import { POST } from '@/app/api/profiles/[cardId]/analytics/scan/route';
import { NextRequest } from 'next/server';
import { AnalyticsService } from '@/lib/analytics/service-db';

// Mock AnalyticsService
const mockGetAnalytics = jest.fn();
const mockTrackScan = jest.fn();

jest.mock('@/lib/analytics/service-db', () => {
  const mockGetAnalytics = jest.fn();
  const mockTrackScan = jest.fn();
  return {
    AnalyticsService: {
      getInstance: jest.fn(() => ({
        getAnalytics: mockGetAnalytics,
        trackScan: mockTrackScan,
      })),
    },
    __mockGetAnalytics: mockGetAnalytics,
    __mockTrackScan: mockTrackScan,
  };
});

// Get the mocked functions from the module
const analyticsModule = require('@/lib/analytics/service-db');
const getMockGetAnalytics = () => analyticsModule.__mockGetAnalytics;
const getMockTrackScan = () => analyticsModule.__mockTrackScan;

describe('API Routes - Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/profiles/[cardId]/analytics', () => {
    it('should return analytics data', async () => {
      const mockAnalytics = {
        scans: { total: 10, nfc: 7, qr: 3 },
        contactExchanges: 5,
        appointments: 3,
        directions: 2,
        conversionRate: 50.0,
      };

      getMockGetAnalytics().mockResolvedValue(mockAnalytics);

      const request = new NextRequest('http://localhost:3000/api/profiles/demo-1/analytics');
      const response = await GET(request, { params: { cardId: 'demo-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.scans.total).toBe(10);
      expect(data.contactExchanges).toBe(5);
    });

    it('should return 404 when analytics not found', async () => {
      getMockGetAnalytics().mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/profiles/demo-1/analytics');
      const response = await GET(request, { params: { cardId: 'demo-1' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Analytics non trouvés');
    });
  });

  describe('POST /api/profiles/[cardId]/analytics/scan', () => {
    it('should track scan successfully', async () => {
      getMockTrackScan().mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/profiles/demo-1/analytics/scan', {
        method: 'POST',
        body: JSON.stringify({ type: 'nfc' }),
      });

      const response = await POST(request, { params: { cardId: 'demo-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(getMockTrackScan()).toHaveBeenCalledWith('demo-1', 'nfc');
    });
  });
});

