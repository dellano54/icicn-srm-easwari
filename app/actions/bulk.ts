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
            const papers = await prisma.paper.findMany({
                where: { id: { in: paperIds } },
                include: { user: true }
            });

            // 1. Delete files (Blocking to ensure cleanup)
            await Promise.all(papers.flatMap((paper: any) => [
                paper.cameraReadyPaperUrl ? del(paper.cameraReadyPaperUrl) : Promise.resolve(),
                paper.plagiarismReportUrl ? del(paper.plagiarismReportUrl) : Promise.resolve(),
            ]));

            // 2. Update Status (Blocking)
            await prisma.paper.updateMany({
                where: { id: { in: paperIds } },
                data: { status: 'REJECTED' }
            });

            // 3. Send Emails (Fire-and-forget)
            papers.forEach((paper: any) => {
                sendEmail(
                    paper.user.email, 
                    "ICCICN '26 - Paper Status Update", 
                    `<h1>Submission Update</h1>
                     <p>Dear Author,</p>
                     <p>Thank you for submitting your research to ICCICN '26. After a thorough peer-review process, we regret to inform you that your paper <strong>(ID: ${paper.id})</strong> has not been accepted for presentation at this year's conference.</p>
                     <p>Our reviewers had to make difficult choices given the high volume of submissions. We encourage you to incorporate the feedback and consider submitting your work to future editions of the conference.</p>
                     <p>We wish you the very best with your research endeavors.</p>`,
                    'danger'
                ).catch(err => console.error(`Failed to send reject email to ${paper.id}:`, err));
            });

        } else {
            const papers = await prisma.paper.findMany({
                where: { id: { in: paperIds } },
                include: { user: true, reviews: true }
            });

            await Promise.all(papers.map(async (paper: any) => {
                let assignedTier = tier;

                // Auto-calculate Tier if not explicitly provided
                if (!assignedTier) {
                    const validTiers = paper.reviews
                        .filter((r: any) => r.decision === 'ACCEPT' && r.tier)
                        .map((r: any) => parseInt(r.tier!.replace('TIER_', '')));
                    
                    if (validTiers.length > 0) {
                        const sum = validTiers.reduce((a: number, b: number) => a + b, 0);
                        const avg = sum / validTiers.length;
                        // Conservative Rounding: 1.5 -> 2 (TIER_2)
                        const rounded = Math.round(avg);
                        
                        if (rounded <= 1) assignedTier = 'TIER_1';
                        else if (rounded === 2) assignedTier = 'TIER_2';
                        else assignedTier = 'TIER_3';
                    } else {
                        assignedTier = 'TIER_1'; // Default fallback
                    }
                }

                await prisma.paper.update({
                    where: { id: paper.id },
                    data: { 
                        status: 'ACCEPTED_UNPAID',
                        adminTier: assignedTier 
                    }
                });

                // Fire-and-forget email
                sendEmail(
                    paper.user.email, 
                    "ICCICN '26 - Paper Accepted!", 
                    `<h1>Congratulations!</h1>
                     <p>Dear Author,</p>
                     <p>We are pleased to inform you that your paper <strong>(ID: ${paper.id})</strong> has been <strong>ACCEPTED</strong> for presentation at ICCICN '26.</p>
                     
                     <div class="highlight-box">
                        <strong>Next Steps:</strong>
                        <p>To confirm your presentation slot and inclusion in the proceedings, please complete the registration payment through your dashboard.</p>
                        ${assignedTier ? `<p>Assigned Tier: <strong>${assignedTier.replace('_', ' ')}</strong></p>` : ''}
                     </div>

                     <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="btn">Login to Dashboard</a>
                     </div>
                     
                     <p>We look forward to your participation in Chennai!</p>`,
                    'success'
                ).catch(err => console.error(`Failed to send accept email to ${paper.id}:`, err));
            }));
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
        await prisma.paper.updateMany({
            where: { id: { in: paperIds } },
            data: { 
                status: 'REGISTERED'
            }
        });

        revalidatePath('/admin/dashboard');
        return { success: true, count: paperIds.length };
    } catch (error) {
        console.error('Bulk payment verify error:', error);
        return { message: 'Failed to verify payments' };
    }
}
