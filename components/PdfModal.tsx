"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** kept for compatibility but not used when rendering images */
  pdfPath?: string;
}

export const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const images = ['/brochure1.png', '/brochure2.png'];
  const numPages = images.length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setIsLoadingImage(true);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !hasMounted) return null;

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/50"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="font-bold text-slate-900 text-base">Conference Brochure</h2>
              <p className="text-xs text-slate-500">Page {pageNumber} of {numPages}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 transition-all shadow-sm"
              aria-label="Close brochure"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-slate-50/30 relative overflow-auto">
          {isLoadingImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50/30">
              <div className="animate-pulse flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg"></div>
                <p className="text-slate-500 font-medium">Loading brochure...</p>
              </div>
            </div>
          )}

          <Image
            src={images[pageNumber - 1]}
            alt={`Brochure page ${pageNumber}`}
            width={900}
            height={1200}
            className="w-full h-full object-cover"
            onLoadingComplete={() => setIsLoadingImage(false)}
            priority
          />
        </div>
      </div>
    </div>
  );
};
