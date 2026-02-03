import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSlots() {
  const slots = await prisma.timeSlot.findMany({
    where: { cardId: 'demo-1' },
    select: { date: true, startTime: true, endTime: true, available: true },
  });
  
  console.log('Créneaux dans la DB:');
  slots.forEach(s => {
    console.log(`  ${s.date} ${s.startTime}-${s.endTime} (disponible: ${s.available})`);
  });
  
  await prisma.$disconnect();
}

checkSlots().catch(console.error);

