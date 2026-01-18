"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, LayoutDashboard, CheckCircle, XCircle, Users, CreditCard, Download } from 'lucide-react';

interface AdminDashboardClientProps {
  children: {
    overview: React.ReactNode;
    teams: React.ReactNode;
    payments: React.ReactNode;
    accepted: React.ReactNode;
    rejected: React.ReactNode;
  };
  pendingCount: number;
  paymentCount: number;
  acceptedCount: number;
  rejectedCount: number;
  totalCount: number;
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ 
    children, 
    pendingCount, 
    paymentCount,
    acceptedCount,
    rejectedCount,
    totalCount
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'payments' | 'accepted' | 'rejected'>('overview');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 30000);
        return () => clearInterval(interval);
    }, [router]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        window.location.href = '/api/admin/export';
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8 font-sans">
             <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Real-time conference management</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-2 rounded-lg border border-slate-200">
                            Total: {totalCount}
                        </div>
                        <button 
                            onClick={handleRefresh}
                            className="flex items-center gap-2 bg-white text-slate-600 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold border border-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm w-full md:w-auto self-start">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Overview
                        {(pendingCount + paymentCount) > 0 && (
                            <span className="bg-blue-500 text-white text-[10px] px-1.5 rounded-full ml-1">{pendingCount + paymentCount}</span>
                        )}
                    </button>
                    
                    <div className="w-px bg-slate-200 mx-1"></div>

                    <button 
                        onClick={() => setActiveTab('teams')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'teams' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <Users className="w-4 h-4" />
                        Teams
                    </button>

                    <button 
                        onClick={() => setActiveTab('payments')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'payments' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <CreditCard className="w-4 h-4" />
                        History
                    </button>

                    <div className="w-px bg-slate-200 mx-1"></div>

                    <button 
                        onClick={() => setActiveTab('accepted')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Accepted
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 rounded-full ml-1">{acceptedCount}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('rejected')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'rejected' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:bg-red-50 hover:text-red-700'}`}
                    >
                        <XCircle className="w-4 h-4" />
                        Rejected
                        <span className="bg-red-100 text-red-700 text-[10px] px-1.5 rounded-full ml-1">{rejectedCount}</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in-up">
                    {activeTab === 'overview' && children.overview}
                    {activeTab === 'teams' && children.teams}
                    {activeTab === 'payments' && children.payments}
                    {activeTab === 'accepted' && children.accepted}
                    {activeTab === 'rejected' && children.rejected}
                </div>
             </div>
        </div>
    );
};