"use client";

import React, { useState, useActionState, useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { Member, FormData as LocalFormData } from '@/lib/types';
import { MAX_MEMBERS } from '@/lib/constants';
import { InputField } from '@/components/ui/InputField';
import { FileUpload } from '@/components/ui/FileUpload';
import { DomainSelector } from '@/components/ui/DomainSelector';
import { MemberCard } from '@/components/register/MemberCard';
import { registerTeam } from '@/app/actions/register';
import { ArrowLeft, Plus, CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';

import { RegistrationFormState } from '@/lib/definitions';

export default function RegisterPage() {
  const [state, dispatch, isPending] = useActionState<RegistrationFormState, FormData>(registerTeam, { message: '', errors: {} });
  
  const [formData, setFormData] = useState<LocalFormData>({
    teamName: '',
    mentorName: '',
    mentorDept: '',
    paperFile: null,
    plagiarismFile: null,
    domains: [],
    members: [{ 
      id: uuidv4(), 
      name: '', 
      email: '', 
      phone: '', 
      college: '',
      department: '',
      city: '',
      state: '',
      country: '' 
    }]
  });

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDomainsChange = (domains: string[]) => {
    setFormData(prev => ({ ...prev, domains }));
  };

  const addMember = () => {
    if (formData.members.length < MAX_MEMBERS) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { 
          id: uuidv4(), 
          name: '', 
          email: '', 
          phone: '', 
          college: '',
          department: '',
          city: '',
          state: '',
          country: '' 
        }]
      }));
    }
  };

  const removeMember = (id: string) => {
    if (formData.members.length > 1) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== id)
      }));
    }
  };

  const updateMember = (id: string, field: keyof Member, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  const copyLeadCollege = (memberId: string) => {
    const lead = formData.members[0];
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.id === memberId ? { 
          ...m, 
          college: lead.college,
          city: lead.city,
          state: lead.state,
          country: lead.country
        } : m
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation check before submitting to server
    if (formData.domains.length === 0) {
        alert("Please select at least one domain.");
        return;
    }
    if (!formData.paperFile || !formData.plagiarismFile) {
        alert("Please upload both the Paper and the Plagiarism Report.");
        return;
    }

    const payload = new FormData();
    payload.append('teamName', formData.teamName);
    payload.append('mentorName', formData.mentorName);
    payload.append('mentorDept', formData.mentorDept);
    payload.append('domains', JSON.stringify(formData.domains));
    // We send members as a JSON string for easier parsing on server
    payload.append('members', JSON.stringify(formData.members));
    
    if (formData.paperFile) payload.append('paperFile', formData.paperFile);
    if (formData.plagiarismFile) payload.append('plagiarismFile', formData.plagiarismFile);

    React.startTransition(() => {
        dispatch(payload);
    });
  };

  // Scroll to top on error or success
  useEffect(() => {
    if (state.message || state.errors) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state]);


  // --- Render Success View ---
  if (state.success && state.teamId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border border-slate-100 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Registration Complete</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Your team <span className="font-bold text-slate-700">{formData.teamName}</span> has been successfully registered.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start text-left gap-3 animate-bounce-in">
             <div className="bg-blue-500 p-2 rounded-lg shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
             </div>
             <div>
                <p className="text-blue-800 font-bold text-sm">Email Sent!</p>
                <p className="text-blue-600/80 text-xs">An email containing your access code and instructions has been sent to <span className="font-bold">{state.teamEmail}</span>.</p>
             </div>
          </div>

          {/* CREDENTIALS BOX */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Login Credentials
             </h3>

             <div className="space-y-4 relative z-10">
                <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-1">Team Email</label>
                    <div className="font-mono text-sm font-medium text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-lg break-all">
                        {state.teamEmail}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-1">Access Code (Password)</label>
                    <div className="flex gap-2">
                        <div className="font-mono text-lg font-bold text-blue-600 bg-white border border-blue-200 px-3 py-2 rounded-lg flex-grow tracking-wider">
                            {state.teamId}
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(state.teamId || '')}
                            className="bg-white border border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600 rounded-lg px-3 flex items-center justify-center transition-all"
                            title="Copy Code"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>
             </div>
             
             <div className="mt-4 flex items-start text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <span className="mr-1.5 mt-0.5">⚠️</span>
                Please save these credentials securely. You will need them to check your status.
             </div>
          </div>

          <div className="flex flex-col gap-3">
              <Link 
                href="/login"
                className="w-full bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl block"
              >
                Login to Dashboard
              </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Form ---
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* Navigation / Back Button */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link 
                href="/"
                className="group flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg active:bg-slate-100"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </div>
                Back
            </Link>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                    href="/login"
                    className="flex-1 sm:flex-none text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-colors text-center"
                >
                    Login
                </Link>
            </div>
        </div>

        <div className="max-w-4xl mx-auto mb-10 text-center px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
             Team Registration
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            Submit your research paper and team details. <br className="hidden md:block" />
          </p>
        </div>
        
        {state.message && !state.success && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                {state.message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 animate-fade-in">
          
          {/* Section 1: Team & Project Info */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Team & Project</h2>
                <p className="text-sm text-slate-500 mt-1">General submission details</p>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                 {/* Icon */}
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                      <InputField
                          label="Team Name"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          placeholder="Enter your team name"
                          required
                          className="text-lg"
                          error={state.errors?.teamName}
                      />
                  </div>
                  
                  <div className="md:col-span-2">
                    <DomainSelector 
                      selectedDomains={formData.domains}
                      onChange={handleDomainsChange}
                      error={state.errors?.domains}
                    />
                  </div>

                  <InputField
                      label="Mentor Name"
                      name="mentorName"
                      value={formData.mentorName}
                      onChange={handleInputChange}
                      placeholder="Faculty Mentor Name"
                      required
                      error={state.errors?.mentorName}
                  />
                  <InputField
                      label="Mentor Department"
                      name="mentorDept"
                      value={formData.mentorDept}
                      onChange={handleInputChange}
                      placeholder="Mentor's Department"
                      required
                      error={state.errors?.mentorDept}
                  />
              </div>

              <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Submission Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FileUpload
                          label="Conference Paper"
                          accept=".pdf"
                          required
                          onChange={(file) => setFormData(prev => ({ ...prev, paperFile: file }))}
                          value={formData.paperFile}
                          helperText="Upload your research paper (PDF)"
                          error={state.errors?.paper}
                      />
                      <FileUpload
                          label="Plagiarism Report"
                          accept=".pdf"
                          required
                          onChange={(file) => setFormData(prev => ({ ...prev, plagiarismFile: file }))}
                          value={formData.plagiarismFile}
                          helperText="Attach the plagiarism scan report (PDF)"
                          error={state.errors?.plagiarism}
                      />
                  </div>
              </div>
            </div>
          </div>

          {/* Section 2: Members */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Members</h2>
                <p className="text-slate-500 mt-1 text-sm">Manage your team details (Max {MAX_MEMBERS})</p>
              </div>
              {formData.members.length < MAX_MEMBERS && (
                <button
                  type="button"
                  onClick={addMember}
                  className="w-full sm:w-auto group inline-flex items-center justify-center px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </button>
              )}
            </div>

            <div className="space-y-6 md:space-y-8">
              {formData.members.map((member, index) => (
                <div key={member.id}>
                  <MemberCard
                    member={member}
                    index={index}
                    totalMembers={formData.members.length}
                    onUpdate={updateMember}
                    onRemove={removeMember}
                    onCopyFromLead={copyLeadCollege}
                    isLead={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-8 pb-32 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center text-lg">
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Processing...
                    </>
                ) : (
                    <>
                        Complete Registration
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                )}
              </span>
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

        </form>
    </div>
  );
}
