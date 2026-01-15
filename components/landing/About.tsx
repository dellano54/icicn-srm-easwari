export const About = () => {
    return (
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
    );
  };
