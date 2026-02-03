import { CardProfile } from '@/types';

// Service de gestion des profils dynamiques
export class ProfileService {
  private static instance: ProfileService;
  private profiles: Map<string, CardProfile> = new Map();

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(cardId: string): Promise<CardProfile | null> {
    // En production, cela devrait faire un appel API
    if (this.profiles.has(cardId)) {
      return this.profiles.get(cardId)!;
    }
    
    // Fallback : chercher dans le localStorage ou faire un appel API
    try {
      const response = await fetch(`/api/profiles/${cardId}`);
      if (response.ok) {
        const profile = await response.json();
        this.profiles.set(cardId, profile);
        return profile;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    
    return null;
  }

  async updateProfile(cardId: string, updates: Partial<CardProfile>): Promise<CardProfile | null> {
    const profile = await this.getProfile(cardId);
    if (!profile) {
      return null;
    }

    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(cardId, updatedProfile);

    // En production, sauvegarder via API
    try {
      const response = await fetch(`/api/profiles/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }

    return updatedProfile;
  }

  async createProfile(profile: CardProfile): Promise<CardProfile> {
    this.profiles.set(profile.id, profile);
    
    // En production, créer via API
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }

    return profile;
  }

  // Gestion des multi-profils (ex: profil professionnel vs personnel)
  async getProfileByContext(cardId: string, context: 'professional' | 'personal' | 'default'): Promise<CardProfile | null> {
    const baseProfile = await this.getProfile(cardId);
    if (!baseProfile) {
      return null;
    }

    // En production, cela pourrait charger des variantes selon le contexte
    // Pour l'instant, on retourne le profil de base
    return baseProfile;
  }
}

