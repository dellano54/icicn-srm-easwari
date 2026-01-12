import React, { useState } from 'react';

interface DashboardPageProps {
  teamName: string;
  onLogout: () => void;
  onProceedToPayment: () => void;
  hasPaid: boolean;
  feeAmount: number;
  feeCurrency: string;
  feeSymbol: string;
}

type Status = 'submitted' | 'reviewing' | 'completed';

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
    teamName, 
    onLogout, 
    onProceedToPayment,
    hasPaid,
    feeAmount,
    feeCurrency,
    feeSymbol
}) => {
  // Mock state: user has completed reviewing
  const [currentStatus, setCurrentStatus] = useState<Status>('completed'); 
  const [showResult, setShowResult] = useState(false);
  const [isAccepted, setIsAccepted] = useState(true); // Mock result

  const steps = [
    { id: 'submitted', label: 'Registration Completed', date: 'Oct 24, 2025' },
    { id: 'reviewing', label: 'Paper Under Review', date: 'Nov 15, 2025' },
    { id: 'completed', label: 'Reviewing Completed', date: 'Feb 10, 2026' }
  ];

  const getStepStatus = (stepId: string) => {
    if (currentStatus === stepId) return 'current';
    
    const order = ['submitted', 'reviewing', 'completed'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepId);
    
    return stepIndex < currentIndex ? 'completed' : stepIndex === currentIndex ? 'current' : 'upcoming';
  };

  const handleViewStatus = () => {
    // Randomize acceptance for demo purposes (80% chance acceptance)
    const accepted = Math.random() > 0.2;
    setIsAccepted(accepted);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Welcome back,</p>
           <h1 className="text-2xl font-bold text-slate-800">{teamName}</h1>
        </div>
        <button 
           onClick={onLogout}
           className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-red-500 transition-colors"
        >
           Sign Out
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Status Tracker Column */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-8">Submission Status</h2>

                {/* Vertical Stepper */}
                <div className="relative">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex gap-4 pb-12 last:pb-0 relative group">
                                {/* Connector Line */}
                                {index !== steps.length - 1 && (
                                    <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${status === 'completed' ? 'bg-blue-500' : 'bg-slate-200'} transition-colors duration-500`}></div>
                                )}
                                
                                {/* Icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500
                                    ${status === 'completed' ? 'bg-blue-500 border-blue-500 text-white' : 
                                      status === 'current' ? 'bg-white border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 
                                      'bg-slate-50 border-slate-200 text-slate-300'}
                                `}>
                                    {status === 'completed' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <span className="text-sm font-bold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pt-1">
                                    <h3 className={`font-bold text-lg ${status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>
                                        {step.label}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {status === 'upcoming' ? 'Pending...' : step.date}
                                    </p>
                                    {status === 'current' && (
                                        <div className="mt-3 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full animate-pulse">
                                            In Progress
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Area */}
            {currentStatus === 'completed' && !showResult && !hasPaid && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white shadow-2xl shadow-slate-900/20 scale-reveal active">
                    <h3 className="text-2xl font-bold mb-3">Review Process Complete</h3>
                    <p className="text-slate-300 mb-8 max-w-md mx-auto">
                        The committee has finalized the decision for your submission. Click below to view the results.
                    </p>
                    <button 
                        onClick={handleViewStatus}
                        className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    >
                        View Acceptance Status
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                </div>
            )}

            {/* Paid Status - Top Priority if Paid */}
            {hasPaid && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-center text-white shadow-xl scale-reveal active animate-bounce-in">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-2">Registration Confirmed</h3>
                    <p className="text-emerald-50 max-w-md mx-auto">
                        We look forward to seeing you at ICICN '26! Your presentation slot details will be emailed shortly.
                    </p>
                </div>
            )}

            {/* RESULT REVEAL (Only if not paid yet) */}
            {showResult && !hasPaid && (
                <div className={`rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-700 ease-out animate-bounce-in
                    ${isAccepted ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30' : 'bg-white border-2 border-slate-200 text-slate-800'}
                `}>
                    <div className="mb-6 flex justify-center">
                        {isAccepted ? (
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-3xl font-extrabold mb-4">
                        {isAccepted ? 'Congratulations! 🎉' : 'Status Update'}
                    </h3>
                    
                    <div className={`text-lg leading-relaxed max-w-lg mx-auto ${isAccepted ? 'text-green-50' : 'text-slate-500'}`}>
                        {isAccepted ? (
                            <p>We are pleased to inform you that your paper has been <strong>ACCEPTED</strong> for presentation at ICICN '26. To confirm your attendance and presentation slot, please complete the registration payment.</p>
                        ) : (
                            <p>We regret to inform you that your paper has not been accepted this time. We encourage you to incorporate the feedback and submit to future editions.</p>
                        )}
                    </div>

                    {isAccepted && (
                         <div className="mt-8 space-y-3">
                            <button 
                                onClick={onProceedToPayment}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-700 font-bold text-lg rounded-xl shadow-lg hover:bg-emerald-50 hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                                Proceed to Payment ({feeSymbol}{feeAmount})
                            </button>
                            <div className="block">
                                <button className="text-sm text-emerald-100 hover:text-white underline">Download Acceptance Letter</button>
                            </div>
                         </div>
                    )}
                </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Paper Details</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Paper ID</div>
                        <div className="font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-600">ICICN-26-4592</div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Track</div>
                        <div className="font-medium text-slate-700">AI & Machine Learning</div>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Title</div>
                        <div className="font-medium text-slate-700 italic">"Optimizing Neural Networks for Low-Power Edge Devices"</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-600 mb-4">
                    If you have questions about the review process or your status, please contact the chair.
                </p>
                <a href="mailto:chair@icicn.org" className="text-sm font-bold text-blue-700 hover:underline">Contact Chair &rarr;</a>
            </div>
        </div>

      </div>
    </div>
  );
};