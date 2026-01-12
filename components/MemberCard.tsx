import React, { useState, useEffect, useRef } from 'react';
import { Member, CollegeSuggestion, LocationSuggestion } from '../types';
import { InputField } from './InputField';
import { apiService } from '../constants';

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
                <svg className="w-3 h-3 mr-1.5 transition-transform group-hover/btn:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+91 9876543210"
            value={member.phone}
            onChange={(e) => onUpdate(member.id, 'phone', e.target.value)}
            required
          />
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
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              }
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