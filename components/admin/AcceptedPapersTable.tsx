"use client";

import React, { useState } from 'react';
import { Paper, User } from '@prisma/client';
import { Download } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';

type PaperData = Paper & { user: User };

interface AcceptedPapersTableProps {
    papers: PaperData[];
}

export const AcceptedPapersTable: React.FC<AcceptedPapersTableProps> = ({ papers }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    
    const downloadCSV = () => {
        const headers = ['Team ID', 'Team Name', 'Email', 'Mode', 'College', 'Country', 'Domains', 'Status', 'Paper URL', 'Payment URL', 'Payer Name'];
        const rows = papers.map(p => [
            p.user.id,
            p.user.teamName,
            p.user.email,
            p.user.mode,
            p.user.country,
            p.domains.replace(/,/g, '; '),
            p.status,
            p.cameraReadyPaperUrl,
            p.paymentScreenshotUrl || 'N/A',
            p.paymentSenderName || 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `accepted_papers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Accepted & Registered Papers</h2>
                        <p className="text-xs text-slate-500 mt-1">Teams that have been accepted or fully registered.</p>
                    </div>
                    <button 
                        onClick={downloadCSV}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider sticky top-0 z-10">
                                <th className="p-4">Team</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4">Tier</th>
                                <th className="p-4 text-right">Links</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {papers.map(paper => (
                                <tr key={paper.id} onClick={() => setSelectedTeamId(paper.userId)} className="hover:bg-slate-50/50 cursor-pointer">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-lg">{paper.user.teamName}</div>
                                        <div className="text-sm text-slate-400 font-mono mt-1">{paper.userId}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-base text-slate-600">{paper.user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-1 rounded text-sm font-bold uppercase
                                            ${paper.status === 'REGISTERED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}
                                        `}>
                                            {paper.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-sm font-bold px-2 py-1 rounded border ${paper.user.mode === 'ONLINE' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                            {paper.user.mode}
                                        </span>
                                    </td>
                                    <td className="p-4 text-base text-slate-600">
                                        {paper.adminTier || '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3 text-sm font-bold">
                                            <a href={paper.cameraReadyPaperUrl ? `/api/file/paper/${paper.id}` : '#'} target="_blank" className="text-blue-600 hover:underline">Paper</a>
                                            {paper.paymentScreenshotUrl && (
                                                <a href={`/api/file/payment/${paper.id}`} target="_blank" className="text-emerald-600 hover:underline">Payment</a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {papers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">No accepted papers yet.</td>
                                </tr>
                            )}
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
