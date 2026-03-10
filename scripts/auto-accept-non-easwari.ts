
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../lib/email';

const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany({
    include: {
      user: {
        include: {
          paper: true
        }
      }
    }
  });

  const nonEaswariTeams = new Map();

  members.forEach(m => {
    const college = m.college.toLowerCase();
    if (!college.includes("easwari") && !college.includes("eec")) {
      if (m.user && m.user.paper) {
        nonEaswariTeams.set(m.userId, m.user);
      }
    }
  });

  console.log(`Found ${nonEaswariTeams.size} non-Easwari teams with papers.`);

  // Get or create a system reviewer for the feedback
  let systemReviewer = await prisma.reviewer.findFirst({
    where: { email: 'system@icicn.org' }
  });

  if (!systemReviewer) {
    systemReviewer = await prisma.reviewer.create({
      data: {
        name: 'System Auto-Accept',
        email: 'system@icicn.org',
        password: 'system-none-password',
        domains: 'ALL'
      }
    });
  }

  for (const [userId, user] of nonEaswariTeams) {
    const paper = user.paper;
    console.log(`Processing Team: ${user.teamName} (Paper ID: ${paper.id})`);

    // 1. Update Paper status and tier
    await prisma.paper.update({
      where: { id: paper.id },
      data: {
        status: 'ACCEPTED_UNPAID',
        adminTier: 'TIER_1'
      }
    });

    // 2. Update User mode to ONLINE
    await prisma.user.update({
      where: { id: userId },
      data: {
        mode: 'ONLINE'
      }
    });

    // 3. Add/Update Review with specific feedback
    await prisma.review.upsert({
      where: {
        paperId_reviewerId: {
          paperId: paper.id,
          reviewerId: systemReviewer.id
        }
      },
      update: {
        feedback: "you are shortlisted to present ur paper",
        decision: 'ACCEPT',
        tier: 'TIER_1',
        isCompleted: true
      },
      create: {
        paperId: paper.id,
        reviewerId: systemReviewer.id,
        feedback: "you are shortlisted to present ur paper",
        decision: 'ACCEPT',
        tier: 'TIER_1',
        isCompleted: true
      }
    });

    // 4. Send Email
    try {
      await sendEmail(
        user.email,
        "ICCICN '26 - Paper Accepted (Online Presentation)",
        `<h1>Congratulations!</h1>
         <p>Dear Author,</p>
         <p>We are pleased to inform you that your paper <strong>(ID: ${paper.id})</strong> has been <strong>ACCEPTED</strong> for presentation at ICCICN '26.</p>
         
         <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Decision:</strong> you are shortlisted to present ur paper
            <p><strong>Note:</strong> Since you are from an external institution, your presentation mode has been set to <strong>ONLINE</strong>.</p>
            <p>Assigned Tier: <strong>TIER 1</strong></p>
         </div>

         <div style="margin: 20px 0;">
            <strong>Next Steps:</strong>
            <p>To confirm your presentation slot and inclusion in the proceedings, please complete the registration payment through your dashboard.</p>
         </div>

         <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://icicn.org'}/login" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Login to Dashboard
            </a>
         </div>
         
         <p>We look forward to your virtual participation!</p>`,
        'success'
      );
      console.log(`✅ Email sent to ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${user.email}:`, err);
    }
  }

  console.log("All non-Easwari papers have been processed.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
