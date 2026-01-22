import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  const { type, id } = await params;

  // Fetch paper
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: { reviews: true }
  });

  if (!paper) return new NextResponse('File not found', { status: 404 });

  // Authorization Check
  let isAuthorized = false;

  if (session.role === 'admin') {
    isAuthorized = true;
  } else if (session.role === 'user') {
    if (paper.userId === session.userId) isAuthorized = true;
  } else if (session.role === 'reviewer') {
    // Check if assigned
    const assignment = paper.reviews.some(r => r.reviewerId === session.userId);
    if (assignment && (type === 'paper' || type === 'plagiarism')) {
        isAuthorized = true;
    }
  }

  if (!isAuthorized) return new NextResponse('Forbidden', { status: 403 });

  // Determine URL
  let fileUrl = '';
  if (type === 'paper') fileUrl = paper.cameraReadyPaperUrl || '';
  else if (type === 'plagiarism') fileUrl = paper.plagiarismReportUrl || '';
  else if (type === 'payment') fileUrl = paper.paymentScreenshotUrl || '';

  if (!fileUrl) return new NextResponse('File URL missing', { status: 404 });

  // Fetch and Stream
  try {
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error('Fetch failed');
    
    const blob = await fileRes.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    // Use inline to display in browser, or attachment to download
    // For images/PDFs, inline is usually better for 'View' links
    headers.set('Content-Disposition', `inline; filename="${type}-${id}.${blob.type.split('/')[1] || 'bin'}"`);

    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    console.error('File stream error:', error);
    return new NextResponse('Error fetching file', { status: 500 });
  }
}
