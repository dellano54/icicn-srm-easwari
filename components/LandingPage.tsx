import React, { useEffect, useRef } from 'react';
import { DOMAINS } from '../constants';

interface LandingPageProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRegisterClick, onLoginClick }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-text, .scale-reveal');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-extrabold text-slate-900 tracking-tighter">
          ICICN<span className="text-blue-600">'26</span>
        </div>
        <button 
          onClick={onLoginClick}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 font-semibold text-sm hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
          Team Login
        </button>
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="reveal-text">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
              International Conference
            </span>
          </div>
          
          <h1 className="reveal-text text-8xl md:text-[10rem] font-extrabold tracking-tighter text-slate-900 leading-[0.9]">
            ICICN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">'26</span>
          </h1>
          
          <p className="reveal-text text-xl md:text-2xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
            Computational Intelligence & Computer Networks
          </p>
          
          <div className="reveal-text pt-8">
            <button 
              onClick={onRegisterClick}
              className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                REGISTER NOW
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* SECTION 2: ABOUT / PARALLAX */}
      <section className="relative py-32 bg-slate-900 text-white clip-diagonal overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 reveal-text">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Where <span className="text-blue-400">Innovation</span> Meets <span className="text-indigo-400">Reality</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                    Join us at <strong>Easwari Engineering College</strong> for a groundbreaking exploration of the future. ICICN '26 brings together the brightest minds in AI, Networking, and Computational Intelligence.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="border-l-2 border-blue-500 pl-6">
                        <div className="text-3xl font-bold text-white mb-1">2</div>
                        <div className="text-sm text-slate-400 uppercase tracking-widest">Days of Innovation</div>
                    </div>
                    <div className="border-l-2 border-indigo-500 pl-6">
                        <div className="text-3xl font-bold text-white mb-1">50+</div>
                        <div className="text-sm text-slate-400 uppercase tracking-widest">Global Speakers</div>
                    </div>
                </div>
            </div>
            
            <div className="relative scale-reveal">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Organized By</h3>
                    <h4 className="text-2xl font-bold mb-2">Department of IT</h4>
                    <p className="text-slate-400 mb-6">Easwari Engineering College</p>
                    <div className="h-px bg-slate-700 w-full mb-6"></div>
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">In Collaboration With</h3>
                    <h4 className="text-xl font-bold">Society for Electronic Transactions and Security</h4>
                </div>
            </div>
         </div>
      </section>

      {/* SECTION 3: CALL FOR PAPERS MARQUEE */}
      <section className="py-24 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 mb-12 text-center reveal-text">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Call for Papers</h2>
              <p className="text-slate-500 text-lg">Submissions invited across multiple cutting-edge domains</p>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div className="flex animate-marquee whitespace-nowrap py-4">
                {[...DOMAINS, ...DOMAINS].map((domain, i) => (
                    <div key={i} className="inline-block px-4">
                        <span className="inline-block px-8 py-4 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xl font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-default">
                            {domain}
                        </span>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* SECTION 4: KEY DATES */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal">
                    <div className="text-blue-600 font-bold text-lg mb-2 uppercase tracking-wide">Paper Submission</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">15 FEB</div>
                    <div className="text-slate-400 font-medium">2026</div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="text-indigo-600 font-bold text-lg mb-2 uppercase tracking-wide">Notification</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">17 FEB</div>
                    <div className="text-slate-400 font-medium">2026</div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal" style={{ transitionDelay: '200ms' }}>
                    <div className="text-emerald-600 font-bold text-lg mb-2 uppercase tracking-wide">Camera Ready</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">20 FEB</div>
                    <div className="text-slate-400 font-medium">2026</div>
                </div>
            </div>
          </div>
      </section>
    </div>
  );
};