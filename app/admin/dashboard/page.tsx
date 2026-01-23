import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PendingPapersTable } from '@/components/admin/PendingPapersTable';
import { PaymentVerificationTable } from '@/components/admin/PaymentVerificationTable';
import { AcceptedPapersTable } from '@/components/admin/AcceptedPapersTable';
import { RejectedPapersTable } from '@/components/admin/RejectedPapersTable';
import { TeamsTable } from '@/components/admin/TeamsTable';
import { PaymentsTable } from '@/components/admin/PaymentsTable';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { FEE_AMOUNT_INR, FEE_AMOUNT_USD } from '@/lib/constants';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');

  // 1. Fetch Papers
  const pendingPapers = await prisma.paper.findMany({
    where: { status: 'AWAITING_DECISION' },
    include: { 
        user: {
            include: { members: true }
        }, 
        reviews: true 
    }
  });

  const paymentPapers = await prisma.paper.findMany({
    where: { status: 'PAYMENT_VERIFICATION' },
    include: { user: true }
  });

  const acceptedPapers = await prisma.paper.findMany({
    where: { status: { in: ['ACCEPTED_UNPAID', 'REGISTERED'] } },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  const rejectedPapers = await prisma.paper.findMany({
    where: { status: 'REJECTED' },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  // 2. Fetch Extra Data for New Views
  const allTeams = await prisma.user.findMany({
    include: { paper: true, members: true },
    orderBy: { createdAt: 'desc' }
  });

  const confirmedPayments = await prisma.paper.findMany({
    where: { status: 'REGISTERED' },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  // 3. Stats & Revenue
  const revenue = confirmedPayments.reduce(
    (acc: any, paper: any) => {
      const isForeign = paper.user.country.toLowerCase() !== 'india';
      if (isForeign) {
        acc.usd += FEE_AMOUNT_USD;
      } else {
        acc.inr += FEE_AMOUNT_INR;
      }
      return acc;
    },
    { inr: 0, usd: 0 }
  );

  const stats = {
    total: allTeams.length,
    accepted: acceptedPapers.length,
    rejected: rejectedPapers.length,
    pending: pendingPapers.length,
    payment: paymentPapers.length
  };

  // Reviewer Stats (for overview if needed, keeping it minimal for now or reusing logic)
  const allPapers = await prisma.paper.findMany({ select: { domains: true } });
  const domainCounts: Record<string, number> = {};
  allPapers.forEach((p: any) => {
    p.domains.split(',').forEach((d: any) => {
        domainCounts[d] = (domainCounts[d] || 0) + 1;
    });
  });
  const sortedDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);

  const reviewers = await prisma.reviewer.findMany({
    include: { reviews: true }
  });


  // --- View Construction ---
  const OverviewView = (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div className="lg:col-span-2 xl:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Pending Decisions</h2>
                        <p className="text-xs text-slate-500 mt-1">Papers with reviewer consensus</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        {pendingPapers.length} Pending
                    </span>
                </div>
                <PendingPapersTable papers={pendingPapers} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Payment Verification</h2>
                        <p className="text-xs text-slate-500 mt-1">Confirm payment screenshots</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        {paymentPapers.length} Pending
                    </span>
                </div>
                <PaymentVerificationTable papers={paymentPapers} />
            </div>
        </div>

        <div className="space-y-8">
             {/* Domain Distribution */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Papers by Domain</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {sortedDomains.map(([domain, count]) => (
                        <div key={domain} className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 truncate max-w-[200px]" title={domain}>{domain}</span>
                            <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

             {/* Reviewer Performance */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Reviewer Stats</h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviewers.map((reviewer: any) => {
                        const total = reviewer.reviews.length;
                        const completed = reviewer.reviews.filter((r: any) => r.isCompleted).length;
                        const pending = total - completed;
                        
                        return (
                            <div key={reviewer.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="font-bold text-sm text-slate-700 truncate mb-2">{reviewer.name}</div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Total</div>
                                        <div className="font-bold text-slate-800">{total}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-green-600 uppercase font-bold">Done</div>
                                        <div className="font-bold text-green-600">{completed}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-amber-500 uppercase font-bold">Pend</div>
                                        <div className="font-bold text-amber-600">{pending}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <AdminDashboardClient 
        pendingCount={stats.pending}
        paymentCount={stats.payment}
        acceptedCount={stats.accepted}
        rejectedCount={stats.rejected}
        totalCount={stats.total}
        revenue={revenue}
    >
        {{
            overview: OverviewView,
            teams: <TeamsTable teams={allTeams} />,
            payments: <PaymentsTable payments={confirmedPayments} />,
            accepted: <AcceptedPapersTable papers={acceptedPapers} />,
            rejected: <RejectedPapersTable papers={rejectedPapers} />
        }}
    </AdminDashboardClient>
  );
}