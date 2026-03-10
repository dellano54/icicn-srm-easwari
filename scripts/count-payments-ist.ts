import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countPaymentsComparison() {
  // March 9th 00:00 UTC (What we used before)
  const utcDate = new Date('2026-03-09T00:00:00Z');
  
  // March 9th 00:00 IST = March 8th 18:30 UTC
  const istDate = new Date('2026-03-08T18:30:00Z');
  
  try {
    const countUTC = await prisma.paper.count({
      where: {
        paymentScreenshotUrl: { not: null },
        paymentUploadedAt: { lt: utcDate }
      }
    });

    const countIST = await prisma.paper.count({
      where: {
        paymentScreenshotUrl: { not: null },
        paymentUploadedAt: { lt: istDate }
      }
    });
    
    console.log(`Before March 9th 00:00 UTC (05:30 AM IST): ${countUTC}`);
    console.log(`Before March 9th 00:00 IST (Strictly before 9th in India): ${countIST}`);

  } catch (error) {
    console.error('Error counting payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countPaymentsComparison();
