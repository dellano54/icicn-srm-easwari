"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paper, User } from '@prisma/client';
import { bulkVerifyPayment } from '@/app/actions/bulk';
import { CheckSquare, Square, Check, ExternalLink, User as UserIcon, FileText, Info } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';
import { useLoading } from '@/contexts/LoadingContext';

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

    if (papers.length === 0) {
        return <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 italic">No pending payments.</div>;
    }

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white animate-fade-in sticky top-0 z-20">
                    <span className="text-sm font-bold">{selectedIds.size} payments selected</span>
                    <button 
                        onClick={handleBulkVerify}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center shadow-lg shadow-emerald-500/20"
                    >
                        <Check className="w-3 h-3 mr-2"/> Verify Selected
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                            <th className="p-4 w-12 text-center">
                                <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                                    {selectedIds.size === papers.length && papers.length > 0 ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                </button>
                            </th>
                            <th className="p-4 w-24">Team ID</th>
                            <th className="p-4">Team Details</th>
                            <th className="p-4">Payer Name</th>
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
                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{paper.userId.split('-').pop()}</span>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors mb-1">{paper.user.teamName}</div>
                                    <div className="text-xs text-slate-500">{paper.user.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700 text-sm">{paper.paymentSenderName || 'Unknown'}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payer</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {paper.paymentScreenshotUrl ? (
                                        <a 
                                            href={`/api/file/payment/${paper.id}`}
                                            target="_blank" 
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-xs font-bold group/link"
                                        >
                                            <FileText className="w-3 h-3 group-hover/link:scale-110 transition-transform" />
                                            View File
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic flex items-center gap-1">
                                            <Info className="w-3 h-3"/> Missing
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => setSelectedTeamId(paper.userId)}
                                            className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm hover:shadow-md"
                                            title="View Details"
                                        >
                                            <Info className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleSingleVerify(paper.id)}
                                            className="h-9 px-4 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-md border border-emerald-100 hover:border-emerald-500 flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" /> Verify
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedTeamId && (
                <TeamDetailsModal teamId={selectedTeamId} onClose={() => setSelectedTeamId(null)} />
            )}
        </>
    );
};