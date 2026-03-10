
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Identifying non-Easwari registrations...');

  const members = await prisma.member.findMany({
    include: {
      user: {
        include: {
          paper: true
        }
      }
    }
  });

  const nonEaswariMembers = members.filter(m => {
    const college = m.college.toLowerCase();
    return !college.includes("easwari") && !college.includes("eec");
  });

  console.log(`Found ${nonEaswariMembers.length} members from other institutions.`);

  // Group by userId to identify unique teams
  const teamsMap = new Map();
  nonEaswariMembers.forEach(m => {
    if (m.userId) {
      if (!teamsMap.has(m.userId)) {
        teamsMap.set(m.userId, {
          user: m.user,
          members: []
        });
      }
      teamsMap.get(m.userId).members.push(m);
    }
  });

  console.log(`These members belong to ${teamsMap.size} unique teams.`);

  // Ensure a System Reviewer exists to provide the "Reviewer Accept"
  let systemReviewer = await prisma.reviewer.findFirst({
    where: { email: 'system@icicn.org' }
  });

  if (!systemReviewer) {
    systemReviewer = await prisma.reviewer.create({
      data: {
        name: 'System Auto-Shortlist',
        email: 'system@icicn.org',
        password: 'system-password-not-used',
        domains: 'ALL'
      }
    });
  }

  let teamsUpdated = 0;
  let papersShortlisted = 0;

  for (const [userId, teamData] of teamsMap.entries()) {
    const user = teamData.user;
    const paper = user.paper;

    console.log(`--------------------------------------------------`);
    console.log(`Processing Team: ${user.teamName} (ID: ${userId})`);
    console.log(`Members: ${teamData.members.map((m: any) => m.name).join(', ')}`);

    // 1. Set mode to ONLINE
    await prisma.user.update({
      where: { id: userId },
      data: { mode: 'ONLINE' }
    });
    console.log(`✅ Mode set to ONLINE`);
    teamsUpdated++;

    // 2. Add Reviewer Accept if they have a paper
    if (paper) {
      // Create/Update the review
      await prisma.review.upsert({
        where: {
          paperId_reviewerId: {
            paperId: paper.id,
            reviewerId: systemReviewer.id
          }
        },
        update: {
          decision: 'ACCEPT',
          feedback: "you are shortlisted to present ur paper",
          tier: 'TIER_1',
          isCompleted: true
        },
        create: {
          paperId: paper.id,
          reviewerId: systemReviewer.id,
          decision: 'ACCEPT',
          feedback: "you are shortlisted to present ur paper",
          tier: 'TIER_1',
          isCompleted: true
        }
      });
      console.log(`✅ Reviewer Accept added with feedback: "you are shortlisted to present ur paper"`);

      // Move paper to AWAITING_DECISION so Admin sees it in the pending table
      // but status remains NOT "ACCEPTED_UNPAID" yet.
      if (paper.status === 'SUBMITTED' || paper.status === 'UNDER_REVIEW') {
          await prisma.paper.update({
            where: { id: paper.id },
            data: { status: 'AWAITING_DECISION' }
          });
          console.log(`✅ Paper status moved to AWAITING_DECISION`);
      } else {
          console.log(`ℹ️ Paper already in status: ${paper.status}`);
      }
      
      papersShortlisted++;
    } else {
      console.log(`ℹ️ No paper submitted by this team yet.`);
    }
  }

  console.log(`--------------------------------------------------`);
  console.log(`Processing complete!`);
  console.log(`Total non-Easwari members found: ${nonEaswariMembers.length}`);
  console.log(`Unique teams processed: ${teamsUpdated}`);
  console.log(`Papers moved to Reviewer-Accept/Shortlisted: ${papersShortlisted}`);
  console.log(`Note: Admin can now see these in the Pending Papers table for final decision.`);
}

main()
  .catch(e => {
    console.error('Error running script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
