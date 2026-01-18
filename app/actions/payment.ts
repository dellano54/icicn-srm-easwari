'use server';

import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

export async function uploadPaymentScreenshot(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'user') {
    return { message: 'Unauthorized' };
  }

  const file = formData.get('screenshot') as File;
  const payerName = formData.get('payerName') as string;

  if (!file || file.size === 0) {
    return { message: 'Please select a file' };
  }
  
  if (!payerName || payerName.trim().length === 0) {
    return { message: 'Please enter the Payer Name' };
  }

  try {
    const blob = await put(`payments/${session.userId}_${file.name}`, file, { access: 'public' });

    await prisma.paper.update({
      where: { userId: session.userId },
      data: {
        paymentScreenshotUrl: blob.url,
        paymentSenderName: payerName,
        status: 'PAYMENT_VERIFICATION'
      }
    });

    // Notify Admins? Or just confirmation to user.
    // Let's send a confirmation to the user.
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (user) {
        await sendEmail(
            user.email,
            "Payment Proof Received",
            `<h1>Payment Uploaded</h1>
             <p>Hello ${user.teamName},</p>
             <p>We have received your payment proof uploaded by <strong>${payerName}</strong>.</p>
             <p>Our team will verify the transaction and confirm your registration shortly.</p>`,
            'warning'
        );
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Payment upload error:', error);
    return { message: 'Upload failed' };
  }
}
