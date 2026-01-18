'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';
import { sendEmail } from '@/lib/email';

export async function bulkAdminDecision(
    paperIds: string[], 
    decision: 'ACCEPT' | 'REJECT', 
    tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | undefined
) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { message: 'Unauthorized' };

    if (paperIds.length === 0) return { message: 'No papers selected' };

    try {
        if (decision === 'REJECT') {
            // Fetch papers to get blob URLs for deletion
            const papers = await prisma.paper.findMany({
                where: { id: { in: paperIds } },
                include: { user: true }
            });

            // Perform updates and deletions
            // Note: In a real large-scale app, we might queue these or do them in batches.
            for (const paper of papers) {
                if (paper.paperUrl) await del(paper.paperUrl);
                if (paper.plagiarismUrl) await del(paper.plagiarismUrl);
                
                // Send Email
                await sendEmail(paper.user.email, "ICCICN '26 - Paper Status Update", `<p>We regret to inform you that your paper has been rejected.</p>`);
            }

            await prisma.paper.updateMany({
                where: { id: { in: paperIds } },
                data: { status: 'REJECTED' }
            });

        } else {
            // ACCEPT
            const papers = await prisma.paper.findMany({
                where: { id: { in: paperIds } },
                include: { user: true }
            });

            await prisma.paper.updateMany({
                where: { id: { in: paperIds } },
                data: { 
                    status: 'ACCEPTED_UNPAID',
                    adminTier: tier 
                }
            });

            for (const paper of papers) {
                 await sendEmail(paper.user.email, "ICCICN '26 - Paper Accepted!", `<p>Congratulations! Your paper has been accepted. Please login to dashboard to proceed with payment.</p>`);
            }
        }

        revalidatePath('/admin/dashboard');
        return { success: true, count: paperIds.length };
    } catch (error) {
        console.error('Bulk action error:', error);
        return { message: 'Failed to process bulk action' };
    }
}

export async function bulkVerifyPayment(paperIds: string[]) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { message: 'Unauthorized' };

    if (paperIds.length === 0) return { message: 'No papers selected' };

    try {
        const papers = await prisma.paper.findMany({
            where: { id: { in: paperIds } },
            include: { user: true }
        });

        // Cleanup screenshots
        for (const paper of papers) {
            if (paper.paymentScreenshotUrl) await del(paper.paymentScreenshotUrl);
             await sendEmail(paper.user.email, "ICCICN '26 - Registration Confirmed", `<p>Your payment has been verified. See you at the conference!</p>`);
        }

        await prisma.paper.updateMany({
            where: { id: { in: paperIds } },
            data: { 
                status: 'REGISTERED',
                paymentScreenshotUrl: null 
            }
        });

        revalidatePath('/admin/dashboard');
        return { success: true, count: paperIds.length };
    } catch (error) {
        console.error('Bulk payment verify error:', error);
        return { message: 'Failed to verify payments' };
    }
}
