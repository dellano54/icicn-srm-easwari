"use client";

import React from 'react';
import { Paper, User } from '@prisma/client';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type PaperWithUser = Paper & {
    user: User;
};

interface PaymentsTableProps {
    payments: PaperWithUser[];
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Payment History</h2>
                    <p className="text-xs text-slate-500 mt-1">Verified transactions</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {payments.length} Verified
                </span>
            </div>
            
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold tracking-wider sticky top-0 z-10">
                            <th className="p-4">Team & Date</th>
                            <th className="p-4">Payer Name</th>
                            <th className="p-4">Amount (Est.)</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments.map(paper => {
                            const isForeign = paper.user.country.toLowerCase() !== 'india';
                            const amount = isForeign ? '$300' : '₹8000'; // Hardcoded based on constants for display

                            return (
                                <tr key={paper.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-sm">{paper.user.teamName}</div>
                                        <div className="text-xs text-slate-400">{formatDate(paper.updatedAt)}</div>
                                    </td>
                                    <td className="p-4">
                                        {paper.paymentSenderName ? (
                                            <div className="text-sm font-medium text-slate-700">{paper.paymentSenderName}</div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Not recorded</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-mono text-sm text-slate-600">{amount}</div>
                                        <div className="text-[10px] text-slate-400 uppercase">{isForeign ? 'Foreign' : 'Indian'}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                            <CheckCircle className="w-4 h-4" />
                                            Verified
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
