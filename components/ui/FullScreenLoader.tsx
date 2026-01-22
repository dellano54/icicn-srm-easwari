"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
    message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message = "Processing..." }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/80 z-[9999] flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
            <p className="text-white text-lg font-bold">{message}</p>
        </div>
    );
};
