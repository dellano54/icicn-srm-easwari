"use client";

import React, { useState } from 'react';
import { Paper, User } from '@prisma/client';
import { bulkVerifyPayment } from '@/app/actions/bulk';
import { Loader2, CheckSquare, Square, Check, ExternalLink } from 'lucide-react';

type PaperWithUser = Paper & {
    user: User;
};

interface PaymentVerificationTableProps {
    papers: PaperWithUser[];
}

export const PaymentVerificationTable: React.FC<PaymentVerificationTableProps> = ({ papers }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState(false);

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
        if (!confirm(`Verify payment for ${selectedIds.size} papers?`)) return;

        setIsProcessing(true);
        await bulkVerifyPayment(Array.from(selectedIds));
        setSelectedIds(new Set());
        setIsProcessing(false);
    };

    if (papers.length === 0) {
        return <div className="p-6 text-slate-500 text-center italic">No pending payments.</div>;
    }

    return (
        <div>
            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between animate-fade-in-up">
                    <span className="text-sm font-bold text-blue-800">{selectedIds.size} selected</span>
                    <button 
                        onClick={handleBulkVerify}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Check className="w-3 h-3 mr-1"/>}
                        Verify Selected
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                            <th className="p-4 w-10">
                                <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600">
                                    {selectedIds.size === papers.length && papers.length > 0 ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                </button>
                            </th>
                            <th className="p-4">Team Details</th>
                            <th className="p-4">Proof</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {papers.map(paper => {
                            const isSelected = selectedIds.has(paper.id);
                            return (
                                <tr key={paper.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                                    <td className="p-4">
                                        <button onClick={() => toggleSelect(paper.id)} className={`text-slate-300 hover:text-blue-500 ${isSelected ? 'text-blue-600' : ''}`}>
                                            {isSelected ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{paper.user.teamName}</div>
                                        <div className="text-xs text-slate-500">{paper.user.email}</div>
                                        {paper.paymentSenderName && (
                                            <div className="text-[10px] text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1 font-bold">
                                                Paid by: {paper.paymentSenderName}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {paper.paymentScreenshotUrl ? (
                                            <a 
                                                href={paper.paymentScreenshotUrl} 
                                                target="_blank" 
                                                className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3 mr-1"/>
                                                View Screenshot
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400">No file</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <form action={async () => {
                                            await bulkVerifyPayment([paper.id]);
                                        }}>
                                            <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200">Verify</button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
