'use server';

import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AuthFormState } from '@/lib/definitions';

const LoginSchema = z.object({
    email: z.string().email(),
    teamId: z.string().min(1)
});

export async function loginTeam(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = formData.get('email') as string;
    const teamId = formData.get('teamId') as string;

    const validated = LoginSchema.safeParse({ email, teamId });

    if (!validated.success) {
        return { message: 'Invalid inputs.' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { message: 'Invalid credentials.' };
        }

        // Check password (hashed Team ID)
        const isValid = teamId === user.password;

        if (!isValid) {
            return { message: 'Invalid credentials.' };
        }

        // Create Session
        await createSession(user.id, 'user');
    } catch {
        return { message: 'Database error.' };
    }
    
    redirect('/dashboard');
}

export async function loginSystem(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'admin' | 'reviewer';

    if (!email || !password || !role) return { message: 'Missing fields' };

    try {
        if (role === 'admin') {
            const admin = await prisma.admin.findUnique({ where: { email } });
            if (!admin || admin.password !== password) return { message: 'Invalid admin credentials' }; // In real app, hash this too
            await createSession(admin.id, 'admin');
            redirect('/admin/dashboard');
        } else {
            const reviewer = await prisma.reviewer.findUnique({ where: { email } });
            if (!reviewer || reviewer.password !== password) return { message: 'Invalid reviewer credentials' }; // In real app, hash this too
            await createSession(reviewer.id, 'reviewer');
            redirect('/reviewer/dashboard');
        }
    } catch (error) {
        console.error('System login error:', error);
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
        return { message: 'Auth failed' };
    }
}

export async function logout() {
    await deleteSession();
    redirect('/');
}
