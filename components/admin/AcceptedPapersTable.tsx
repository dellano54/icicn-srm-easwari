"use client";

import React from 'react';
import { Paper, User } from '@prisma/client';
import { Download, ExternalLink } from 'lucide-react';

type PaperData = Paper & { user: User };

interface AcceptedPapersTableProps {
    papers: PaperData[];
}

export const AcceptedPapersTable: React.FC<AcceptedPapersTableProps> = ({ papers }) => {
    
    const downloadCSV = () => {
        const headers = ['Team ID', 'Team Name', 'Email', 'Mode', 'Mentor', 'College', 'Country', 'Domains', 'Status', 'Paper URL', 'Payment URL', 'Payer Name'];
        const rows = papers.map(p => [
            `ID-${p.user.id.split('-').pop()}`,
            p.user.teamName,
            p.user.email,
            p.user.mode,
            p.user.mentorName,
            p.user.country,
            p.domains.join('; '),
            p.status,
            p.paperUrl,
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Accepted & Registered Papers</h2>
                    <p className="text-xs text-slate-500 mt-1">Teams that have been accepted or fully registered.</p>
                </div>
                <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
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
                            <tr key={paper.id} className="hover:bg-slate-50/50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{paper.user.teamName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">ID: {paper.id.split('-').pop()}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-600">{paper.user.mentorName}</div>
                                    <div className="text-xs text-slate-400">{paper.user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase
                                        ${paper.status === 'REGISTERED' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}
                                    `}>
                                        {paper.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${paper.user.mode === 'ONLINE' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {paper.user.mode}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {paper.adminTier || '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3 text-xs font-bold">
                                        <a href={paper.paperUrl} target="_blank" className="text-blue-600 hover:underline">Paper</a>
                                        {paper.paymentScreenshotUrl && (
                                            <a href={paper.paymentScreenshotUrl} target="_blank" className="text-emerald-600 hover:underline">Payment</a>
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
    );
};
