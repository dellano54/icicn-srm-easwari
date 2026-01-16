"use client";

import React, { useActionState } from 'react';
import { loginSystem } from '@/app/actions/auth';
import { InputField } from '@/components/ui/InputField';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';

import { AuthFormState } from '@/lib/definitions';

export default function SystemLoginPage() {
  const [state, dispatch, isPending] = useActionState<AuthFormState, FormData>(loginSystem, { message: '' });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
        {/* Dark Theme Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="bg-slate-800/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md border border-slate-700 relative z-10 animate-fade-in-up">
            
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/20">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">System Access</h2>
                <p className="text-slate-400 mt-2 text-sm">Authorized Personnel Only</p>
            </div>

            {state.message && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium text-center">
                    {state.message}
                </div>
            )}

            <form action={dispatch} className="space-y-6">
                <InputField 
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="official@iccicn.org"
                    required
                    icon={<Mail className="w-5 h-5" />}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800 placeholder:text-slate-600"
                />
                
                <InputField 
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    icon={<Lock className="w-5 h-5" />}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800 placeholder:text-slate-600"
                />

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="role" value="reviewer" className="peer sr-only" defaultChecked />
                            <div className="text-center py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-500 transition-all font-semibold text-sm">
                                Reviewer
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="role" value="admin" className="peer sr-only" />
                            <div className="text-center py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 peer-checked:bg-purple-600 peer-checked:text-white peer-checked:border-purple-500 transition-all font-semibold text-sm">
                                Admin
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            "Authenticate"
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
