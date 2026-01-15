'use server';

import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function uploadPaymentScreenshot(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'user') {
    return { message: 'Unauthorized' };
  }

  const file = formData.get('screenshot') as File;
  if (!file || file.size === 0) {
    return { message: 'Please select a file' };
  }

  try {
    const blob = await put(`payments/${session.userId}_${file.name}`, file, { access: 'public' });

    await prisma.paper.update({
      where: { userId: session.userId },
      data: {
        paymentScreenshotUrl: blob.url,
        status: 'PAYMENT_VERIFICATION'
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Payment upload error:', error);
    return { message: 'Upload failed' };
  }
}
