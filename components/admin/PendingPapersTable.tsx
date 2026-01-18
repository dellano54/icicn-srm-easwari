"use client";

import React, { useState, useMemo } from 'react';
import { Paper, Review, User, Tier } from '@prisma/client';
import { bulkAdminDecision } from '@/app/actions/bulk';
import { Loader2, CheckSquare, Square, Check, X, ArrowUpDown, Info } from 'lucide-react';

type PaperWithDetails = Paper & {
    user: User;
    reviews: Review[];
};

interface PendingPapersTableProps {
    papers: PaperWithDetails[];
}

type SortConfig = {
    key: 'teamName' | 'consensus' | 'tier';
    direction: 'asc' | 'desc';
} | null;

export const PendingPapersTable: React.FC<PendingPapersTableProps> = ({ papers: initialPapers }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tier', direction: 'asc' }); // Default sort by Tier (Best first)

    // Helper: Calculate consensus and tier weight
    const processedPapers = useMemo(() => {
        return initialPapers.map(paper => {
            const accepts = paper.reviews.filter(r => r.decision === 'ACCEPT');
            const rejects = paper.reviews.filter(r => r.decision === 'REJECT');
            
            // Calculate Tier Weight for sorting (Tier 1 = 1, Tier 2 = 2, Tier 3 = 3)
            // Lower weight = Higher quality
            const tierSum = accepts.reduce((acc, r) => {
                if (r.tier === 'TIER_1') return acc + 1;
                if (r.tier === 'TIER_2') return acc + 2;
                if (r.tier === 'TIER_3') return acc + 3;
                return acc;
            }, 0);
            const avgTier = accepts.length > 0 ? tierSum / accepts.length : 99;

            return {
                ...paper,
                acceptCount: accepts.length,
                rejectCount: rejects.length,
                avgTier,
                tierCounts: {
                    T1: accepts.filter(r => r.tier === 'TIER_1').length,
                    T2: accepts.filter(r => r.tier === 'TIER_2').length,
                    T3: accepts.filter(r => r.tier === 'TIER_3').length,
                }
            };
        });
    }, [initialPapers]);

    // Sorting Logic
    const sortedPapers = useMemo(() => {
        if (!sortConfig) return processedPapers;

        return [...processedPapers].sort((a, b) => {
            if (sortConfig.key === 'teamName') {
                return sortConfig.direction === 'asc' 
                    ? a.user.teamName.localeCompare(b.user.teamName)
                    : b.user.teamName.localeCompare(a.user.teamName);
            }
            if (sortConfig.key === 'consensus') {
                return sortConfig.direction === 'asc'
                    ? a.acceptCount - b.acceptCount
                    : b.acceptCount - a.acceptCount;
            }
            if (sortConfig.key === 'tier') {
                return sortConfig.direction === 'asc'
                    ? a.avgTier - b.avgTier
                    : b.avgTier - a.avgTier;
            }
            return 0;
        });
    }, [processedPapers, sortConfig]);

    const requestSort = (key: 'teamName' | 'consensus' | 'tier') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- Select Logic ---
    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === sortedPapers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedPapers.map(p => p.id)));
        }
    };

    const handleBulkAction = async (decision: 'ACCEPT' | 'REJECT') => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to ${decision} ${selectedIds.size} papers?`)) return;

        setIsProcessing(true);
        // In bulk accept, we can default to Tier 1 or the average calculated tier
        await bulkAdminDecision(Array.from(selectedIds), decision, decision === 'ACCEPT' ? 'TIER_1' : undefined);
        setSelectedIds(new Set());
        setIsProcessing(false);
    };

    if (initialPapers.length === 0) {
        return <div className="p-6 text-slate-500 text-center italic">No papers awaiting decision.</div>;
    }

    return (
        <div>
            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between animate-fade-in-up">
                    <span className="text-sm font-bold text-blue-800">{selectedIds.size} selected for bulk action</span>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => handleBulkAction('ACCEPT')}
                            disabled={isProcessing}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 disabled:opacity-50 flex items-center"
                        >
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Check className="w-3 h-3 mr-1"/>}
                            Accept Selected (Tier 1)
                        </button>
                        <button 
                            onClick={() => handleBulkAction('REJECT')}
                            disabled={isProcessing}
                            className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50 flex items-center"
                        >
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <X className="w-3 h-3 mr-1"/>}
                            Reject Selected
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                            <th className="p-4 w-10">
                                <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                                    {selectedIds.size === sortedPapers.length && sortedPapers.length > 0 ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                </button>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('teamName')}>
                                <div className="flex items-center gap-1">Team / Paper <ArrowUpDown className="w-3 h-3"/></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('consensus')}>
                                <div className="flex items-center gap-1">Review Consensus <ArrowUpDown className="w-3 h-3"/></div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('tier')}>
                                <div className="flex items-center gap-1">Recommended Tiers <ArrowUpDown className="w-3 h-3"/></div>
                            </th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedPapers.map(paper => {
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
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {paper.domains.slice(0, 1).map((d, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-[4px] text-[9px] font-bold">{d}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3 text-xs font-bold">
                                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Check className="w-3 h-3"/> {paper.acceptCount}
                                            </span>
                                            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                <X className="w-3 h-3"/> {paper.rejectCount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {paper.tierCounts.T1 > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-indigo-600 mb-0.5">T1</span>
                                                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-indigo-200">{paper.tierCounts.T1}</span>
                                                </div>
                                            )}
                                            {paper.tierCounts.T2 > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-blue-500 mb-0.5">T2</span>
                                                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-blue-200">{paper.tierCounts.T2}</span>
                                                </div>
                                            )}
                                            {paper.tierCounts.T3 > 0 && (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-slate-400 mb-0.5">T3</span>
                                                    <span className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-slate-100">{paper.tierCounts.T3}</span>
                                                </div>
                                            )}
                                            {paper.acceptCount === 0 && <span className="text-xs text-slate-400 italic">No recommendations</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <div className="group relative">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                {/* Tooltip with Feedback */}
                                                <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-[10px] p-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                                                    <p className="font-bold border-b border-white/20 pb-1 mb-2">Reviewer Feedback</p>
                                                    {paper.reviews.map((r, i) => (
                                                        <div key={i} className="mb-2 last:mb-0">
                                                            <span className={r.decision === 'ACCEPT' ? 'text-green-400' : 'text-red-400'}>● {r.decision}</span>
                                                            <p className="pl-3 opacity-80">&quot;{r.feedback || 'No comments'}&quot;</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <form action={async () => {
                                                await bulkAdminDecision([paper.id], 'ACCEPT', 'TIER_1');
                                            }}>
                                                <button className="text-[10px] font-bold text-green-600 hover:bg-green-600 hover:text-white px-2 py-1 rounded border border-green-200 transition-colors">Accept</button>
                                            </form>
                                            <form action={async () => {
                                                await bulkAdminDecision([paper.id], 'REJECT', undefined);
                                            }}>
                                                <button className="text-[10px] font-bold text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded border border-red-200 transition-colors">Reject</button>
                                            </form>
                                        </div>
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
