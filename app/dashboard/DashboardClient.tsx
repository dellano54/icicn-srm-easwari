"use client";

import React, { useState } from 'react';
import { User, Paper, PaperStatus } from '@prisma/client';
import { logout } from '@/app/actions/auth';
import { uploadPaymentScreenshot } from '@/app/actions/payment';
import { FEE_AMOUNT_INR, FEE_AMOUNT_USD } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { Check, Clock, Upload, X, LogOut, Loader2, QrCode } from 'lucide-react';

interface DashboardClientProps {
  user: User;
  paper: Paper;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ user, paper }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isForeign = user.country.toLowerCase() !== 'india';
  const feeAmount = isForeign ? FEE_AMOUNT_USD : FEE_AMOUNT_INR;
  const feeSymbol = isForeign ? '$' : '₹';
  
  // Status Logic
  const steps = [
    { id: 'submitted', label: 'Registration Completed', date: formatDate(paper.createdAt) },
    { id: 'reviewing', label: 'Paper Under Review', date: 'In Progress' },
    { id: 'completed', label: 'Reviewing Completed', date: 'Decision Made' }
  ];

  let currentStepIndex = 0;
  if (['UNDER_REVIEW', 'AWAITING_DECISION'].includes(paper.status)) currentStepIndex = 1;
  // If decision is made (Accepted/Rejected) or beyond, mark all review steps as completed
  if (['ACCEPTED_UNPAID', 'PAYMENT_VERIFICATION', 'REGISTERED', 'REJECTED'].includes(paper.status)) currentStepIndex = 3;

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const handlePaymentUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');

    const formData = new FormData(e.currentTarget);
    const result = await uploadPaymentScreenshot(formData);

    if (result.message) {
        setUploadError(result.message);
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Welcome back,</p>
           <h1 className="text-2xl font-bold text-slate-800">{user.teamName}</h1>
        </div>
        <button 
           onClick={() => logout()}
           className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-red-500 transition-colors flex items-center gap-2"
        >
           <LogOut className="w-4 h-4" />
           Sign Out
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Status Tracker Column */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-8">Submission Status</h2>

                {/* Vertical Stepper */}
                <div className="relative">
                    {steps.map((step, index) => {
                        const status = getStepStatus(index);
                        return (
                            <div key={step.id} className="flex gap-4 pb-12 last:pb-0 relative group">
                                {/* Connector Line */}
                                {index !== steps.length - 1 && (
                                    <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${status === 'completed' ? 'bg-blue-500' : 'bg-slate-200'} transition-colors duration-500`}></div>
                                )}
                                
                                {/* Icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500
                                    ${status === 'completed' ? 'bg-blue-500 border-blue-500 text-white' : 
                                      status === 'current' ? 'bg-white border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 
                                      'bg-slate-50 border-slate-200 text-slate-300'}
                                `}>
                                    {status === 'completed' ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-bold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pt-1">
                                    <h3 className={`font-bold text-lg ${status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>
                                        {step.label}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {status === 'upcoming' ? 'Pending...' : step.date}
                                    </p>
                                    {status === 'current' && (
                                        <div className="mt-3 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full animate-pulse">
                                            In Progress
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ACTION AREA: BASED ON STATUS */}

            {/* REJECTED */}
            {paper.status === 'REJECTED' && (
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 text-center text-slate-800 shadow-xl scale-reveal active animate-bounce-in">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4">Status Update</h3>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto">
                        We regret to inform you that your paper has not been accepted this time. We encourage you to incorporate the feedback and submit to future editions.
                    </p>
                </div>
            )}

            {/* ACCEPTED (UNPAID) */}
            {paper.status === 'ACCEPTED_UNPAID' && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-green-500/30 scale-reveal active animate-bounce-in">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-6">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4">Congratulations! 🎉</h3>
                    <p className="text-green-50 text-lg leading-relaxed max-w-lg mx-auto mb-8">
                        Your paper has been <strong>ACCEPTED</strong>. To confirm your presentation slot, please complete the payment.
                    </p>

                    <div className="bg-white rounded-xl p-6 text-slate-800 text-left">
                        <h4 className="font-bold text-lg mb-4 flex items-center">
                            <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                            Scan to Pay ({feeSymbol}{feeAmount})
                        </h4>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-40 h-40 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-xs text-slate-500 font-mono">QR CODE PLACEHOLDER</span>
                            </div>
                            <div className="flex-1 w-full">
                                <form onSubmit={handlePaymentUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Payer / UPI Name <span className="text-blue-500">*</span></label>
                                        <input 
                                            type="text" 
                                            name="payerName"
                                            placeholder="Enter Account Holder Name"
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Payment Screenshot <span className="text-blue-500">*</span></label>
                                        <input 
                                            type="file" 
                                            name="screenshot"
                                            accept="image/*"
                                            required
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isUploading}
                                        className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center"
                                    >
                                        {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify Payment"}
                                    </button>
                                    {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT VERIFICATION */}
            {paper.status === 'PAYMENT_VERIFICATION' && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Payment Verification Pending</h3>
                    <p className="text-amber-700 max-w-md mx-auto">
                        We have received your payment proof. Please allow 24-48 hours for our team to verify and confirm your registration.
                    </p>
                </div>
            )}

            {/* REGISTERED */}
            {paper.status === 'REGISTERED' && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-center text-white shadow-xl scale-reveal active animate-bounce-in">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-extrabold mb-2">Registration Confirmed</h3>
                    <p className="text-emerald-50 max-w-md mx-auto">
                        We look forward to seeing you at ICCICN '26! Your presentation slot details will be emailed shortly.
                    </p>
                </div>
            )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Paper Details</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Paper ID</div>
                        <div className="font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-600 text-xs">{paper.id.split('-').pop()}</div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Tracks</div>
                        <div className="flex flex-wrap gap-1">
                            {paper.domains.slice(0, 3).map((d, i) => (
                                <span key={i} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">{d}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Status</div>
                        <div className="font-medium text-slate-700">
                            {paper.status.replace('_', ' ')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-600 mb-4">
                    If you have questions about the review process or your status, please contact the chair.
                </p>
                <a href="mailto:chair@iccicn.org" className="text-sm font-bold text-blue-700 hover:underline">Contact Chair &rarr;</a>
            </div>
        </div>

      </div>
    </div>
  );
};
