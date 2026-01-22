"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Paper, User, Member, Review } from '@prisma/client';
import { X, ExternalLink, Loader2, User as UserIcon, MapPin, Globe, Award, FileText, CreditCard } from 'lucide-react';
import { getTeamDetails } from '@/app/actions/admin';

type TeamDetails = User & {
    paper: (Paper & { reviews: Review[] }) | null;
    members: Member[];
};

interface TeamDetailsModalProps {
    teamId: string;
    onClose: () => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ teamId, onClose }) => {
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const details = await getTeamDetails(teamId);
            setTeam(details as TeamDetails);
            setIsLoading(false);
        };
        fetchDetails();
    }, [teamId]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle hydration for portal
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-reveal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    {isLoading || !team ? (
                        <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800">{team.teamName}</h2>
                                <span className="bg-slate-100 text-slate-500 text-xs font-mono px-2 py-1 rounded-md border border-slate-200">
                                    {team.id}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {team.email}
                            </p>
                        </div>
                    )}
                    <button 
                        onClick={onClose} 
                        className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                    {isLoading || !team ? (
                        <div className="flex flex-col justify-center items-center h-96">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-slate-400 font-medium">Loading details...</p>
                        </div>
                    ) : (
                        <div className="p-8 space-y-8">
                            
                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Award className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</h3>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 capitalize pl-1">{team.paper?.status?.replace(/_/g, ' ').toLowerCase() || 'N/A'}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</h3>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 pl-1">{team.mode || 'Pending'}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Country</h3>
                                    </div>
                                    <p className="text-lg font-bold text-slate-800 pl-1">{team.country}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                            <Award className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tier</h3>
                                    </div>
                                    <div className="text-lg font-bold text-slate-800 pl-1">
                                        {team.paper?.adminTier ? (
                                            team.paper.adminTier.replace('TIER_', 'Tier ')
                                        ) : (
                                            (() => {
                                                const validTiers = team.paper?.reviews?.filter(r => r.decision === 'ACCEPT' && r.tier).map(r => parseInt(r.tier!.replace('TIER_', ''))) || [];
                                                if (validTiers.length > 0) {
                                                    const avg = validTiers.reduce((a, b) => a + b, 0) / validTiers.length;
                                                    const rounded = Math.round(avg);
                                                    const tierNum = rounded <= 1 ? 1 : (rounded === 2 ? 2 : 3);
                                                    return <span className="text-blue-600 font-medium text-base">Rec: Tier {tierNum}</span>;
                                                }
                                                return <span className="text-slate-400 font-normal italic">Pending</span>;
                                            })()
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Left Column: Reviewer Feedback & Documents */}
                                <div className="lg:col-span-2 space-y-8">
                                    
                                    {/* Reviewer Feedback Section */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-slate-500" />
                                                Reviewer Feedback
                                            </h3>
                                            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                                {team.paper?.reviews?.filter(r => r.isCompleted).length || 0} Submitted
                                            </span>
                                        </div>
                                        
                                        <div className="p-6 space-y-4">
                                            {team.paper?.reviews && team.paper.reviews.filter(r => r.isCompleted).length > 0 ? (
                                                team.paper.reviews.filter(r => r.isCompleted).map((review, i) => (
                                                    <div key={review.id || i} className={`relative p-5 rounded-xl border-l-4 ${review.decision === 'ACCEPT' ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-red-500 bg-red-50/30'} border border-slate-100`}>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                                    R{i + 1}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reviewer {i + 1}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${review.decision === 'ACCEPT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {review.decision}
                                                                </span>
                                                                {review.decision === 'ACCEPT' && (
                                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                                                        {review.tier ? review.tier.replace('_', ' ') : 'No Tier'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-slate-700 leading-relaxed pl-1">&quot;{review.feedback}&quot;</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <p className="text-slate-400 text-sm">No reviews completed yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Documents & Payment */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-slate-500" />
                                                Documents & Payment
                                            </h3>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Final Papers */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Files</h4>
                                                <div className="space-y-2">
                                                    {team.paper?.cameraReadyPaperUrl ? (
                                                        <a href={`/api/file/paper/${team.paper.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-white p-1.5 rounded-lg border border-slate-100 text-blue-500">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Camera-Ready Paper</span>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                                        </a>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 border-dashed text-slate-400 text-sm text-center">Pending Upload</div>
                                                    )}

                                                    {team.paper?.plagiarismReportUrl ? (
                                                        <a href={`/api/file/plagiarism/${team.paper.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-white p-1.5 rounded-lg border border-slate-100 text-blue-500">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Plagiarism Report</span>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                                        </a>
                                                    ) : (
                                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 border-dashed text-slate-400 text-sm text-center">Pending Upload</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Proof */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Verification</h4>
                                                
                                                {/* Payer Name Box */}
                                                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Payer Name</p>
                                                        <p className="text-base font-bold text-slate-800">{team.paper?.paymentSenderName || 'Not Provided'}</p>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg text-blue-600">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {team.paper?.paymentScreenshotUrl ? (
                                                    <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                                        <div className="relative h-80 w-full">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img 
                                                                src={`/api/file/payment/${team.paper.id}`}
                                                                alt="Payment Proof" 
                                                                className="w-full h-full object-contain p-2"
                                                            />
                                                        </div>
                                                        <a 
                                                            href={`/api/file/payment/${team.paper.id}`}
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                        >
                                                            <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                                                <ExternalLink className="w-3 h-3" /> View Full
                                                            </span>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="h-32 rounded-xl bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 gap-2">
                                                        <CreditCard className="w-6 h-6 opacity-50" />
                                                        <span className="text-xs">No payment proof</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Members & Domains */}
                                <div className="space-y-8">
                                    
                                    {/* Members List */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-slate-500" />
                                                Team Members
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-slate-50">
                                            {team.members.map(member => (
                                                <div key={member.id} className="p-4 hover:bg-slate-50 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                                        {member.isLead && <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">LEAD</span>}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mb-2">{member.email}</p>
                                                    <div className="text-[11px] text-slate-400 space-y-0.5">
                                                        <p>{member.college}</p>
                                                        <p>{member.city}, {member.country}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Domains Tags */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-slate-500" />
                                                Domains
                                            </h3>
                                        </div>
                                        <div className="p-5 flex flex-wrap gap-2">
                                            {team.paper?.domains ? (
                                                team.paper.domains.split(',').map(d => (
                                                    <span key={d} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                                        {d}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">No domains listed</span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
