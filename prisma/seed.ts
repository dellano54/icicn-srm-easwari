import { PrismaClient } from '@prisma/client';
import { DOMAINS } from '../lib/constants';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@icicn.org' },
    update: {},
    create: {
      email: 'admin@icicn.org',
      password: 'admin-secure-password' 
    }
  });
  console.log({ admin });

  // Create Reviewers
  const reviewer1 = await prisma.reviewer.upsert({
    where: { email: 'reviewer1@icicn.org' },
    update: {},
    create: {
      name: "Dr. Alan Turing",
      email: 'reviewer1@icicn.org',
      password: 'password123',
      domains: [DOMAINS[0], DOMAINS[1], DOMAINS[2]] // AI, ML, Quantum
    }
  });

  const reviewer2 = await prisma.reviewer.upsert({
    where: { email: 'reviewer2@icicn.org' },
    update: {},
    create: {
      name: "Dr. Grace Hopper",
      email: 'reviewer2@icicn.org',
      password: 'password123',
      domains: [DOMAINS[0], DOMAINS[16], DOMAINS[17]] // AI, Robotics, 3D
    }
  });

  const reviewer3 = await prisma.reviewer.upsert({
    where: { email: 'reviewer3@icicn.org' },
    update: {},
    create: {
        name: "Dr. John von Neumann",
        email: 'reviewer3@icicn.org',
        password: 'password123',
        domains: DOMAINS // All domains
    }
  });

  console.log({ reviewer1, reviewer2, reviewer3 });
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
