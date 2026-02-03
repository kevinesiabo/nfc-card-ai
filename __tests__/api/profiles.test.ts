import { GET, PUT } from '@/app/api/profiles/[cardId]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    cardProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    timeSlot: {
      findMany: jest.fn(),
    },
    socialMedia: {
      findUnique: jest.fn(),
    },
  },
}));

describe('API Routes - Profiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/profiles/[cardId]', () => {
    it('should return profile when found', async () => {
      const mockProfile = {
        id: 'demo-1',
        name: 'Jean Dupont',
        email: 'jean@example.com',
        timeSlots: [],
        socialMedia: null,
      };

      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.timeSlot.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.socialMedia.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/profiles/demo-1');
      const response = await GET(request, { params: { cardId: 'demo-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('demo-1');
      expect(data.name).toBe('Jean Dupont');
    });

    it('should return 404 when profile not found', async () => {
      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/profiles/not-found');
      const response = await GET(request, { params: { cardId: 'not-found' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Carte non trouvée');
    });
  });

  describe('PUT /api/profiles/[cardId]', () => {
    it('should update profile successfully', async () => {
      const mockProfile = {
        id: 'demo-1',
        name: 'Jean Dupont Updated',
        email: 'jean@example.com',
        timeSlots: [],
        socialMedia: null,
      };

      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.cardProfile.update as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.timeSlot.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.socialMedia.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/profiles/demo-1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Jean Dupont Updated' }),
      });

      const response = await PUT(request, { params: { cardId: 'demo-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.cardProfile.update).toHaveBeenCalled();
    });
  });
});

