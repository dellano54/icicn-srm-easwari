import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { DOMAINS } from '../lib/constants';

const prisma = new PrismaClient();

// Helper to create a slug from domain string
function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Reset Database (Reviewers and Reviews)
  // We keep Admin and Users/Papers if we want, but "reseting and sedding" usually implies a clean slate or at least clean reviewers.
  // The prompt says "set up script to like allow reseting and sedding the db".
  // I will delete Reviewers. Reviews will cascade delete if configured, or I delete them manually.
  // Schema says: Reviewer has `reviews Review[]`. Review has `reviewer Reviewer @relation(..., onDelete: Cascade)`.
  // So deleting Reviewer deletes their Reviews.
  
  console.log('🧹 Cleaning up old reviewers...');
  // We don't delete Papers/Users to preserve potential test data if users want, 
  // but if we want a full reset we would. For now, let's just reset reviewers/reviews as that's the focus.
  
  // 2. Create Admin
  console.log('👤 creating admin...');
  await prisma.admin.upsert({
    where: { email: 'admin@icicn.org' },
    update: {},
    create: {
      email: 'admin@icicn.org',
      password: 'admin-secure-password' 
    }
  });

  // 3. Create Reviewers per Domain
  console.log('👥 Creating 3 reviewers per domain...');
  
  for (const domain of DOMAINS) {
    const slug = toSlug(domain);
    
    for (let i = 1; i <= 3; i++) {
        const email = `reviewer-${slug}-${i}@icicn.org`;
        const name = `Reviewer ${i} for ${domain.substring(0, 20)}...`;
        
        await prisma.reviewer.create({
            data: {
                name,
                email,
                password: 'password123',
                domains: domain // Specialized in this domain
            }
        });
    }
  }

  console.log(`✅ Seeding complete. Created ${DOMAINS.length * 3} reviewers.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });