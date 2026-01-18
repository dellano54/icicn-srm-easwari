"use client";

import React from 'react';
import { User, Paper } from '@prisma/client';
import { Check, Clock, Users, MapPin, Monitor } from 'lucide-react';

type UserWithPaper = User & {
    paper: Paper | null;
    members: { id: string }[];
};

interface TeamsTableProps {
    teams: UserWithPaper[];
}

export const TeamsTable: React.FC<TeamsTableProps> = ({ teams }) => {
    return (
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
                            <th className="p-4">Team Details</th>
                            <th className="p-4">Mentor</th>
                            <th className="p-4">Mode</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teams.map(team => (
                            <tr key={team.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800 text-sm">{team.teamName}</div>
                                    <div className="text-xs text-slate-500">{team.email}</div>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                        <Users className="w-3 h-3"/>
                                        {team.members.length} Members
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-slate-700">{team.mentorName}</div>
                                    <div className="text-[10px] text-slate-500">{team.mentorDept}</div>
                                </td>
                                <td className="p-4">
                                    {team.mode === 'ONLINE' ? (
                                        <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">
                                            <Monitor className="w-3 h-3"/> Online
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-[10px] font-bold">
                                            <MapPin className="w-3 h-3"/> Offline
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
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
    );
};
