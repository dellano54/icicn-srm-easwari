import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { adminDecision, verifyPayment } from '@/app/actions/admin';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');

  const pendingPapers = await prisma.paper.findMany({
    where: { status: 'AWAITING_DECISION' },
    include: { user: true, reviews: true }
  });

  const paymentPapers = await prisma.paper.findMany({
    where: { status: 'PAYMENT_VERIFICATION' },
    include: { user: true }
  });

  const stats = {
    total: await prisma.paper.count(),
    accepted: await prisma.paper.count({ where: { status: { in: ['ACCEPTED_UNPAID', 'REGISTERED'] } } }),
    registered: await prisma.paper.count({ where: { status: 'REGISTERED' } }),
    rejected: await prisma.paper.count({ where: { status: 'REJECTED' } })
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-slate-500 text-sm">Total Submissions</div>
            <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-slate-500 text-sm">Accepted</div>
            <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-slate-500 text-sm">Registered (Paid)</div>
            <div className="text-3xl font-bold text-blue-600">{stats.registered}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-slate-500 text-sm">Rejected</div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Decisions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold">Pending Decisions</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {pendingPapers.map(paper => (
                    <div key={paper.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{paper.user.teamName}</h3>
                                <p className="text-sm text-slate-500">Domains: {paper.domains.join(', ')}</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                                Awaiting Decision
                            </span>
                        </div>
                        
                        <div className="mb-4 bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold mb-2">Reviewer Feedback:</p>
                            {paper.reviews.map((r, i) => (
                                <div key={i} className="text-xs text-slate-600 mb-1">
                                    <span className={`font-bold ${r.decision === 'ACCEPT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {r.decision}
                                    </span> 
                                    ({r.tier}): "{r.feedback}"
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <form action={async (formData) => {
                                'use server';
                                await adminDecision(paper.id, 'ACCEPT', 'TIER_1', formData);
                            }}>
                                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Accept</button>
                            </form>
                            <form action={async (formData) => {
                                'use server';
                                await adminDecision(paper.id, 'REJECT', undefined, formData);
                            }}>
                                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Reject</button>
                            </form>
                        </div>
                    </div>
                ))}
                {pendingPapers.length === 0 && <div className="p-6 text-slate-500">No papers awaiting decision.</div>}
            </div>
        </div>

        {/* Payment Verification */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold">Payment Verification</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {paymentPapers.map(paper => (
                    <div key={paper.id} className="p-6">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{paper.user.teamName}</h3>
                                <p className="text-sm text-slate-500">Email: {paper.user.email}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                Verify Payment
                            </span>
                        </div>
                        
                        {paper.paymentScreenshotUrl && (
                            <div className="mb-4">
                                <a href={paper.paymentScreenshotUrl} target="_blank" className="text-blue-600 underline text-sm">View Screenshot</a>
                            </div>
                        )}

                        <form action={async (formData) => {
                            'use server';
                            await verifyPayment(paper.id, formData);
                        }}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Approve Payment</button>
                        </form>
                    </div>
                ))}
                {paymentPapers.length === 0 && <div className="p-6 text-slate-500">No pending payments.</div>}
            </div>
        </div>
      </div>
    </div>
  );
}
