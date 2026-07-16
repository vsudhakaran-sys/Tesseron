import React from 'react';

const LoginStats: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col relative w-full lg:w-[48%] self-stretch overflow-hidden bg-[#1e1b4b] group">
      {/* Background Image with Lower Opacity for Contrast */}
      <img
        src="/fleet-side-panel.png"
        alt="TESSERON Fleet"
        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Dark Gradient for Text Readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0f172a] via-[#1e1b4b]/20 to-transparent z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full p-8 xl:p-14 flex flex-col justify-center text-white pb-16">
        <div className="max-w-[440px] animate-in slide-in-from-bottom-8 duration-700">
          <div className="mb-10">
            <h2 className="text-3xl xl:text-4xl font-bold leading-[1.1] mb-5 tracking-tight text-white drop-shadow-xl">
              Clarity for your mobility
            </h2>
            <p className="text-base xl:text-lg text-white/90 font-medium leading-relaxed max-w-[380px]">
              Strategic mobility and fleet consulting for informed decisions with long-term impact.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-white/20 w-full">
            <div className="space-y-1">
              <span className="text-2xl xl:text-3xl font-bold block text-white tabular-nums">100+</span>
              <span className="text-xs uppercase tracking-widest text-white/70 font-bold leading-tight">Identified<br />Improvements</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl xl:text-3xl font-bold block text-white tabular-nums">98%</span>
              <span className="text-xs uppercase tracking-widest text-white/70 font-bold leading-tight">Recommendation<br />Rate</span>
            </div>
            <div className="space-y-1 hidden lg:block">
              <span className="text-2xl xl:text-3xl font-bold block text-white tabular-nums">50+</span>
              <span className="text-xs uppercase tracking-widest text-white/70 font-bold leading-tight">Mobility<br />Decisions</span>
            </div>
            <div className="space-y-1 hidden lg:block">
              <span className="text-2xl xl:text-3xl font-bold block text-white tabular-nums">15+</span>
              <span className="text-xs uppercase tracking-widest text-white/70 font-bold leading-tight">Years<br />Experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStats;


