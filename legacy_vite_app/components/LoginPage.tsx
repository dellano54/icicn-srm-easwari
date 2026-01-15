import React, { useState } from 'react';
import { InputField } from './InputField';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (teamName: string, country: string) => void;
  onRegisterStart: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess, onRegisterStart }) => {
  const [email, setEmail] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API check
    setTimeout(() => {
      setIsLoading(false);
      // For demo, we just require non-empty fields
      if (email && teamId) {
        // Use the demo name if credentials match, otherwise generic
        let teamName = 'Neural Net Ninjas';
        let country = 'USA'; // Default to foreign

        if (email === 'sarah@skynet.com') {
            teamName = 'Skynet Researchers';
            country = 'USA';
        } else if (email === 'rahul@iit.ac.in') {
            teamName = 'IIT Madras Innovators';
            country = 'India';
        } else if (email.endsWith('.in')) {
            country = 'India';
        }

        onLoginSuccess(teamName, country);
      } else {
        alert("Please enter valid credentials");
      }
    }, 1000);
  };

  const fillForeignCredentials = () => {
    setEmail('sarah@skynet.com');
    setTeamId('TEAM-2026-1024'); // Example ID
  };

  const fillIndianCredentials = () => {
    setEmail('rahul@iit.ac.in');
    setTeamId('TEAM-2026-IN01');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-md border border-white/50 relative z-10 animate-fade-in-up">
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>

            <div className="text-center mb-6 mt-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Team Login</h2>
                <p className="text-slate-400 mt-1 text-xs">Access your registration status dashboard</p>
            </div>

            {/* Test Credentials Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-slate-600">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-700 uppercase text-[10px] tracking-wider flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                        Demo Credentials
                    </span>
                    <div className="flex space-x-2">
                        <button 
                            type="button"
                            onClick={fillForeignCredentials}
                            className="text-[10px] font-bold text-blue-600 bg-white hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded transition-colors"
                        >
                            Foreign ($)
                        </button>
                        <button 
                            type="button"
                            onClick={fillIndianCredentials}
                            className="text-[10px] font-bold text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded transition-colors"
                        >
                            Indian (₹)
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs pl-3 border-l-2 border-blue-200">
                    <span className="font-medium text-slate-500">Email:</span>
                    <span className="font-mono text-slate-700 bg-white/50 px-1 rounded truncate">{email || '...'}</span>
                    <span className="font-medium text-slate-500">ID:</span>
                    <span className="font-mono text-slate-700 bg-white/50 px-1 rounded truncate">{teamId || '...'}</span>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <InputField 
                    label="Team Email"
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>}
                />
                
                <div className="relative">
                    <InputField 
                        label="Team ID / Access Code"
                        type="password"
                        placeholder="Enter your team ID"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        required
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            "Login to Dashboard"
                        )}
                    </button>
                </div>

                {/* Registration Link */}
                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">New Participant?</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                    type="button"
                    onClick={onRegisterStart}
                    className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center group"
                >
                    <span className="mr-2">Create New Team Registration</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                    Having trouble? <a href="#" className="text-blue-500 font-medium hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    </div>
  );
};