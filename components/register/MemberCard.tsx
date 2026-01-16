"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Member, CollegeSuggestion, LocationSuggestion } from '@/lib/types';
import { apiService } from '@/lib/api';
import { InputField } from '@/components/ui/InputField';
import { Copy, Trash2, Search } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  index: number;
  totalMembers: number;
  onUpdate: (id: string, field: keyof Member, value: string) => void;
  onRemove: (id: string) => void;
  onCopyFromLead: (id: string) => void;
  isLead: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  index,
  totalMembers,
  onUpdate,
  onRemove,
  onCopyFromLead,
  isLead
}) => {
  // College Search State
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeSuggestion[]>([]);
  const [isSearchingCollege, setIsSearchingCollege] = useState(false);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  
  // Location Search State
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const collegeWrapperRef = useRef<HTMLDivElement>(null);
  const locationWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collegeWrapperRef.current && !collegeWrapperRef.current.contains(event.target as Node)) {
        setShowCollegeSuggestions(false);
      }
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Async College Search Logic ---
  const handleCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(member.id, 'college', value);
    
    // Clear previous timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setCollegeSuggestions([]);
      setShowCollegeSuggestions(false);
      setIsSearchingCollege(false);
      return;
    }

    setIsSearchingCollege(true);
    // Debounce API call (Simulated local search is fast)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiService.searchInstitutions(value);
        setCollegeSuggestions(results);
        setShowCollegeSuggestions(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearchingCollege(false);
      }
    }, 400);
  };

  const selectCollege = (college: CollegeSuggestion) => {
    onUpdate(member.id, 'college', college.name);
    // Auto-fill location if available from college data
    if (college.city) onUpdate(member.id, 'city', college.city);
    if (college.state) onUpdate(member.id, 'state', college.state);
    if (college.country) onUpdate(member.id, 'country', college.country);
    setShowCollegeSuggestions(false);
  };

  // --- Async Location Search Logic ---
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(member.id, 'city', value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);
    // Debounce API call (Increased to 800ms for public API politeness)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiService.searchLocations(value);
        setLocationSuggestions(results);
        setShowLocationSuggestions(true);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 800);
  };

  const selectLocation = (loc: LocationSuggestion) => {
    onUpdate(member.id, 'city', loc.city);
    onUpdate(member.id, 'state', loc.state);
    onUpdate(member.id, 'country', loc.country);
    setShowLocationSuggestions(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 overflow-visible z-0 hover:z-10">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full rounded-t-2xl ${isLead ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-200 group-hover:bg-blue-300 transition-colors'}`}></div>
      
      <div className="p-5 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-50">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${isLead ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-600'} font-bold text-sm mr-3 transition-transform group-hover:scale-110 duration-300 shrink-0`}>
              {index + 1}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isLead ? 'Team Lead' : `Member ${index + 1}`}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {isLead ? 'Primary Contact' : 'Participant'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {!isLead && (
              <button
                type="button"
                onClick={() => onCopyFromLead(member.id)}
                className="text-[10px] font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-100 hover:border-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center group/btn active:scale-95"
                title="Copy college and location details from Team Lead"
              >
                <Copy className="w-3 h-3 mr-1.5 transition-transform group-hover/btn:-rotate-180" />
                <span className="inline">Copy from Lead</span>
              </button>
            )}
            {totalMembers > 1 && (
              <button
                type="button"
                onClick={() => onRemove(member.id)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors active:scale-95"
                title="Remove Member"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputField
            label="Full Name"
            placeholder="e.g. John Doe"
            value={member.name}
            onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
            required
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="e.g. john@example.com"
            value={member.email}
            onChange={(e) => onUpdate(member.id, 'email', e.target.value)}
            required
          />
          
          <div className="w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number <span className="text-blue-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative w-28 shrink-0">
                <select 
                  className="w-full h-full appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-xl px-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  onChange={(e) => {
                    // Extract current number without code if possible, or just append. 
                    // Simpler: Just update a prefix state if we were splitting, but here 'phone' is one string.
                    // We'll assume the user types the number and we prepend this code, OR better:
                    // Let's parse the existing phone to see if it starts with a code, else default to +91.
                    // For this simple implementation, we'll just prepend the code to the display value or handle it visually.
                    // A better UX is to have a separate 'code' and 'number' state, but 'member.phone' is a string.
                    // We will just assume the user enters the number in the input, and we prepend the code on save/update? 
                    // No, 'onUpdate' updates the single string.
                    // Strategy: We will strip the old code and add the new one.
                    
                    const newCode = e.target.value;
                    const currentPhone = member.phone || '';
                    // Simple heuristic: If phone starts with '+', replace until space or just manage separate inputs visually
                    // BUT 'member.phone' is the source of truth.
                    
                    // improved approach: 
                    // 1. Keep 'phone' field as the full string.
                    // 2. We can't easily separate them without strict formatting.
                    // Let's just append the code to the input value if it's empty, or replace the prefix.
                    
                    // Actually, to keep it robust: The input below will handle the "number" part, and this select handles the "code".
                    // We need to split member.phone into code + number for this UI to work perfectly, 
                    // or just prepend the code when sending to 'onUpdate'.
                    
                    // Let's try a regex split.
                    const match = currentPhone.match(/^(\+\d+)\s*(.*)$/);
                    const oldNumberPart = match ? match[2] : currentPhone;
                    onUpdate(member.id, 'phone', `${newCode} ${oldNumberPart}`);
                  }}
                  value={member.phone?.split(' ')[0] && member.phone.includes('+') ? member.phone.split(' ')[0] : '+91'}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  value={member.phone?.replace(/^(\+\d+)\s*/, '') || ''}
                  onChange={(e) => {
                     const currentCode = member.phone?.match(/^(\+\d+)/)?.[0] || '+91';
                     onUpdate(member.id, 'phone', `${currentCode} ${e.target.value}`);
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <InputField
            label="Department"
            placeholder="e.g. Computer Science"
            value={member.department}
            onChange={(e) => onUpdate(member.id, 'department', e.target.value)}
            required
          />
          
          {/* Async College Search */}
          <div className="relative col-span-1 md:col-span-2" ref={collegeWrapperRef}>
            <InputField
              label="Institution / College"
              placeholder="Start typing to search college..."
              value={member.college}
              onChange={handleCollegeChange}
              onFocus={() => member.college.length >= 2 && setShowCollegeSuggestions(true)}
              isLoading={isSearchingCollege}
              required
              autoComplete="off"
              icon={<Search className="w-4 h-4" />}
            />
            {showCollegeSuggestions && (
              <div className="absolute z-50 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 max-h-60 overflow-y-auto mt-2 top-full overflow-hidden">
                {collegeSuggestions.length > 0 ? (
                  <ul>
                    {collegeSuggestions.map((college, idx) => (
                      <li
                        key={idx}
                        onClick={() => selectCollege(college)}
                        className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-none group/item"
                      >
                        <div className="font-semibold group-hover/item:text-blue-600 transition-colors">{college.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{college.city}, {college.state}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-3 text-sm text-slate-400 italic">No colleges found. Please enter manually.</div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2 p-4 md:p-6 bg-slate-50/50 rounded-xl border border-slate-100/80 mt-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              Location Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                {/* Async Location Search (City) */}
                <div className="relative col-span-1" ref={locationWrapperRef}>
                    <InputField
                        label="City"
                        placeholder="Search city..."
                        value={member.city}
                        onChange={handleCityChange}
                        onFocus={() => member.city.length >= 3 && setShowLocationSuggestions(true)}
                        isLoading={isSearchingLocation}
                        required
                        className="bg-white"
                    />
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 max-h-60 overflow-y-auto mt-2 top-full overflow-hidden">
                            <ul>
                                {locationSuggestions.map((loc, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => selectLocation(loc)}
                                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-none"
                                >
                                    <div className="font-medium text-slate-800">{loc.label}</div>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <InputField
                    label="State"
                    placeholder="State"
                    value={member.state}
                    onChange={(e) => onUpdate(member.id, 'state', e.target.value)}
                    required
                    className="bg-white"
                />
                <InputField
                    label="Country"
                    placeholder="Country"
                    value={member.country}
                    onChange={(e) => onUpdate(member.id, 'country', e.target.value)}
                    required
                    className="bg-white"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
