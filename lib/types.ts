export interface CollegeSuggestion {
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface LocationSuggestion {
  city: string;
  state: string;
  country: string;
  label: string; 
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  city: string;
  state: string;
  country: string;
}

export interface FormData {
  teamName: string;
  mentorName: string;
  mentorDept: string;
  paperFile: File | null;
  plagiarismFile: File | null;
  domains: string[];
  members: Member[];
  mode: 'ONLINE' | 'OFFLINE';
}
