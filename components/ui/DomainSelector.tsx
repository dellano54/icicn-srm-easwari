"use client";

import React from 'react';
import { DOMAINS } from '@/lib/constants';
import { Check } from 'lucide-react';

interface DomainSelectorProps {
  selectedDomains: string[];
  onChange: (domains: string[]) => void;
  error?: string | string[];
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({ 
  selectedDomains, 
  onChange,
  error
}) => {
  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      onChange(selectedDomains.filter(d => d !== domain));
    } else {
      onChange([...selectedDomains, domain]);
    }
  };

  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <label className="block text-sm font-semibold text-slate-700">
          Project Domains (Select all that apply)
          <span className="text-blue-500 ml-1">*</span>
        </label>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
            {selectedDomains.length} Selected
        </span>
      </div>
      
      <div className={`p-1.5 md:p-4 rounded-2xl border transition-all duration-300 ${errorMessage ? 'border-red-300 bg-red-50/20' : 'border-slate-200 bg-white shadow-inner shadow-slate-50'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 max-h-[320px] overflow-y-auto custom-scrollbar">
          {DOMAINS.map((domain) => {
            const isSelected = selectedDomains.includes(domain);
            return (
              <button
                key={domain}
                type="button"
                onClick={() => toggleDomain(domain)}
                className={`flex items-center text-left p-3 rounded-xl transition-all duration-200 border transform active:scale-[0.98] touch-manipulation group
                  ${isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 z-10' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mr-3 transition-colors
                    ${isSelected ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-100'}
                `}>
                    {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400"></div>
                    )}
                </div>
                <span className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                    {domain}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {errorMessage && (
         <p className="mt-2 text-xs text-red-500 font-medium flex items-center">
            {errorMessage}
        </p>
      )}
    </div>
  );
};
