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

export async function declinePayment(paperId: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return { message: 'Unauthorized' };
    }
  
    try {
      const paper = await prisma.paper.findUnique({
          where: { id: paperId },
          include: { user: true }
      });

      if (!paper) return { message: 'Paper not found' };
  
      await prisma.paper.update({
        where: { id: paperId },
        data: {
          status: 'PAYMENT_DECLINED',
          paymentScreenshotUrl: null, // Clear the invalid screenshot so they can re-upload? Or keep it for record? Keeping it might confuse logic if we check for existence. Let's clear it or keep it?
          // If I clear it, `DashboardClient` logic for "Missing Payment Proof" might trigger if I revert to REGISTERED, but here status is PAYMENT_DECLINED.
          // Let's NOT clear it immediately, or maybe we should to force a fresh state? 
          // If I clear it, the user sees "Upload". If I don't, I need to make sure the UI allows re-upload even if url exists.
          // Let's clear it so the logic is cleaner: "No valid payment proof exists".
          // Actually, let's keep it in case they want to see what they uploaded, but the UI will ask for a NEW one.
          // The previous code `uploadPaymentScreenshot` overwrites it anyway.
        }
      });
  
      // Send Email
      if (paper.user) {
          sendEmail(
              paper.user.email,
              "Action Required: Payment Verification Failed - ICCICN '26",
              `<h1>Payment Verification Failed</h1>
               <p>Hello Team <strong>${paper.user.teamName}</strong>,</p>
               <p>We reviewed your payment proof for paper <strong>${paperId}</strong>, but unfortunately, we could not verify it.</p>
               
               <div class="highlight-box" style="border-color: #ef4444; background-color: #fef2f2;">
                  <strong>Reason:</strong>
                  <p>The screenshot was unclear, the transaction ID was missing, or the amount was incorrect.</p>
               </div>
  
               <p>Please log in to your dashboard and upload a valid payment proof immediately to secure your registration.</p>
               
               <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="btn">Retry Payment</a>
               </div>`,
              'danger'
          ).catch(err => console.error("Payment decline email failed:", err));
      }
  
      revalidatePath('/admin/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Payment decline error:', error);
      return { message: 'Decline failed' };
    }
  }
