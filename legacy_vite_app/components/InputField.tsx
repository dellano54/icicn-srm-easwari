import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
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
          ${error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 font-medium">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};