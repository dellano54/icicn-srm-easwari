"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, LayoutDashboard, CheckCircle, XCircle, Users, CreditCard, Download, Activity, AlertCircle, LogOut, FileArchive } from 'lucide-react';
import { logout } from '@/app/actions/auth';

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
  revenue: { inr: number; usd: number };
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}

const StatsCard = ({ title, value, icon: Icon, colorClass, bgClass }: StatsCardProps) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-xl font-extrabold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
    </div>
);

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ 
    children, 
    pendingCount, 
    paymentCount,
    acceptedCount,
    rejectedCount,
    totalCount,
    revenue
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'payments' | 'accepted' | 'rejected'>('overview');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh
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

    const tabs = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'teams', label: 'All Teams', icon: Users },
        { id: 'payments', label: 'Payment History', icon: CreditCard },
        { id: 'accepted', label: 'Accepted', icon: CheckCircle },
        { id: 'rejected', label: 'Rejected', icon: XCircle },
    ] as const;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 font-sans">
             <div className="w-full max-w-[1920px] mx-auto space-y-8">
                
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
                        <p className="text-slate-500 text-sm">Conference Management System</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleRefresh}
                            className="h-10 w-10 flex items-center justify-center bg-white text-slate-500 rounded-lg border border-slate-200 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                            title="Refresh Data"
                        >
                            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/api/admin/download-all'}
                            className="h-10 px-4 flex items-center gap-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <FileArchive className="w-4 h-4" />
                            Download ZIP
                        </button>
                        <button 
                            onClick={() => window.location.href = '/api/admin/export'}
                            className="h-10 px-4 flex items-center gap-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button 
                            onClick={() => logout()}
                            className="h-10 px-4 flex items-center gap-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-50 transition-all shadow-sm active:scale-95"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Top Stats Row - Always Visible */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatsCard 
                        title="Total Teams" 
                        value={totalCount} 
                        icon={Users} 
                        colorClass="text-blue-600" 
                        bgClass="bg-blue-50" 
                    />
                    <StatsCard 
                        title="Pending Review" 
                        value={pendingCount} 
                        icon={Activity} 
                        colorClass="text-amber-500" 
                        bgClass="bg-amber-50" 
                    />
                    <StatsCard 
                        title="Verify Payment" 
                        value={paymentCount} 
                        icon={AlertCircle} 
                        colorClass="text-purple-500" 
                        bgClass="bg-purple-50" 
                    />
                    <StatsCard 
                        title="Accepted" 
                        value={acceptedCount} 
                        icon={CheckCircle} 
                        colorClass="text-emerald-600" 
                        bgClass="bg-emerald-50" 
                    />
                    <StatsCard 
                        title="Rejected" 
                        value={rejectedCount} 
                        icon={XCircle} 
                        colorClass="text-red-500" 
                        bgClass="bg-red-50" 
                    />
                    <StatsCard 
                        title="Revenue" 
                        value={`₹${revenue.inr.toLocaleString()} | $${revenue.usd.toLocaleString()}`} 
                        icon={CreditCard} 
                        colorClass="text-slate-700" 
                        bgClass="bg-slate-100" 
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-slate-200">
                    <div className="flex gap-6 overflow-x-auto pb-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold transition-all relative whitespace-nowrap
                                        ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
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
