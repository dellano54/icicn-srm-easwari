"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, LogIn, FileText } from 'lucide-react';
import { useState } from 'react';
import { PdfModal } from '@/components/PdfModal';

export const Hero = () => {
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>

        {/* Brochure Background Elements - Left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
          <div className="relative w-80 sm:w-96 md:w-[420px] h-96 sm:h-[480px] md:h-[560px] transform -rotate-12">
            <Image 
              src="/brochure1.png" 
              alt="Brochure 1" 
              fill
              className="object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Brochure Background Elements - Right */}
        <div className="absolute right-0 top-1/3 opacity-60 pointer-events-none">
          <div className="relative w-80 sm:w-96 md:w-[420px] h-96 sm:h-[480px] md:h-[560px] transform rotate-12">
            <Image 
              src="/brochure2.png" 
              alt="Brochure 2" 
              fill
              className="object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="reveal-text">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
              International Conference
            </span>
          </div>
          
          <h1 className="reveal-text text-5xl sm:text-8xl md:text-[10rem] font-extrabold tracking-tighter text-slate-900 leading-[0.9]">
            ICCICN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">&apos;26</span>
          </h1>
          
          <p className="reveal-text text-xl md:text-2xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
            Computational Intelligence & Computer Networks
          </p>
          
          <div className="reveal-text pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="w-full sm:w-auto group relative inline-flex px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 justify-center"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                REGISTER NOW
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <button
              onClick={() => setIsBrochureModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold text-lg rounded-full hover:border-blue-400 hover:text-blue-600 transition-all shadow-lg"
            >
              <FileText className="w-5 h-5" />
              View Brochure
            </button>

            <Link 
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold text-lg rounded-full hover:border-blue-400 hover:text-blue-600 transition-all shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Team Login
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
           <ChevronDown className="w-6 h-6" />
        </div>

        <PdfModal 
          isOpen={isBrochureModalOpen} 
          onClose={() => setIsBrochureModalOpen(false)} 
          pdfPath="/IT-Trifold.pdf" 
        />
      </section>
  );
};

