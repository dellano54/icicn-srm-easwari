import Link from 'next/link';
import { LogIn } from 'lucide-react';

export const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
      <div className="text-xl font-extrabold text-slate-900 tracking-tighter">
        ICICN<span className="text-blue-600">'26</span>
      </div>
      <Link 
        href="/login"
        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 font-semibold text-sm hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
      >
        <LogIn className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        Team Login
      </Link>
    </div>
  );
};
