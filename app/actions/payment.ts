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
        // Fire-and-forget email
        sendEmail(
            user.email,
            "Payment Proof Received - ICCICN '26",
            `<h1>Payment Received</h1>
             <p>Hello Team <strong>${user.teamName}</strong>,</p>
             <p>This is to confirm that we have successfully received your payment proof uploaded by <strong>${payerName}</strong>.</p>
             
             <div class="highlight-box">
                <strong>Status: Verification in Progress</strong>
                <p>Our finance team will verify the transaction details. This typically takes 24-48 hours.</p>
             </div>

             <p>Once verified, your registration status will be updated to "Confirmed" on your dashboard, and you will be able to upload the final camera-ready files.</p>
             
             <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="btn">Check Status</a>
             </div>`,
            'warning'
        ).catch(err => console.error("Payment email failed:", err));
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Payment upload error:', error);
    return { message: 'Upload failed' };
  }
}
