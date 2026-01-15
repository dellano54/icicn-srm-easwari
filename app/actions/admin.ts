'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';
import { sendEmail } from '@/lib/email';
import { FEE_AMOUNT_INR } from '@/lib/constants';

// --- ADMIN ACTIONS ---

export async function adminDecision(paperId: string, decision: 'ACCEPT' | 'REJECT', tier?: 'TIER_1' | 'TIER_2' | 'TIER_3') {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { message: 'Unauthorized' };

    const paper = await prisma.paper.findUnique({ where: { id: paperId }, include: { user: true } });
    if (!paper) return { message: 'Paper not found' };

    if (decision === 'REJECT') {
        // Delete blobs
        if (paper.paperUrl) await del(paper.paperUrl);
        if (paper.plagiarismUrl) await del(paper.plagiarismUrl);

        await prisma.paper.update({
            where: { id: paperId },
            data: { status: 'REJECTED' }
        });

        await sendEmail(paper.user.email, "ICICN '26 - Paper Status Update", `<p>We regret to inform you that your paper has been rejected.</p>`);
    } else {
        await prisma.paper.update({
            where: { id: paperId },
            data: { 
                status: 'ACCEPTED_UNPAID',
                adminTier: tier 
            }
        });

        await sendEmail(paper.user.email, "ICICN '26 - Paper Accepted!", `<p>Congratulations! Your paper has been accepted. Please login to dashboard to proceed with payment.</p>`);
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
}

export async function verifyPayment(paperId: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { message: 'Unauthorized' };

    const paper = await prisma.paper.findUnique({ where: { id: paperId }, include: { user: true } });
    if (!paper) return { message: 'Paper not found' };

    // Delete screenshot to save storage
    if (paper.paymentScreenshotUrl) await del(paper.paymentScreenshotUrl);

    await prisma.paper.update({
        where: { id: paperId },
        data: { 
            status: 'REGISTERED',
            paymentScreenshotUrl: null // Clear db ref
        }
    });

    await sendEmail(paper.user.email, "ICICN '26 - Registration Confirmed", `<p>Your payment has been verified. See you at the conference!</p>`);

    revalidatePath('/admin/dashboard');
    return { success: true };
}
