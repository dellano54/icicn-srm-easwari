import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ReviewLink } from '@/components/reviewer/ReviewLink';
import { ReviewForm } from '@/components/reviewer/ReviewForm';
import { CheckCircle, Clock, Eye, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default async function ReviewerDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'reviewer') redirect('/login');

  const reviewer = await prisma.reviewer.findUnique({
    where: { id: session.userId },
    include: { 
        reviews: { 
            include: { 
                paper: { 
                    include: { 
                        user: true,
                        reviews: true 
                    } 
                } 
            } 
        } 
    }
  });

  if (!reviewer) redirect('/login');

  const pendingReviews = reviewer.reviews.filter((r: any) => !r.isCompleted);
  const completedReviews = reviewer.reviews.filter((r: any) => r.isCompleted);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Reviewer Portal</h1>
                <p className="text-slate-500">Welcome, {reviewer.name}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-600 shadow-sm">
                    Assigned: <span className="font-bold text-blue-600">{reviewer.reviews.length}</span>
                </div>
                <form action={logout}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>

        <div className="space-y-12">
            {/* PENDING */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-amber-500" />
                    Pending Reviews ({pendingReviews.length})
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                    {pendingReviews.map((review: any) => (
                        <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{review.paper.user.teamName}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {review.paper.domains.split(',').map((d: any, i: any) => (
                                            <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-xs font-medium">{d}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <ReviewLink 
                                        url={review.paper.cameraReadyPaperUrl ? `/api/file/paper/${review.paper.id}` : ''} 
                                        reviewId={review.id}
                                        label="View Paper PDF" 
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    />
                                    <ReviewLink 
                                        url={review.paper.plagiarismReportUrl ? `/api/file/plagiarism/${review.paper.id}` : ''} 
                                        reviewId={review.id}
                                        label="Plagiarism Report" 
                                        className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center text-slate-500">
                                    {review.viewedAt ? (
                                        <span className="flex items-center text-blue-600 font-medium">
                                            <Eye className="w-3 h-3 mr-1" /> Viewed {new Date(review.viewedAt).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">Not viewed yet</span>
                                    )}
                                </div>
                                <div className="text-slate-400">
                                    Submitted: {new Date(review.paper.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <ReviewForm reviewId={review.id} />
                            </div>
                        </div>
                    ))}
                    {pendingReviews.length === 0 && (
                        <div className="p-12 bg-white rounded-xl border border-slate-200 border-dashed text-center">
                            <p className="text-slate-500 italic">No pending reviews at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* COMPLETED */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center opacity-80">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Completed History ({completedReviews.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                    {completedReviews.map((review: any) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-700">{review.paper.user.teamName}</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${review.decision === 'ACCEPT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {review.decision}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 italic">&quot;{review.feedback}&quot;</p>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                                <span>Tier: {review.tier || 'N/A'}</span>
                                <span>Completed: {new Date(review.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
