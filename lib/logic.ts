import { prisma } from './prisma';

export async function assignReviewers(paperId: string, domainTags: string[]) {
  try {
    // 1. Find all eligible reviewers who have at least one matching domain
    // Using prisma's array filtering features
    const eligibleReviewers = await prisma.reviewer.findMany({
      where: {
        OR: domainTags.map(tag => ({
            domains: { contains: tag }
        }))
      },
      select: { id: true }
    });

    if (eligibleReviewers.length < 3) {
      console.warn(`Not enough reviewers found for paper ${paperId}. Found: ${eligibleReviewers.length}`);
      // In a real system, you might assign all available, or flag for admin.
      // We will assign all available if < 3
    }

    // 2. Randomly select 3 unique reviewers
    const selectedReviewers = eligibleReviewers
      .sort(() => 0.5 - Math.random()) // Simple shuffle
      .slice(0, 3);

    if (selectedReviewers.length === 0) return;

    // 3. Create Review records
    const reviewData = selectedReviewers.map(reviewer => ({
      paperId: paperId,
      reviewerId: reviewer.id,
    }));

    await prisma.review.createMany({
      data: reviewData,
    });

    // Update Paper status to UNDER_REVIEW
    await prisma.paper.update({
      where: { id: paperId },
      data: { status: 'UNDER_REVIEW' }
    });

    console.log(`Assigned ${selectedReviewers.length} reviewers to paper ${paperId}`);

  } catch (error) {
    console.error("Error assigning reviewers:", error);
    // Don't fail the registration if assignment fails, just log it.
  }
}
