import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countPaymentsBefore9th() {
  const targetDate = new Date('2026-03-09T00:00:00Z');
  
  try {
    const count = await prisma.paper.count({
      where: {
        paymentScreenshotUrl: {
          not: null
        },
        paymentUploadedAt: {
          lt: targetDate
        }
      }
    });
    
    console.log(`Number of payment proofs uploaded before March 9th: ${count}`);
    
    // Also let's see total payments for context
    const totalCount = await prisma.paper.count({
        where: {
          paymentScreenshotUrl: {
            not: null
          }
        }
      });
      console.log(`Total payment proofs uploaded: ${totalCount}`);

  } catch (error) {
    console.error('Error counting payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countPaymentsBefore9th();
