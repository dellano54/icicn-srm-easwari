import React, { useRef, useState, useEffect } from 'react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  helperText?: string;
  value?: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  onChange, 
  required,
  helperText,
  value
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with external value (for demo auto-fill)
  useEffect(() => {
    if (value) {
      setFileName(value.name);
    } else {
      setFileName(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    processFile(file);
  };

  const processFile = (file: File | null) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    processFile(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      
      <div 
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer overflow-hidden flex flex-col items-center justify-center w-full min-h-[9rem] rounded-xl transition-all duration-300 border-[1.5px] border-dashed
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 shadow-inner' 
          : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 hover:shadow-md'
        } ${fileName ? 'border-solid border-blue-200 bg-blue-50/30' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative z-10">
          {fileName ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 truncate max-w-[240px] px-2 py-1 bg-white/60 rounded-md">
                {fileName}
              </p>
              <p className="text-xs text-blue-500 mt-1 font-medium cursor-pointer hover:underline">Change File</p>
            </div>
          ) : (
            <>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="mb-1 text-sm text-slate-600 font-medium">
                <span className="text-blue-600 font-bold hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 font-medium">PDF only (Max 6 pages)</p>
            </>
          )}
        </div>
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
        />
      </div>
      {helperText && <p className="mt-2 text-xs text-slate-500 pl-1">{helperText}</p>}
    </div>
  );
};