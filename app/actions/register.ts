'use server';

import { RegistrationSchema, RegistrationFormState } from '@/lib/definitions';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { assignReviewers } from '@/lib/logic';
import { sendEmail } from '@/lib/email';

export async function registerTeam(prevState: RegistrationFormState, formData: FormData): Promise<RegistrationFormState> {
    
    // 1. Extract and Parse Data
    const rawData = {
        teamName: formData.get('teamName') as string,
        domains: JSON.parse(formData.get('domains') as string || '[]'),
        members: JSON.parse(formData.get('members') as string || '[]'),
        mode: formData.get('mode') as 'ONLINE' | 'OFFLINE',
    };

    // 2. Validate Fields
    const validatedFields = RegistrationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please check your inputs.',
        };
    }

    const { teamName, domains, members, mode } = validatedFields.data;

    // 3. Validate Files
    const paperFile = formData.get('paperFile') as File;
    const plagiarismFile = formData.get('plagiarismFile') as File;

    if (!paperFile || paperFile.size === 0 || paperFile.type !== 'application/pdf') {
        return { message: 'Valid PDF Paper is required.' };
    }
    if (!plagiarismFile || plagiarismFile.size === 0 || plagiarismFile.type !== 'application/pdf') {
        return { message: 'Valid Plagiarism Report is required.' };
    }

    // 4. Check for duplicate email (Team Lead Email)
    const leadEmail = members[0].email;
    const existingUser = await prisma.user.findUnique({
        where: { email: leadEmail }
    });

    if (existingUser) {
        return { message: 'This email has already been used to register.' };
    }

    try {
        // 5. Generate Sequential Credentials
        const currentYear = new Date().getFullYear();
        const userCount = await prisma.user.count();
        const nextId = (userCount + 1).toString().padStart(4, '0');
        const teamId = `TEAM-${currentYear}-${nextId}`; // This will be the "password" they see
        
        // 6. Upload Files (Parallel)
        const [paperBlob, plagiarismBlob] = await Promise.all([
            put(`papers/${teamId}.pdf`, paperFile, { access: 'public', allowOverwrite: true }),
            put(`plagiarism/${teamId}.pdf`, plagiarismFile, { access: 'public', allowOverwrite: true })
        ]);

        // 7. Database Transaction
        const newUser = await prisma.user.create({
            data: {
                id: teamId,
                teamName,
                email: leadEmail,
                password: teamId, // Storing plain ID as requested
                country: members[0].country, // Defaulting to lead's country
                mode: mode,
                members: {
                    create: members.map((m, index) => ({
                        name: m.name,
                        email: m.email,
                        phone: m.phone,
                        college: m.college,
                        department: m.department,
                        city: m.city,
                        state: m.state,
                        country: m.country,
                        isLead: index === 0
                    }))
                },
                paper: {
                    create: {
                        cameraReadyPaperUrl: paperBlob.url,
                        plagiarismReportUrl: plagiarismBlob.url,
                        domains: domains.join(','),
                        status: 'SUBMITTED'
                    }
                }
            },
            include: {
                paper: true
            }
        });

        // 8. Assign Reviewers (Background Task - non-blocking for response)
        // Fire-and-forget to speed up response
        if (newUser.paper) {
            assignReviewers(newUser.paper.id, domains).catch(err => console.error("Background Review Assignment Error:", err));
        }

        // 9. Send Confirmation Email (Background Task)
        // Fire-and-forget (optimistic) to prevent blocking the UI
        sendEmail(
            leadEmail,
            "ICCICN '26 Registration Confirmed",
            `<h1>Registration Successful</h1>
             <p>Dear ${members[0].name},</p>
             <p>Congratulations! Your team <strong>${teamName}</strong> has been successfully registered for ICCICN '26.</p>
             
             <div class="highlight-box">
                <strong>Submission Overview:</strong>
                <ul>
                    <li>Paper ID: <strong>${teamId}</strong></li>
                    <li>Mode: <strong>${mode}</strong></li>
                    <li>Tracks: ${domains.join(', ')}</li>
                </ul>
             </div>

             <div class="highlight-box">
                <strong>Login Credentials:</strong>
                <p>Use these credentials to access your dashboard and track your paper's progress:</p>
                <ul>
                    <li>Email: <strong>${leadEmail}</strong></li>
                    <li>Access Code: <span style="font-family: monospace; font-size: 18px; letter-spacing: 1px; color: #2563eb;"><strong>${teamId}</strong></span></li>
                </ul>
             </div>

             <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="btn">Login to Dashboard</a>
             </div>
             
             <p style="margin-top: 32px; font-size: 14px; color: #64748b;">Please keep your Access Code safe. Our reviewers will now begin evaluating your submission. You will receive an update via email once a decision is made.</p>`,
            'success'
        ).catch(err => console.error("Background Email Error:", err));

        return {
            success: true,
            message: 'Registration successful!',
            teamId: teamId, // Returning the unhashed ID for display
            teamEmail: leadEmail
        };

    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { message: `Database error: ${errorMessage}` };
    }
}
