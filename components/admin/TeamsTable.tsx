"use client";

import React, { useState } from 'react';
import { User, Paper, Member } from '@prisma/client';
import { Users, MapPin, Monitor } from 'lucide-react';
import { TeamDetailsModal } from './TeamDetailsModal';

type UserWithDetails = User & {
    paper: Paper | null;
    members: Member[];
};

interface TeamsTableProps {
    teams: UserWithDetails[];
}

export const TeamsTable: React.FC<TeamsTableProps> = ({ teams }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Registered Teams</h2>
                        <p className="text-xs text-slate-500 mt-1">All registered users and their status</p>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {teams.length} Teams
                    </span>
                </div>
                
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold tracking-wider sticky top-0 z-10">
                                <th className="p-4">Team ID</th>
                                <th className="p-4">Team Details</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {teams.map(team => (
                                <tr key={team.id} onClick={() => setSelectedTeamId(team.id)} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="p-4">
                                        <div className="text-sm font-mono text-slate-500">{team.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-lg">{team.teamName}</div>
                                        <div className="text-sm text-slate-500">{team.email}</div>
                                        <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
                                            <Users className="w-4 h-4"/>
                                            {team.members.length} Members
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {team.mode ? (
                                            team.mode === 'ONLINE' ? (
                                                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-bold">
                                                    <Monitor className="w-4 h-4"/> Online
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm font-bold">
                                                    <MapPin className="w-4 h-4"/> Offline
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-sm text-slate-400">Not Set</div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full uppercase tracking-wider
                                            ${team.paper?.status === 'REGISTERED' ? 'bg-emerald-100 text-emerald-700' :
                                              team.paper?.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                              'bg-amber-100 text-amber-800'}
                                        `}>
                                            {team.paper?.status?.replace('_', ' ') || 'NO PAPER'}
                                        </span>
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
