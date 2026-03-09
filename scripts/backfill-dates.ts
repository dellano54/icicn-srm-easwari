import { PrismaClient } from '@prisma/client';
import { head } from '@vercel/blob';

const prisma = new PrismaClient();

async function backfillUploadDates() {
  console.log('Starting backfill of upload dates...');
  
  const papers = await prisma.paper.findMany({
    where: {
      paymentScreenshotUrl: { not: null },
      paymentUploadedAt: null
    }
  });

  console.log(`Found ${papers.length} papers to update.`);

  for (const paper of papers) {
    if (!paper.paymentScreenshotUrl) continue;
    
    try {
      console.log(`Fetching metadata for paper ID: ${paper.id}`);
      const metadata = await head(paper.paymentScreenshotUrl);
      
      await prisma.paper.update({
        where: { id: paper.id },
        data: {
          paymentUploadedAt: metadata.uploadedAt
        }
      });
      
      console.log(`✅ Updated paper ${paper.id} with upload date: ${metadata.uploadedAt}`);
    } catch (error) {
      console.error(`❌ Failed to update paper ${paper.id}:`, error);
    }
  }

  console.log('Backfill complete!');
}

backfillUploadDates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
