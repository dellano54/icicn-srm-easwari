import { DOMAINS } from '@/lib/constants';

export const Marquee = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 mb-12 text-center reveal-text">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Call for Papers</h2>
              <p className="text-slate-500 text-lg">Submissions invited across multiple cutting-edge domains</p>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div className="flex animate-marquee whitespace-nowrap py-4">
                {[...DOMAINS, ...DOMAINS].map((domain, i) => (
                    <div key={i} className="inline-block px-4">
                        <span className="inline-block px-8 py-4 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xl font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-default">
                            {domain}
                        </span>
                    </div>
                ))}
            </div>
          </div>
      </section>
  );
};
