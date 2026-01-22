"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Paper, Review, User, Member } from '@prisma/client';
import { bulkAdminDecision } from '@/app/actions/bulk';
import { CheckSquare, Square, Check, X, ArrowUpDown, Info } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';
import { useLoading } from '@/contexts/LoadingContext';

type PaperWithDetails = Paper & {
    user: User & { members: Member[] };
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
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'tier', direction: 'asc' });
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const { showLoader, hideLoader } = useLoading();

    const processedPapers = useMemo(() => {
        return initialPapers.map(paper => {
            const accepts = paper.reviews.filter(r => r.decision === 'ACCEPT');
            const rejects = paper.reviews.filter(r => r.decision === 'REJECT');
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

    const sortedPapers = useMemo(() => {
        if (!sortConfig) return processedPapers;
        return [...processedPapers].sort((a, b) => {
            if (sortConfig.key === 'teamName') {
                return sortConfig.direction === 'asc' ? a.user.teamName.localeCompare(b.user.teamName) : b.user.teamName.localeCompare(a.user.teamName);
            }
            if (sortConfig.key === 'consensus') {
                return sortConfig.direction === 'asc' ? a.acceptCount - b.acceptCount : b.acceptCount - a.acceptCount;
            }
            if (sortConfig.key === 'tier') {
                return sortConfig.direction === 'asc' ? a.avgTier - b.avgTier : b.avgTier - a.avgTier;
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

        showLoader(`Bulk ${decision.toLowerCase()}ing papers...`);
        
        await bulkAdminDecision(Array.from(selectedIds), decision, undefined);
        setSelectedIds(new Set());
        router.refresh();
        hideLoader();
    };

    const handleSingleAction = async (id: string, decision: 'ACCEPT' | 'REJECT') => {
        showLoader('Processing decision...');
        
        await bulkAdminDecision([id], decision, undefined);
        router.refresh();
        hideLoader();
    }

    if (initialPapers.length === 0) {
        return <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 italic">No papers awaiting decision.</div>;
    }

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white animate-fade-in sticky top-0 z-20">
                    <span className="text-sm font-bold">{selectedIds.size} papers selected</span>
                    <div className="flex gap-3">
                        <button onClick={() => handleBulkAction('ACCEPT')} className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center shadow-lg shadow-emerald-500/20">
                            <Check className="w-3 h-3 mr-2"/> Accept (Auto-Tier)
                        </button>
                        <button onClick={() => handleBulkAction('REJECT')} className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center shadow-lg shadow-red-500/20">
                            <X className="w-3 h-3 mr-2"/> Reject Selected
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                            <th className="p-4 w-12 text-center">
                                <button onClick={toggleAll} className="text-slate-400 hover:text-blue-600 transition-colors">
                                    {selectedIds.size === sortedPapers.length && sortedPapers.length > 0 ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
                                </button>
                            </th>
                            <th className="p-4 w-24">Team ID</th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => requestSort('teamName')}>
                                <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600">
                                    Team Details <ArrowUpDown className="w-3 h-3 opacity-50"/>
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => requestSort('consensus')}>
                                <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600">
                                    Consensus <ArrowUpDown className="w-3 h-3 opacity-50"/>
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => requestSort('tier')}>
                                <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600">
                                    Rec. Tiers <ArrowUpDown className="w-3 h-3 opacity-50"/>
                                </div>
                            </th>
                            <th className="p-4 text-right text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {sortedPapers.map((paper) => (
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
                                    <div className="flex flex-wrap gap-2">
                                        {paper.domains.split(',').slice(0, 2).map((d, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded text-[10px] font-medium uppercase tracking-wide">
                                                {d}
                                            </span>
                                        ))}
                                        {paper.domains.split(',').length > 2 && (
                                            <span className="px-2 py-0.5 text-slate-400 text-[10px] font-medium">+{paper.domains.split(',').length - 2}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center min-w-[3rem]">
                                            <span className="text-lg font-bold text-emerald-600">{paper.acceptCount}</span>
                                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase">Accept</span>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200"></div>
                                        <div className="flex flex-col items-center min-w-[3rem]">
                                            <span className="text-lg font-bold text-red-500">{paper.rejectCount}</span>
                                            <span className="text-[10px] font-bold text-red-500/60 uppercase">Reject</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {paper.tierCounts.T1 > 0 && (
                                            <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 px-2.5 py-1.5 rounded-lg">
                                                <span className="font-bold text-sm">T1</span>
                                                <span className="bg-purple-200 text-purple-800 text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center">{paper.tierCounts.T1}</span>
                                            </div>
                                        )}
                                        {paper.tierCounts.T2 > 0 && (
                                            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg">
                                                <span className="font-bold text-sm">T2</span>
                                                <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center">{paper.tierCounts.T2}</span>
                                            </div>
                                        )}
                                        {paper.tierCounts.T3 > 0 && (
                                            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg">
                                                <span className="font-bold text-sm">T3</span>
                                                <span className="bg-amber-200 text-amber-800 text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center">{paper.tierCounts.T3}</span>
                                            </div>
                                        )}
                                        {paper.acceptCount > 0 && paper.tierCounts.T1 === 0 && paper.tierCounts.T2 === 0 && paper.tierCounts.T3 === 0 && (
                                            <span className="text-slate-400 text-xs italic">No tier info</span>
                                        )}
                                    </div>
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
                                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                        <button 
                                            onClick={() => handleSingleAction(paper.id, 'ACCEPT')}
                                            className="h-9 px-4 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-md border border-emerald-100 hover:border-emerald-500 flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" /> Accept
                                        </button>
                                        <button 
                                            onClick={() => handleSingleAction(paper.id, 'REJECT')}
                                            className="h-9 w-9 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md border border-red-100 hover:border-red-500"
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
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