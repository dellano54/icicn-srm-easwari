'use server';

import { prisma } from '@/lib/prisma';

export async function getTeamDetails(teamId: string) {
    const team = await prisma.user.findUnique({
        where: { id: teamId },
        include: {
            members: true,
            paper: {
                include: {
                    reviews: true,
                },
            },
        },
    });
    return team;
}