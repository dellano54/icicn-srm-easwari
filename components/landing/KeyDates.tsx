export const KeyDates = () => {
    const dates = [
        { label: "Paper Submission", date: "25 FEB", year: "2026" },
        { label: "Acceptance Notification", date: "28 FEB", year: "2026" },
        { label: "Camera Ready Submission", date: "05 MAR", year: "2026" },
        { label: "Conference Day 1", date: "27 MAR", year: "2026", primary: true },
        { label: "Conference Day 2", date: "28 MAR", year: "2026", primary: true },
    ];

    return (
      <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-900 tracking-tight uppercase">Important Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                {dates.map((item, index) => (
                    <div 
                        key={index} 
                        className={`p-6 rounded-2xl shadow-xl shadow-slate-200/40 scale-reveal ${item.primary ? 'bg-slate-900 text-white shadow-blue-500/10' : 'bg-white text-slate-900'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className={`${item.primary ? 'text-blue-400' : 'text-blue-600'} font-bold text-xs mb-2 uppercase tracking-wide`}>{item.label}</div>
                        <div className="text-3xl font-extrabold mb-1">{item.date}</div>
                        <div className={`${item.primary ? 'text-slate-400' : 'text-slate-400'} text-xs font-medium`}>{item.year}</div>
                    </div>
                ))}
            </div>
          </div>
      </section>
    );
  };
