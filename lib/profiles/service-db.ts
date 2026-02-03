import { CardProfile, TimeSlot } from '@/types';
import { prisma } from '@/lib/db/prisma';

export class ProfileService {
  private static instance: ProfileService;

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(cardId: string): Promise<CardProfile | null> {
    const dbProfile = await prisma.cardProfile.findUnique({
      where: { id: cardId },
      include: {
        socialMedia: true,
        timeSlots: true,
      },
    });

    if (!dbProfile) {
      return null;
    }

    return {
      id: dbProfile.id,
      name: dbProfile.name,
      position: dbProfile.position,
      company: dbProfile.company,
      photo: dbProfile.photo || undefined,
      logo: dbProfile.logo || undefined,
      phone: dbProfile.phone,
      email: dbProfile.email,
      whatsapp: dbProfile.whatsapp || undefined,
      address: dbProfile.address || undefined,
      timezone: dbProfile.timezone || undefined,
      socialMedia: dbProfile.socialMedia ? {
        linkedin: dbProfile.socialMedia.linkedin || undefined,
        twitter: dbProfile.socialMedia.twitter || undefined,
        facebook: dbProfile.socialMedia.facebook || undefined,
        instagram: dbProfile.socialMedia.instagram || undefined,
      } : undefined,
      availableSlots: dbProfile.timeSlots.map(slot => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: slot.available,
        location: slot.location || undefined,
        meetingLink: slot.meetingLink || undefined,
      })),
    };
  }

  async updateProfile(cardId: string, updates: Partial<CardProfile>): Promise<CardProfile | null> {
    const existingProfile = await this.getProfile(cardId);
    if (!existingProfile) {
      return null;
    }

    const { socialMedia, availableSlots, ...profileData } = updates;

    // Mettre à jour le profil principal
    const updatedProfile = await prisma.cardProfile.update({
      where: { id: cardId },
      data: {
        name: profileData.name,
        position: profileData.position,
        company: profileData.company,
        photo: profileData.photo,
        logo: profileData.logo,
        phone: profileData.phone,
        email: profileData.email,
        whatsapp: profileData.whatsapp,
        address: profileData.address,
        timezone: profileData.timezone,
      },
      include: {
        socialMedia: true,
        timeSlots: true,
      },
    });

    // Mettre à jour les réseaux sociaux
    if (socialMedia) {
      await prisma.socialMedia.upsert({
        where: { cardId },
        update: {
          linkedin: socialMedia.linkedin,
          twitter: socialMedia.twitter,
          facebook: socialMedia.facebook,
          instagram: socialMedia.instagram,
        },
        create: {
          cardId,
          linkedin: socialMedia.linkedin,
          twitter: socialMedia.twitter,
          facebook: socialMedia.facebook,
          instagram: socialMedia.instagram,
        },
      });
    }

    return this.getProfile(cardId);
  }

  async createProfile(profile: CardProfile): Promise<CardProfile> {
    const { socialMedia, availableSlots, ...profileData } = profile;

    // Créer le profil principal
    const createdProfile = await prisma.cardProfile.create({
      data: {
        id: profileData.id,
        name: profileData.name,
        position: profileData.position,
        company: profileData.company,
        photo: profileData.photo,
        logo: profileData.logo,
        phone: profileData.phone,
        email: profileData.email,
        whatsapp: profileData.whatsapp,
        address: profileData.address,
        timezone: profileData.timezone,
        socialMedia: socialMedia ? {
          create: {
            linkedin: socialMedia.linkedin,
            twitter: socialMedia.twitter,
            facebook: socialMedia.facebook,
            instagram: socialMedia.instagram,
          },
        } : undefined,
        timeSlots: availableSlots ? {
          create: availableSlots.map(slot => ({
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            available: slot.available,
            location: slot.location,
            meetingLink: slot.meetingLink,
          })),
        } : undefined,
      },
      include: {
        socialMedia: true,
        timeSlots: true,
      },
    });

    const createdProfileData = await this.getProfile(createdProfile.id);
    if (!createdProfileData) {
      throw new Error('Erreur lors de la création du profil');
    }
    return createdProfileData;
  }

  async getProfileByContext(cardId: string, context: 'professional' | 'personal' | 'default'): Promise<CardProfile | null> {
    // Pour l'instant, on retourne le profil de base
    // En production, cela pourrait charger des variantes selon le contexte
    return this.getProfile(cardId);
  }
}

