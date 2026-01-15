import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { submitReview } from '@/app/actions/reviewer';

export default async function ReviewerDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'reviewer') redirect('/login');

  const reviewer = await prisma.reviewer.findUnique({
    where: { id: session.userId },
    include: { 
        reviews: { 
            include: { paper: { include: { user: true } } } 
        } 
    }
  });

  if (!reviewer) redirect('/login');

  const pendingReviews = reviewer.reviews.filter(r => !r.isCompleted);
  const completedReviews = reviewer.reviews.filter(r => r.isCompleted);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Reviewer Dashboard</h1>
        <p className="text-slate-500 mb-8">Welcome, {reviewer.name}</p>

        <div className="space-y-8">
            {/* PENDING */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Pending Reviews ({pendingReviews.length})</h2>
                <div className="space-y-4">
                    {pendingReviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{review.paper.user.teamName}</h3>
                                    <div className="text-sm text-slate-500 mt-1">Domains: {review.paper.domains.join(', ')}</div>
                                </div>
                                <div className="space-x-2">
                                    <a href={review.paper.paperUrl} target="_blank" className="text-blue-600 hover:underline text-sm font-medium">View Paper</a>
                                    <span className="text-slate-300">|</span>
                                    <a href={review.paper.plagiarismUrl} target="_blank" className="text-blue-600 hover:underline text-sm font-medium">Plagiarism Report</a>
                                </div>
                            </div>
                            
                            <form action={submitReview.bind(null, review.id)} className="bg-slate-50 p-4 rounded-lg">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-1">Feedback</label>
                                    <textarea name="feedback" required className="w-full p-2 rounded border border-slate-300 text-sm" rows={3}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Decision</label>
                                        <select name="decision" className="w-full p-2 rounded border border-slate-300 text-sm">
                                            <option value="ACCEPT">Accept</option>
                                            <option value="REJECT">Reject</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Tier (if Accepted)</label>
                                        <select name="tier" className="w-full p-2 rounded border border-slate-300 text-sm">
                                            <option value="TIER_1">Tier 1 (High Quality)</option>
                                            <option value="TIER_2">Tier 2</option>
                                            <option value="TIER_3">Tier 3</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 w-full">Submit Review</button>
                            </form>
                        </div>
                    ))}
                    {pendingReviews.length === 0 && <p className="text-slate-500 italic">No pending reviews.</p>}
                </div>
            </div>

            {/* COMPLETED */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Completed History ({completedReviews.length})</h2>
                <div className="space-y-4 opacity-75">
                    {completedReviews.map(review => (
                        <div key={review.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-700">{review.paper.user.teamName}</h3>
                                <p className="text-xs text-slate-500 mt-1">Decision: {review.decision} ({review.tier || 'N/A'})</p>
                            </div>
                            <span className="text-green-600 text-sm font-bold">Submitted</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
