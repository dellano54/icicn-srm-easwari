'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function submitReview(reviewId: string, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'reviewer') return { message: 'Unauthorized' };

    const feedback = formData.get('feedback') as string;
    const decision = formData.get('decision') as 'ACCEPT' | 'REJECT';
    const tier = formData.get('tier') as 'TIER_1' | 'TIER_2' | 'TIER_3';

    const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
            feedback,
            decision,
            tier: decision === 'ACCEPT' ? tier : null,
            isCompleted: true
        },
        include: { paper: { include: { reviews: true } } }
    });

    // Logic: If 2 reviewers have ACCEPTED or REJECTED the paper, move to AWAITING_DECISION
    // This allows Admin to see the paper and make a final decision based on the consensus.
    const acceptedReviews = review.paper.reviews.filter((r: any) => r.decision === 'ACCEPT').length;
    const rejectedReviews = review.paper.reviews.filter((r: any) => r.decision === 'REJECT').length;
    
    if ((acceptedReviews >= 2 || rejectedReviews >= 2) && review.paper.status === 'UNDER_REVIEW') {
        await prisma.paper.update({
            where: { id: review.paper.id },
            data: { status: 'AWAITING_DECISION' }
        });
    }

    revalidatePath('/reviewer/dashboard');
    return { success: true };
}

export async function markReviewViewed(reviewId: string) {
    const session = await getSession();
    if (!session || session.role !== 'reviewer') return { message: 'Unauthorized' };

    await prisma.review.update({
        where: { id: reviewId },
        data: { viewedAt: new Date() }
    });
    
    // No revalidate needed necessarily if we just want to track it silently, 
    // but revalidating updates the UI to show "Viewed" status if we want.
    revalidatePath('/reviewer/dashboard'); 
    return { success: true };
}
