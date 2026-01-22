import { CollegeSuggestion, LocationSuggestion } from './types';

// Mock Database for Colleges (Retaining domain-specific data)
const MOCK_COLLEGES: CollegeSuggestion[] = [
  { name: "Easwari Engineering College", city: "Chennai", state: "Tamil Nadu", country: "India" },
  { name: "Anna University", city: "Chennai", state: "Tamil Nadu", country: "India" },
  { name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu", country: "India" },
  { name: "SRM Institute of Science and Technology", city: "Kattankulathur", state: "Tamil Nadu", country: "India" },
  { name: "Vellore Institute of Technology", city: "Vellore", state: "Tamil Nadu", country: "India" },
  { name: "BITS Pilani", city: "Pilani", state: "Rajasthan", country: "India" },
  { name: "Indian Institute of Science", city: "Bangalore", state: "Karnataka", country: "India" },
  { name: "Delhi Technological University", city: "New Delhi", state: "Delhi", country: "India" },
  { name: "National Institute of Technology Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", country: "India" },
  { name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu", country: "India" },
  { name: "Stanford University", city: "Stanford", state: "California", country: "USA" },
  { name: "Massachusetts Institute of Technology", city: "Cambridge", state: "Massachusetts", country: "USA" },
  { name: "National University of Singapore", city: "Singapore", state: "Singapore", country: "Singapore" },
  { name: "Imperial College London", city: "London", state: "England", country: "UK" }
];

export const apiService = {
  // Simulated local search for Colleges
  searchInstitutions: (query: string): Promise<CollegeSuggestion[]> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        if (!query || query.length < 2) {
          resolve([]);
          return;
        }
        const lowerQuery = query.toLowerCase();
        const results = MOCK_COLLEGES.filter(c => 
          c.name.toLowerCase().includes(lowerQuery)
        );
        resolve(results);
      }, 400); 
    });
  },

  // Live OpenStreetMap Search for Locations
  searchLocations: async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 3) return [];

    try {
      // Fetching from OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=en`,
        {
          headers: {
            "User-Agent": "ICICN_Conference_Registration_App/1.0"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Location service unavailable");
      }

      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((item: any) => {
        const addr = item.address || {};
        
        const city = addr.city || 
                    addr.town || 
                    addr.village || 
                    addr.municipality || 
                    addr.city_district || 
                    addr.suburb || 
                    addr.hamlet || 
                    addr.county || 
                    '';

        const state = addr.state || addr.province || addr.region || addr.state_district || '';
        const country = addr.country || '';

        return {
          city,
          state,
          country,
          label: item.display_name 
        };
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }
};
