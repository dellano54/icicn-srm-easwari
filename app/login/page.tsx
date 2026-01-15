"use client";

import React, { useActionState } from 'react';
import Link from 'next/link';
import { loginTeam } from '@/app/actions/auth';
import { InputField } from '@/components/ui/InputField';
import { Mail, Lock, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

import { AuthFormState } from '@/lib/definitions';

export default function LoginPage() {
  const [state, dispatch, isPending] = useActionState<AuthFormState, FormData>(loginTeam, { message: '' });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-md border border-white/50 relative z-10 animate-fade-in-up">
            <Link 
                href="/"
                className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <div className="text-center mb-6 mt-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30">
                    <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Team Login</h2>
                <p className="text-slate-400 mt-1 text-xs">Access your registration status dashboard</p>
            </div>

            {state.message && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
                    {state.message}
                </div>
            )}

            <form action={dispatch} className="space-y-6">
                <InputField 
                    label="Team Email"
                    name="email"
                    type="email"
                    placeholder="Enter registered email"
                    required
                    icon={<Mail className="w-5 h-5" />}
                />
                
                <div className="relative">
                    <InputField 
                        label="Team ID / Access Code"
                        name="teamId"
                        type="password"
                        placeholder="Enter your team ID"
                        required
                        icon={<Lock className="w-5 h-5" />}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin h-5 w-5 text-white" />
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

                <Link
                    href="/register"
                    className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center justify-center group"
                >
                    <span className="mr-2">Create New Team Registration</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
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
