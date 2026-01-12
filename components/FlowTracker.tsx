import React, { useMemo } from 'react';

interface FlowTrackerProps {
  currentView: 'landing' | 'register' | 'login' | 'dashboard' | 'payment';
  hasPaid: boolean;
}

export const FlowTracker: React.FC<FlowTrackerProps> = ({ currentView, hasPaid }) => {
  const steps = [
    { id: 'start', label: 'Start', views: ['landing', 'login'], icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    )},
    { id: 'register', label: 'Registration', views: ['register'], icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'status', label: 'Review Status', views: ['dashboard'], icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )},
    { id: 'payment', label: 'Payment', views: ['payment'], icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: 'complete', label: 'Confirmation', views: ['dashboard_paid'], icon: (active: boolean) => (
       <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
    )}, 
  ];

  const currentStepIndex = useMemo(() => {
    if (currentView === 'dashboard' && hasPaid) return 4; // Complete
    if (currentView === 'dashboard') return 2; // Status/Review
    
    // Find index based on view
    const index = steps.findIndex(s => s.views.includes(currentView));
    return index === -1 ? 0 : index;
  }, [currentView, hasPaid]);

  return (
    <>
      {/* MOBILE / TABLET: Top Horizontal Bar */}
      <div className="lg:hidden w-full px-4 py-4 animate-fade-in-up sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="relative flex justify-between items-center max-w-lg mx-auto">
             {/* Progress Background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 rounded-full -translate-y-1/2 -z-10"></div>
            {/* Animated Progress Line */}
            <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-600 rounded-full -translate-y-1/2 -z-10 transition-all duration-700"
                style={{ width: `calc(${currentStepIndex / (steps.length - 1)} * 100%)` }}
            ></div>

            {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                    <div key={step.id} className="relative group">
                        <div 
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                ${isActive ? 'bg-white border-blue-600 scale-110 shadow-lg shadow-blue-500/20' : ''}
                                ${isCompleted ? 'bg-blue-600 border-blue-600' : ''}
                                ${!isActive && !isCompleted ? 'bg-slate-50 border-slate-200' : ''}
                            `}
                        >
                            {isCompleted ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{index + 1}</span>
                            )}
                        </div>
                        {/* Mobile Label (Only Active) */}
                        {isActive && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-fade-in-up">
                                {step.label}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

      {/* DESKTOP: Left Vertical Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 z-50 flex-col py-10 px-6 shadow-2xl shadow-slate-200/50">
          <div className="mb-12 pl-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tighter">
                ICICN <span className="text-blue-600">'26</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-medium">Registration Portal</p>
          </div>

          <div className="relative flex-grow flex flex-col justify-center space-y-0">
             {/* Vertical Progress Line Background */}
             <div className="absolute left-[19px] top-6 bottom-20 w-0.5 bg-slate-100 -z-10"></div>
             
             {/* Animated Vertical Progress Line */}
             <div 
                className="absolute left-[19px] top-6 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-600 -z-10 transition-all duration-700 ease-out"
                style={{ height: `calc(${currentStepIndex / (steps.length - 1)} * (100% - 7rem))` }}
             ></div>

             {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                    <div key={step.id} className="flex items-center group py-6 relative">
                        {/* Dot / Icon Container */}
                        <div 
                            className={`
                                w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 z-10 mr-4 shrink-0
                                ${isActive ? 'bg-white border-blue-500 shadow-xl shadow-blue-500/20 scale-110' : ''}
                                ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent' : ''}
                                ${!isActive && !isCompleted ? 'bg-slate-50 border-slate-200 group-hover:border-blue-200' : ''}
                            `}
                        >
                            {isCompleted ? (
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                step.icon(isActive)
                            )}
                        </div>

                        {/* Label */}
                        <div className={`transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                            <span 
                                className={`
                                    text-sm font-bold uppercase tracking-wider block transition-colors duration-300
                                    ${isActive ? 'text-slate-900' : isCompleted ? 'text-slate-600' : 'text-slate-400'}
                                `}
                            >
                                {step.label}
                            </span>
                            {isActive && (
                                <span className="text-xs text-blue-500 font-medium animate-pulse">In Progress...</span>
                            )}
                        </div>
                    </div>
                );
             })}
          </div>

          <div className="pt-8 border-t border-slate-100 text-center">
             <p className="text-[10px] text-slate-400">Need Assistance?</p>
             <a href="mailto:support@icicn.org" className="text-xs font-bold text-blue-600 hover:text-blue-700">Contact Support</a>
          </div>
      </aside>
    </>
  );
};