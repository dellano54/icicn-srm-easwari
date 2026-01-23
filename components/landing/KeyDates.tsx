export const KeyDates = () => {
    return (
      <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal">
                    <div className="text-blue-600 font-bold text-lg mb-2 uppercase tracking-wide">Conference Day 1</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">27 MAR</div>
                    <div className="text-slate-400 font-medium">2026</div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="text-indigo-600 font-bold text-lg mb-2 uppercase tracking-wide">Conference Day 2</div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-2">28 MAR</div>
                    <div className="text-slate-400 font-medium">2026</div>
                </div>
            </div>
          </div>
      </section>
    );
  };
