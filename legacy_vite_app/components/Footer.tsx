import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="inline-block">
             <h3 className="text-3xl font-extrabold text-white tracking-tight">ICICN <span className="text-blue-500">'26</span></h3>
             <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">International Conference</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            The International Conference on Computational Intelligence & Computer Networks brings together global experts to discuss the future of AI, networking, and sustainable computing.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <span className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </span>
            <span className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </span>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
            <span className="w-6 h-[2px] bg-blue-500 mr-3"></span>
            Contact Us
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 text-sm">
             <li className="flex items-start group">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <a href="mailto:icicn2026@gmail.com" className="pt-2 hover:text-blue-400 transition-colors">icicn2026@gmail.com</a>
            </li>
            <li className="flex items-start group">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors shrink-0">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <a href="tel:+918870037045" className="pt-2 hover:text-blue-400 transition-colors">+91 88700 37045</a>
            </li>
            <li className="flex items-start group sm:col-span-2 md:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <a href="https://maps.google.com/?q=Easwari+Engineering+College+Ramapuram+Chennai" target="_blank" rel="noopener noreferrer" className="pt-2 leading-relaxed hover:text-blue-400 transition-colors text-left">
                Department of IT, Easwari Engineering College<br/>
                Ramapuram, Chennai.
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; 2026 ICICN. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};