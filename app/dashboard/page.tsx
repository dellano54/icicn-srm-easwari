import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'user') {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { paper: true, members: true }
  });

  if (!user || !user.paper) {
    redirect('/login');
  }

  return (
    <DashboardClient 
      user={user} 
      paper={user.paper} 
    />
  );
}
