"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paper, User } from '@prisma/client';
import { bulkVerifyPayment } from '@/app/actions/bulk';
import { declinePayment } from '@/app/actions/payment';
import { CheckSquare, Square, Check, ExternalLink, User as UserIcon, FileText, Info, X, Calendar } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';
import { useLoading } from '@/contexts/LoadingContext';
import { formatDate, formatDateTime } from '@/lib/utils';

type PaperWithUser = Paper & {
    user: User;
};

interface PaymentVerificationTableProps {
    papers: PaperWithUser[];
}

export const PaymentVerificationTable: React.FC<PaymentVerificationTableProps> = ({ papers }) => {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoading();

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === papers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(papers.map(p => p.id)));
        }
    };

    const handleBulkVerify = async () => {
        if (selectedIds.size === 0) return;

        showLoader('Verifying payments...');
        
        await bulkVerifyPayment(Array.from(selectedIds));
        setSelectedIds(new Set());
        router.refresh();
        hideLoader();
    };

    const handleSingleVerify = async (id: string) => {
        showLoader('Verifying payment...');
        
        await bulkVerifyPayment([id]);
        router.refresh();
        hideLoader();
    };

    const handleSingleDecline = async (id: string) => {
        if (!confirm('Are you sure you want to decline this payment?')) return;
        showLoader('Declining payment...');
        
        await declinePayment(id);
        router.refresh();
        hideLoader();
    };

    if (papers.length === 0) {
        return <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 italic">No pending payments.</div>;
    }

    return (
        <>
            <div className="relative">
                {/* Bulk Actions Bar - Sticky at top of the table container */}
                {selectedIds.size > 0 && (
                    <div className="bg-slate-900 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between text-white animate-fade-in sticky top-0 z-30 rounded-t-lg shadow-xl">
                        <div className="flex items-center gap-3">
                            <button onClick={toggleAll} className="text-white/70 hover:text-white transition-colors">
                                {selectedIds.size === papers.length ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                            </button>
                            <span className="text-xs md:text-sm font-bold">{selectedIds.size} selected</span>
                        </div>
                        <button 
                            onClick={handleBulkVerify}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <Check className="w-3 h-3 mr-1.5 md:mr-2"/> Verify All
                        </button>
                    </div>
                )}

                {/* Mobile View: Card Layout (Visible on small screens) */}
                <div className="md:hidden divide-y divide-slate-100 bg-white">
                    {papers.map(paper => (
                        <div 
                            key={paper.id} 
                            className={`p-4 flex flex-col gap-4 transition-colors ${selectedIds.has(paper.id) ? 'bg-blue-50/50' : 'bg-white'}`}
                            onClick={() => setSelectedTeamId(paper.userId)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(paper.id); }} 
                                        className={`mt-1 transition-colors ${selectedIds.has(paper.id) ? 'text-blue-600' : 'text-slate-300'}`}
                                    >
                                        {selectedIds.has(paper.id) ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                    </button>
                                    <div>
                                        <div className="font-bold text-slate-800 text-base">{paper.user.teamName}</div>
                                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{paper.userId.split('-').pop()}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold italic">
                                    <Calendar className="w-3 h-3" />
                                    {formatDateTime(paper.paymentUploadedAt || paper.updatedAt)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                <div>
                                    <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Payer</div>
                                    <div className="text-xs font-bold text-slate-700 truncate">{paper.paymentSenderName || 'Unknown'}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Proof</div>
                                    {paper.paymentScreenshotUrl ? (
                                        <a 
                                            href={`/api/file/payment/${paper.id}`}
                                            target="_blank" 
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-[10px] font-bold text-blue-600 flex items-center gap-1"
                                        >
                                            <FileText className="w-3 h-3" /> View File
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-red-400 italic font-bold">Missing</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedTeamId(paper.userId); }}
                                    className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center gap-1.5"
                                >
                                    <Info className="w-3.5 h-3.5" /> Details
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleSingleDecline(paper.id); }}
                                    className="px-3 py-2 rounded-lg bg-red-50 text-red-500 border border-red-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleSingleVerify(paper.id); }}
                                    className="flex-[1.5] py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
                                >
                                    <Check className="w-3.5 h-3.5" /> Verify
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table Layout (Hidden on mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                                <th className="p-4 w-12 text-center">
                                    <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                                        {selectedIds.size === papers.length && papers.length > 0 ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                    </button>
                                </th>
                                <th className="p-4 w-24">ID</th>
                                <th className="p-4">Team</th>
                                <th className="p-4 lg:table-cell hidden">Payer</th>
                                <th className="p-4">Proof</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {papers.map(paper => (
                                <tr 
                                    key={paper.id} 
                                    onClick={() => setSelectedTeamId(paper.userId)} 
                                    className="group hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                                >
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => toggleSelect(paper.id)} className={`transition-colors ${selectedIds.has(paper.id) ? 'text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}>
                                            {selectedIds.has(paper.id) ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{paper.userId.split('-').pop()}</span>
                                        <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-bold italic">
                                            <Calendar className="w-3 h-3" />
                                            {formatDateTime(paper.paymentUploadedAt || paper.updatedAt)}
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-[200px]">
                                        <div className="font-bold text-slate-800 text-sm lg:text-base group-hover:text-blue-700 transition-colors truncate">{paper.user.teamName}</div>
                                        <div className="text-[11px] text-slate-500 truncate">{paper.user.email}</div>
                                    </td>
                                    <td className="p-4 lg:table-cell hidden">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                <UserIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-700 text-xs truncate">{paper.paymentSenderName || 'Unknown'}</div>
                                                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Payer</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {paper.paymentScreenshotUrl ? (
                                            <a 
                                                href={`/api/file/payment/${paper.id}`}
                                                target="_blank" 
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-[10px] font-bold group/link"
                                            >
                                                <FileText className="w-3 h-3 group-hover/link:scale-110 transition-transform" />
                                                <span className="hidden lg:inline">View Proof</span>
                                                <span className="lg:hidden">View</span>
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic flex items-center gap-1">
                                                <Info className="w-3 h-3"/> Missing
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => handleSingleDecline(paper.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 hover:border-red-500 shadow-sm"
                                                title="Decline"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleSingleVerify(paper.id)}
                                                className="h-8 px-2 lg:px-3 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-[10px] hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100 hover:border-emerald-500 flex items-center gap-1.5 shadow-sm"
                                            >
                                                <Check className="w-3 h-3" />
                                                <span className="hidden lg:inline">Verify</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedTeamId && (
                <TeamDetailsModal teamId={selectedTeamId} onClose={() => setSelectedTeamId(null)} />
            )}
        </>
    );
};
