import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Supprimer les anciens créneaux
  await prisma.timeSlot.deleteMany({
    where: { cardId: 'demo-1' },
  });

  // Créer un profil de démonstration
  const profile = await prisma.cardProfile.upsert({
    where: { id: 'demo-1' },
    update: {},
    create: {
      id: 'demo-1',
      name: 'Jean Dupont',
      position: 'Directeur Commercial',
      company: 'Tech Solutions',
      phone: '+33612345678',
      email: 'jean.dupont@techsolutions.fr',
      whatsapp: '+33612345678',
      address: '123 Avenue des Champs-Élysées, 75008 Paris, France',
      socialMedia: {
        create: {
          linkedin: 'https://linkedin.com/in/jeandupont',
          twitter: 'https://twitter.com/jeandupont',
        },
      },
      timeSlots: {
        create: [
          {
            date: '2026-01-20',
            startTime: '10:00',
            endTime: '11:00',
            available: true,
            location: 'Bureau principal',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
          },
          {
            date: '2026-01-20',
            startTime: '14:00',
            endTime: '15:00',
            available: true,
            location: 'Bureau principal',
          },
          {
            date: '2026-01-21',
            startTime: '09:00',
            endTime: '10:00',
            available: true,
            location: 'Bureau principal',
            meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
          },
          {
            date: '2026-01-22',
            startTime: '11:00',
            endTime: '12:00',
            available: true,
            location: 'Bureau principal',
          },
          {
            date: '2026-01-23',
            startTime: '15:00',
            endTime: '16:00',
            available: true,
            location: 'Bureau principal',
          },
        ],
      },
      analytics: {
        create: {
          scansNfc: 0,
          scansQr: 0,
          scansTotal: 0,
          contactExchanges: 0,
          appointments: 0,
          directions: 0,
          aiInteractions: 0,
          conversionRate: 0,
        },
      },
    },
  });

  // Créer les créneaux même si le profil existe déjà
  const timeSlots = [
    {
      date: '2026-01-20',
      startTime: '10:00',
      endTime: '11:00',
      available: true,
      location: 'Bureau principal',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      date: '2026-01-20',
      startTime: '14:00',
      endTime: '15:00',
      available: true,
      location: 'Bureau principal',
    },
    {
      date: '2026-01-21',
      startTime: '09:00',
      endTime: '10:00',
      available: true,
      location: 'Bureau principal',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    },
    {
      date: '2026-01-22',
      startTime: '11:00',
      endTime: '12:00',
      available: true,
      location: 'Bureau principal',
    },
    {
      date: '2026-01-23',
      startTime: '15:00',
      endTime: '16:00',
      available: true,
      location: 'Bureau principal',
    },
  ];

  for (const slot of timeSlots) {
    await prisma.timeSlot.create({
      data: {
        ...slot,
        cardId: profile.id,
      },
    });
  }

  console.log('✅ Profil créé:', profile.name);
  console.log('✅ Créneaux créés:', timeSlots.length);
  console.log('🎉 Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
