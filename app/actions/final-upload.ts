'use server';

import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function uploadFinalFiles(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'user') {
        return { message: 'Unauthorized' };
    }

    const paperId = formData.get('paperId') as string;
    const cameraReadyPaper = formData.get('cameraReadyPaper') as File;
    const plagiarismReport = formData.get('plagiarismReport') as File;
    const mode = formData.get('mode') as 'ONLINE' | 'OFFLINE';

    if (!paperId || !cameraReadyPaper || !plagiarismReport || !mode) {
        return { message: 'Missing required fields.' };
    }

    if (cameraReadyPaper.type !== 'application/pdf' || plagiarismReport.type !== 'application/pdf') {
        return { message: 'Both files must be PDFs.' };
    }

    if (mode !== 'ONLINE' && mode !== 'OFFLINE') {
        return { message: 'Invalid participation mode.' };
    }

    try {
        const [paperBlob, plagiarismBlob] = await Promise.all([
            put(`papers/${session.userId}_final.pdf`, cameraReadyPaper, { access: 'public', allowOverwrite: true }),
            put(`plagiarism/${session.userId}_final.pdf`, plagiarismReport, { access: 'public', allowOverwrite: true })
        ]);

        await prisma.$transaction([
            prisma.paper.update({
                where: { id: paperId },
                data: {
                    cameraReadyPaperUrl: paperBlob.url,
                    plagiarismReportUrl: plagiarismBlob.url,
                    isFinalSubmitted: true,
                }
            }),
            prisma.user.update({
                where: { id: session.userId },
                data: {
                    mode: mode,
                }
            })
        ]);

        revalidatePath('/dashboard');
        return { success: true };

    } catch (error) {
        console.error('Final upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `File upload failed: ${errorMessage}` };
    }
}
