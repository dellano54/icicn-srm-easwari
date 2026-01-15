import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormData, Member } from '../types';
import { MAX_MEMBERS } from '../constants';
import { InputField } from './InputField';
import { FileUpload } from './FileUpload';
import { MemberCard } from './MemberCard';
import { DomainSelector } from './DomainSelector';

interface RegistrationPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState<FormData>({
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

  const [submitted, setSubmitted] = useState(false);
  const [generatedTeamId, setGeneratedTeamId] = useState<string>('');

  // --- Demo Data Logic ---
  const fillDemoData = () => {
    const demoMembers = [
        {
            id: uuidv4(),
            name: 'Sarah Connor',
            email: 'sarah@skynet.com',
            phone: '+1 555 0199',
            college: 'Massachusetts Institute of Technology',
            department: 'Robotics',
            city: 'Cambridge',
            state: 'Massachusetts',
            country: 'USA'
        },
        {
            id: uuidv4(),
            name: 'John Doe',
            email: 'john.doe@mit.edu',
            phone: '+1 555 0123',
            college: 'Massachusetts Institute of Technology',
            department: 'Computer Science',
            city: 'Cambridge',
            state: 'Massachusetts',
            country: 'USA'
        }
    ];

    // Create a dummy file object for demonstration
    const dummyFile = new File(["dummy content"], "demo_research_paper.pdf", { type: "application/pdf" });

    setFormData({
        teamName: 'Skynet Researchers',
        mentorName: 'Dr. Miles Dyson',
        mentorDept: 'Cyberdyne Systems',
        paperFile: dummyFile,
        plagiarismFile: dummyFile,
        domains: ['AI, Machine Learning and Deep Learning Applications', 'Robotics & Automation'],
        members: demoMembers
    });
  };

  // --- Member Logic ---

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

  // --- Main Form Logic ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDomainsChange = (domains: string[]) => {
    setFormData(prev => ({ ...prev, domains }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.domains.length === 0) {
        alert("Please select at least one domain.");
        return;
    }
    if (!formData.paperFile || !formData.plagiarismFile) {
        alert("Please upload both the Paper and the Plagiarism Report.");
        return;
    }
    
    // Simulate ID Generation
    const newTeamId = `TEAM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTeamId(newTeamId);

    // Simulate API call
    console.log("Form Submitted:", { ...formData, teamId: newTeamId });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border border-slate-100 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Registration Complete</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Your team <span className="font-bold text-slate-700">{formData.teamName}</span> has been registered.
          </p>

          {/* CREDENTIALS BOX */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-slate-900 transform rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Login Credentials
             </h3>

             <div className="space-y-4 relative z-10">
                <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-1">Team Email</label>
                    <div className="font-mono text-sm font-medium text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-lg break-all">
                        {formData.members[0].email}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-semibold block mb-1">Access Code (Password)</label>
                    <div className="flex gap-2">
                        <div className="font-mono text-lg font-bold text-blue-600 bg-white border border-blue-200 px-3 py-2 rounded-lg flex-grow tracking-wider">
                            {generatedTeamId}
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(generatedTeamId)}
                            className="bg-white border border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600 rounded-lg px-3 flex items-center justify-center transition-all"
                            title="Copy Code"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                </div>
             </div>
             
             <div className="mt-4 flex items-start text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <svg className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Please save these credentials securely. You will need them to check your status.
             </div>
          </div>

          <div className="flex flex-col gap-3">
              <button 
                onClick={onBack}
                className="w-full bg-slate-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Home
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* Navigation / Back Button */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button 
                onClick={onBack}
                className="group flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg active:bg-slate-100"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </span>
                Back
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={fillDemoData}
                    className="flex-1 sm:flex-none text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg transition-colors text-center"
                >
                    Auto-fill Demo
                </button>
                <button
                    type="button"
                    onClick={onLogin}
                    className="flex-1 sm:flex-none text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-colors text-center"
                >
                    Login
                </button>
            </div>
        </div>

        <div className="max-w-4xl mx-auto mb-10 text-center px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
             Team Registration
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            Submit your research paper and team details. <br className="hidden md:block" />
            <span className="text-sm">Already registered? <button onClick={onLogin} className="text-blue-600 hover:underline font-semibold">Login here</button></span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 animate-fade-in">
          
          {/* Section 1: Team & Project Info */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Team & Project</h2>
                <p className="text-sm text-slate-500 mt-1">General submission details</p>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
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
                      />
                  </div>
                  
                  <div className="md:col-span-2">
                    <DomainSelector 
                      selectedDomains={formData.domains}
                      onChange={handleDomainsChange}
                    />
                  </div>

                  <InputField
                      label="Mentor Name"
                      name="mentorName"
                      value={formData.mentorName}
                      onChange={handleInputChange}
                      placeholder="Faculty Mentor Name"
                      required
                  />
                  <InputField
                      label="Mentor Department"
                      name="mentorDept"
                      value={formData.mentorDept}
                      onChange={handleInputChange}
                      placeholder="Mentor's Department"
                      required
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
                          helperText="Upload your research paper (PDF, max 6 pages)"
                      />
                      <FileUpload
                          label="Plagiarism Report"
                          accept=".pdf"
                          required
                          onChange={(file) => setFormData(prev => ({ ...prev, plagiarismFile: file }))}
                          value={formData.plagiarismFile}
                          helperText="Attach the plagiarism scan report (PDF)"
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
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center mr-2 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  </div>
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
              className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center text-lg">
                Complete Registration
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

        </form>
    </div>
  );
};