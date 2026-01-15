import React from 'react';
import { Loader2 } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | string[];
  helperText?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  helperText, 
  isLoading = false,
  icon,
  className = '', 
  ...props 
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="w-full group">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-600">
        {label}
        {props.required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-9' : 'px-3.5'} py-2.5 bg-slate-50 border rounded-lg outline-none transition-all duration-300 ease-in-out
          placeholder:text-slate-300 text-slate-700 text-sm font-medium
          ${errorMessage 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
          </div>
        )}
      </div>
      {helperText && !errorMessage && (
        <p className="mt-1.5 text-xs text-slate-500 font-medium">{helperText}</p>
      )}
      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center">
            {errorMessage}
        </p>
      )}
    </div>
  );
};
