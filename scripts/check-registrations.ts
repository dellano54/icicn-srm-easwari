
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany({
    include: {
      user: true,
    },
  });

  console.log(`Total members: ${members.length}`);

  const target = "easwari engineering college";
  const nonEaswari = members.filter((m) => {
    const college = m.college.toLowerCase();
    return !college.includes("easwari") && !college.includes("eec");
  });

  if (nonEaswari.length === 0) {
    console.log("All registrations are from Easwari Engineering College.");
  } else {
    console.log(`Found ${nonEaswari.length} members from other institutions:`);
    nonEaswari.forEach((m) => {
      console.log(`- Member: ${m.name}, College: ${m.college}, Team: ${m.user.teamName}, Email: ${m.email}`);
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
