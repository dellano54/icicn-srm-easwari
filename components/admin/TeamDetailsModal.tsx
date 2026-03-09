"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Paper, User, Member, Review } from '@prisma/client';
import { X, ExternalLink, Loader2, User as UserIcon, MapPin, Globe, Award, FileText, CreditCard, Calendar, Check, AlertCircle, ZoomIn } from 'lucide-react';
import { getTeamDetails } from '@/app/actions/admin';
import { bulkVerifyPayment } from '@/app/actions/bulk';
import { declinePayment } from '@/app/actions/payment';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/utils';

type TeamDetails = User & {
    paper: (Paper & { reviews: Review[] }) | null;
    members: Member[];
};

interface TeamDetailsModalProps {
    teamId: string;
    onClose: () => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ teamId, onClose }) => {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoading();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const details = await getTeamDetails(teamId);
            setTeam(details as TeamDetails);
            setIsLoading(false);
        };
        fetchDetails();
    }, [teamId]);

    const handleVerify = async () => {
        if (!team?.paper) return;
        showLoader('Verifying payment...');
        await bulkVerifyPayment([team.paper.id]);
        onClose();
        router.refresh();
        hideLoader();
    };

    const handleDecline = async () => {
        if (!team?.paper) return;
        if (!confirm('Are you sure you want to decline this payment proof?')) return;
        showLoader('Declining payment...');
        await declinePayment(team.paper.id);
        onClose();
        router.refresh();
        hideLoader();
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (previewImage) setPreviewImage(null);
                else onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, previewImage]);

    // Handle hydration for portal
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const modalContent = (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-2 md:p-4 animate-fade-in" onClick={onClose}>
                <div 
                    className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-scale-reveal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        {isLoading || !team ? (
                            <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                        ) : (
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{team.teamName}</h2>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] md:text-xs font-mono px-2 py-1 rounded-md border border-slate-200 shrink-0">
                                        {team.id.split('-').pop()}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-sm text-slate-500 mt-1 flex items-center gap-2 truncate">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 shrink-0"></span>
                                    {team.email}
                                </p>
                            </div>
                        )}
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-2"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                        {isLoading || !team ? (
                            <div className="flex flex-col justify-center items-center h-64 md:h-96">
                                <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin mb-4" />
                                <p className="text-slate-400 text-sm md:text-base font-medium">Loading details...</p>
                            </div>
                        ) : (
                            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                                
                                {/* Key Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                                            <h3 className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Status</h3>
                                        </div>
                                        <p className="text-sm md:text-lg font-bold text-slate-800 capitalize">{team.paper?.status?.replace(/_/g, ' ').toLowerCase() || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                                            <h3 className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</h3>
                                        </div>
                                        <p className="text-sm md:text-lg font-bold text-slate-800">{team.mode || 'Pending'}</p>
                                    </div>
                                    <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                                            <h3 className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Country</h3>
                                        </div>
                                        <p className="text-sm md:text-lg font-bold text-slate-800">{team.country}</p>
                                    </div>
                                    <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
                                            <h3 className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Tier</h3>
                                        </div>
                                        <div className="text-sm md:text-lg font-bold text-slate-800">
                                            {team.paper?.adminTier ? (
                                                team.paper.adminTier.replace('TIER_', 'Tier ')
                                            ) : (
                                                <span className="text-slate-400 font-normal italic">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                    
                                    {/* Left Column: Feedback & Documents */}
                                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                        
                                        {/* Payment Action Bar (Only for payment verification) */}
                                        {team.paper?.status === 'PAYMENT_VERIFICATION' && (
                                            <div className="bg-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-lg shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce-in">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                        <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base md:text-lg">Verify Registration</h3>
                                                        <p className="text-blue-100 text-xs">Review proof and confirm seat</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full md:w-auto">
                                                    <button 
                                                        onClick={handleDecline}
                                                        className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm transition-all border border-white/20 flex items-center justify-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" /> Decline
                                                    </button>
                                                    <button 
                                                        onClick={handleVerify}
                                                        className="flex-[1.5] md:flex-none px-6 md:px-8 py-2 md:py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" /> Approve
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Reviewer Feedback Section */}
                                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-5 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-500" />
                                                    Reviewer Feedback
                                                </h3>
                                            </div>
                                            
                                            <div className="p-4 md:p-6 space-y-4">
                                                {team.paper?.reviews && team.paper.reviews.filter(r => r.isCompleted).length > 0 ? (
                                                    team.paper.reviews.filter(r => r.isCompleted).map((review, i) => (
                                                        <div key={review.id} className={`p-4 rounded-xl border-l-4 ${review.decision === 'ACCEPT' ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-red-500 bg-red-50/30'} border border-slate-100`}>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase">Reviewer {i + 1}</span>
                                                                <div className="flex gap-1.5">
                                                                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${review.decision === 'ACCEPT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {review.decision}
                                                                    </span>
                                                                    {review.tier && (
                                                                        <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                                            {review.tier.replace('_', ' ')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs md:text-sm text-slate-700 italic">&quot;{review.feedback}&quot;</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                        <p className="text-slate-400 text-xs md:text-sm">No reviews completed yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Documents & Payment */}
                                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-5 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50/50">
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                                    Payment & Assets
                                                </h3>
                                            </div>
                                            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Proof</h4>
                                                    {team.paper?.paymentScreenshotUrl ? (
                                                        <div className="space-y-3">
                                                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-900 flex items-center justify-center cursor-zoom-in" onClick={() => setPreviewImage(`/api/file/payment/${team.paper?.id}`)}>
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img 
                                                                    src={`/api/file/payment/${team.paper.id}`}
                                                                    alt="Payment Proof" 
                                                                    className="w-full h-full object-contain group-hover:opacity-80 transition-opacity"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                                    <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                                        <ZoomIn className="w-5 h-5 text-slate-700" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Payer Name</span>
                                                                    <UserIcon className="w-3 h-3 text-blue-500" />
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-700">{team.paper.paymentSenderName || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-40 rounded-xl bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 gap-2">
                                                            <AlertCircle className="w-6 h-6 opacity-30" />
                                                            <span className="text-xs">No proof uploaded</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Files</h4>
                                                    <div className="space-y-2">
                                                        {team.paper?.cameraReadyPaperUrl ? (
                                                            <a href={`/api/file/paper/${team.paper.id}`} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                                    <span className="text-xs md:text-sm font-bold text-blue-700">Camera-Ready Paper</span>
                                                                </div>
                                                                <ExternalLink className="w-4 h-4 text-blue-400" />
                                                            </a>
                                                        ) : (
                                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs text-center italic">Paper Pending</div>
                                                        )}
                                                        {team.paper?.plagiarismReportUrl ? (
                                                            <a href={`/api/file/plagiarism/${team.paper.id}`} target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors group">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="w-4 h-4 text-emerald-600" />
                                                                    <span className="text-xs md:text-sm font-bold text-emerald-700">Plagiarism Report</span>
                                                                </div>
                                                                <ExternalLink className="w-4 h-4 text-emerald-400" />
                                                            </a>
                                                        ) : (
                                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs text-center italic">Report Pending</div>
                                                        )}
                                                    </div>
                                                    {team.paper?.updatedAt && (
                                                        <div className="pt-4 border-t border-slate-100">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Last Activity</span>
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-600 mt-1">{formatDateTime(team.paper.updatedAt)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Members & Domains */}
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="px-5 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-slate-500" />
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base">Team Members</h3>
                                            </div>
                                            <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto custom-scrollbar">
                                                {team.members.map(member => (
                                                    <div key={member.id} className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <p className="font-bold text-slate-800 text-xs md:text-sm">{member.name}</p>
                                                            {member.isLead && <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">LEAD</span>}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 truncate">{member.email}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 truncate">{member.college}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                                            <h3 className="font-bold text-slate-800 text-xs md:text-sm mb-4 flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-slate-500" /> Domains
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {team.paper?.domains.split(',').map(d => (
                                                    <span key={d} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col animate-fade-in" onClick={() => setPreviewImage(null)}>
                    <div className="p-4 flex justify-end">
                        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
                    </div>
                    <div className="p-8 text-center text-white/50 text-xs font-bold uppercase tracking-widest">
                        Click anywhere to close
                    </div>
                </div>
            )}
        </>
    );

    return createPortal(modalContent, document.body);
};
