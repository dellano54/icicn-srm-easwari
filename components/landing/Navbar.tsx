"use client";

import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-50 px-3 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
      <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tighter">
        ICCICN<span className="text-blue-600">&apos;26</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link 
          href="/register"
          className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
        >
          Register
        </Link>
      </div>
    </div>
  );
};
