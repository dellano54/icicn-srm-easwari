'use server';

import { RegistrationSchema, RegistrationFormState } from '@/lib/definitions';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { assignReviewers } from '@/lib/logic';
import { sendEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function registerTeam(prevState: RegistrationFormState, formData: FormData): Promise<RegistrationFormState> {
    
    // 1. Extract and Parse Data
    const rawData = {
        teamName: formData.get('teamName') as string,
        mentorName: formData.get('mentorName') as string,
        mentorDept: formData.get('mentorDept') as string,
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

    const { teamName, mentorName, mentorDept, domains, members, mode } = validatedFields.data;

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
        return { message: 'A team with this lead email is already registered.' };
    }

    try {
        // 5. Generate Credentials
        const currentYear = new Date().getFullYear();
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const teamId = `TEAM-${currentYear}-${randomCode}`; // This will be the "password" they see
        
        // Hash the code for storage
        const hashedPassword = await bcrypt.hash(teamId, 10);

        // 6. Upload Files (Parallel)
        const [paperBlob, plagiarismBlob] = await Promise.all([
            put(`papers/${teamId}_paper.pdf`, paperFile, { access: 'public' }),
            put(`plagiarism/${teamId}_report.pdf`, plagiarismFile, { access: 'public' })
        ]);

        // 7. Database Transaction
        const newUser = await prisma.user.create({
            data: {
                teamName,
                email: leadEmail,
                password: hashedPassword, // Storing hashed ID
                mentorName,
                mentorDept,
                country: members[0].country, // Defaulting to lead's country
                mode: mode,
                members: {
                    create: members.map((m, index) => ({
                        ...m,
                        isLead: index === 0
                    }))
                },
                paper: {
                    create: {
                        paperUrl: paperBlob.url,
                        plagiarismUrl: plagiarismBlob.url,
                        domains: domains,
                        status: 'SUBMITTED'
                    }
                }
            },
            include: {
                paper: true
            }
        });

        // 8. Assign Reviewers (Background Task - non-blocking for response)
        // We await it here for simplicity, or we could fire-and-forget
        if (newUser.paper) {
            await assignReviewers(newUser.paper.id, domains);
        }

        // 9. Send Confirmation Email
        await sendEmail(
            leadEmail,
            "ICCICN '26 Registration Confirmed",
            `<h1>Registration Successful</h1>
             <p>Dear ${members[0].name},</p>
             <p>Your team <strong>${teamName}</strong> has been successfully registered for ICCICN '26.</p>
             
             <div class="highlight-box">
                <strong>Team Details:</strong>
                <ul>
                    <li>Mode: <strong>${mode}</strong></li>
                    <li>Domains: ${domains.join(', ')}</li>
                </ul>
             </div>

             <div class="highlight-box">
                <strong>Login Credentials:</strong>
                <ul>
                    <li>Email: ${leadEmail}</li>
                    <li>Access Code: <strong>${teamId}</strong></li>
                </ul>
             </div>
             <p>Please keep this code safe. You will need it to login and check your submission status.</p>`,
            'success'
        );

        return {
            success: true,
            message: 'Registration successful!',
            teamId: teamId, // Returning the unhashed ID for display
            teamEmail: leadEmail
        };

    } catch (error) {
        console.error('Registration error:', error);
        return { message: 'Database error: Failed to register team.' };
    }
}
