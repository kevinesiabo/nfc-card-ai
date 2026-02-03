import { ProfileService } from '@/lib/profiles/service-db';
import { prisma } from '@/lib/db/prisma';

// Mock Prisma
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    cardProfile: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
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

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(() => {
    jest.clearAllMocks();
    profileService = ProfileService.getInstance();
  });

  describe('getProfile', () => {
    it('should return profile with time slots and social media', async () => {
      const mockProfile = {
        id: 'demo-1',
        name: 'Jean Dupont',
        email: 'jean@example.com',
        timeSlots: [
          { id: '1', date: '2026-01-20', startTime: '10:00', endTime: '11:00', available: true },
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/in/jean',
        },
      };

      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
      (prisma.timeSlot.findMany as jest.Mock).mockResolvedValue(mockProfile.timeSlots);
      (prisma.socialMedia.findUnique as jest.Mock).mockResolvedValue(mockProfile.socialMedia);

      const profile = await profileService.getProfile('demo-1');

      expect(profile).toBeDefined();
      expect(profile?.id).toBe('demo-1');
      expect(profile?.availableSlots).toHaveLength(1);
    });

    it('should return null when profile not found', async () => {
      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(null);

      const profile = await profileService.getProfile('not-found');

      expect(profile).toBeNull();
    });
  });

  describe('createProfile', () => {
    it('should create profile with all relations', async () => {
      const mockProfileData = {
        id: 'new-profile',
        name: 'New User',
        email: 'new@example.com',
        phone: '+33612345678',
        position: 'Developer',
        company: 'Tech Corp',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/new',
        },
        availableSlots: [
          { date: '2026-01-20', startTime: '10:00', endTime: '11:00', available: true },
        ],
      };

      const createdProfile = {
        id: 'new-profile',
        name: 'New User',
        email: 'new@example.com',
        phone: '+33612345678',
        position: 'Developer',
        company: 'Tech Corp',
        timeSlots: [
          { id: '1', date: '2026-01-20', startTime: '10:00', endTime: '11:00', available: true },
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/in/new',
        },
      };

      (prisma.cardProfile.create as jest.Mock).mockResolvedValue(createdProfile);
      // Mock getProfile qui est appelé après createProfile
      (prisma.cardProfile.findUnique as jest.Mock).mockResolvedValue(createdProfile);
      (prisma.timeSlot.findMany as jest.Mock).mockResolvedValue(createdProfile.timeSlots);
      (prisma.socialMedia.findUnique as jest.Mock).mockResolvedValue(createdProfile.socialMedia);

      const created = await profileService.createProfile(mockProfileData as any);

      expect(created).toBeDefined();
      expect(prisma.cardProfile.create).toHaveBeenCalled();
    });
  });
});

