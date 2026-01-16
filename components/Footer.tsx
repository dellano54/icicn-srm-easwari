import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="inline-block">
             <h3 className="text-3xl font-extrabold text-white tracking-tight">ICCICN <span className="text-blue-500">&apos;26</span></h3>
             <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">International Conference</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            The International Conference on Computational Intelligence & Computer Networks brings together global experts to discuss the future of AI, networking, and sustainable computing.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <Link href="#" className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <Linkedin className="w-4 h-4" />
            </Link>
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
                  <Mail className="w-4 h-4" />
              </div>
              <a href="mailto:icicn2026@gmail.com" className="pt-2 hover:text-blue-400 transition-colors">icicn2026@gmail.com</a>
            </li>
            <li className="flex items-start group">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors shrink-0">
                 <Phone className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">Convenors</p>
                <div className="flex flex-col">
                  <a href="tel:+918870037045" className="hover:text-blue-400 transition-colors">Dr. K. Sundar: +91 88700 37045</a>
                  <a href="tel:+91994187470" className="hover:text-blue-400 transition-colors">Dr. M. Mohana: +91 99418 7470</a>
                </div>
              </div>
            </li>
            <li className="flex items-start group sm:col-span-2 md:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors shrink-0">
                <MapPin className="w-4 h-4" />
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
        <p>&copy; 2026 ICCICN. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
