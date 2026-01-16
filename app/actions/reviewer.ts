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

    // Logic: If 2 or more reviewers have completed their reviews, move to AWAITING_DECISION
    // This allows Admin to see the paper and make a final decision based on the feedback.
    const completedReviews = review.paper.reviews.filter(r => r.isCompleted).length;
    
    if (completedReviews >= 2 && review.paper.status === 'UNDER_REVIEW') {
        await prisma.paper.update({
            where: { id: review.paper.id },
            data: { status: 'AWAITING_DECISION' }
        });
    }

    revalidatePath('/reviewer/dashboard');
    return { success: true };
}
