import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import JSZip from 'jszip';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const papers = await prisma.paper.findMany({
            select: {
                userId: true, // Team ID
                cameraReadyPaperUrl: true,
                plagiarismReportUrl: true
            }
        });

        const zip = new JSZip();
        const papersFolder = zip.folder("papers");
        const plagiarismFolder = zip.folder("plagiarism");

        const addToZip = async (url: string, folder: JSZip | null, filename: string) => {
            if (!url || !folder) return;
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const arrayBuffer = await res.arrayBuffer();
                    folder.file(filename, arrayBuffer);
                } else {
                    console.error(`Failed to fetch ${url}: ${res.statusText}`);
                }
            } catch (e) {
                console.error(`Failed to fetch ${url}`, e);
            }
        };

        // Fetch all files concurrently
        await Promise.all(papers.flatMap(paper => {
            const tasks = [];
            if (paper.cameraReadyPaperUrl) {
                tasks.push(addToZip(paper.cameraReadyPaperUrl, papersFolder, `${paper.userId}.pdf`));
            }
            if (paper.plagiarismReportUrl) {
                tasks.push(addToZip(paper.plagiarismReportUrl, plagiarismFolder, `${paper.userId}.pdf`));
            }
            return tasks;
        }));

        const content = await zip.generateAsync({ type: "nodebuffer" });

        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="iccicn_papers_${new Date().toISOString().split('T')[0]}.zip"`
            }
        });

    } catch (error) {
        console.error('ZIP generation error:', error);
        return new NextResponse('Failed to generate ZIP', { status: 500 });
    }
}
