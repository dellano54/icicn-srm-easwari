"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '@/app/actions/reviewer';
import { useLoading } from '@/contexts/LoadingContext';

interface ReviewFormProps {
    reviewId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ reviewId }) => {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoading();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        showLoader('Submitting review...');
        
        await submitReview(reviewId, formData);
        router.refresh();
        hideLoader();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Review Points</label>
                <textarea 
                    name="feedback" 
                    required 
                    placeholder="Please provide specific feedback on technical quality, originality, and clarity..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[150px] resize-y"
                ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Decision</label>
                    <select name="decision" className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                        <option value="ACCEPT">Accept Paper</option>
                        <option value="REJECT">Reject Paper</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Recommended Tier (if Accepted)</label>
                    <select name="tier" className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                        <option value="TIER_1">Tier 1 (High Quality / Journal)</option>
                        <option value="TIER_2">Tier 2 (Conference)</option>
                        <option value="TIER_3">Tier 3 (Poster)</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 hover:shadow-blue-500/20 transition-all cursor-pointer">
                Submit Final Review
            </button>
        </form>
    );
};
