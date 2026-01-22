"use client";

import React, { useState } from 'react';
import { Paper, User } from '@prisma/client';
import { TeamDetailsModal } from './TeamDetailsModal';

type PaperData = Paper & { user: User };

interface RejectedPapersTableProps {
    papers: PaperData[];
}

export const RejectedPapersTable: React.FC<RejectedPapersTableProps> = ({ papers }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-red-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Rejected Submissions</h2>
                    <p className="text-xs text-slate-500 mt-1">Files have been deleted from storage.</p>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider sticky top-0 z-10">
                                <th className="p-4">Team ID</th>
                                <th className="p-4">Team</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Rejection Date</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {papers.map(paper => (
                                <tr key={paper.id} onClick={() => setSelectedTeamId(paper.userId)} className="hover:bg-slate-50/50 cursor-pointer">
                                    <td className="p-4">
                                        <div className="text-sm font-mono text-slate-500">{paper.userId}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-lg">{paper.user.teamName}</div>
                                        <div className="text-sm text-slate-400 font-mono mt-1">Domains: {paper.domains.split(',').slice(0, 2).join(', ')}...</div>
                                    </td>
                                    <td className="p-4 text-base text-slate-600">
                                        {paper.user.email}
                                    </td>
                                    <td className="p-4 text-base text-slate-500">
                                        {new Date(paper.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="inline-block px-2 py-1 rounded text-sm font-bold uppercase bg-red-100 text-red-700">
                                            Rejected
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {papers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">No rejected papers.</td>
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
