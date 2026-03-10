import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function countPaymentsOn6th() {
  // 6th March UTC
  const startUTC = new Date('2026-03-06T00:00:00Z');
  const endUTC = new Date('2026-03-06T23:59:59.999Z');
  
  // 6th March IST (IST = UTC + 5:30)
  // 6th March 00:00 IST = 5th March 18:30 UTC
  // 7th March 00:00 IST = 6th March 18:30 UTC
  const startIST = new Date('2026-03-05T18:30:00Z');
  const endIST = new Date('2026-03-06T18:30:00Z');
  
  try {
    const countUTC = await prisma.paper.count({
      where: {
        paymentScreenshotUrl: { not: null },
        paymentUploadedAt: {
          gte: startUTC,
          lte: endUTC
        }
      }
    });

    const countIST = await prisma.paper.count({
      where: {
        paymentScreenshotUrl: { not: null },
        paymentUploadedAt: {
          gte: startIST,
          lt: endIST
        }
      }
    });
    
    console.log(`Payments on March 6th (UTC): ${countUTC}`);
    console.log(`Payments on March 6th (IST): ${countIST}`);

  } catch (error) {
    console.error('Error counting payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countPaymentsOn6th();
