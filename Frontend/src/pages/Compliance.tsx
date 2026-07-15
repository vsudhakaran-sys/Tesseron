// Compliance page designed to explain data security to non-technical users | params : none | returns : React Node
import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, Database, Server, CheckCircle2, AlertTriangle, EyeOff, ScanFace, Brain } from 'lucide-react';

const Compliance = () => {
  // animates progress to trigger icon pop effects over a 6s loop | params : none | returns : void
  const [progress, setProgress] = useState(0);

  // sync icon pop trigger points:  | params : | returns : 
  const pop2 = 27;
  const pop3 = 60;
  const pop4 = 93;

  useEffect(() => {
    let animationFrameId: number;
    const start = Date.now();
    const duration = 6000;

    const play = () => {
      const elapsed = (Date.now() - start) % duration;
      setProgress((elapsed / duration) * 100);
      animationFrameId = requestAnimationFrame(play);
    };

    animationFrameId = requestAnimationFrame(play);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // updated final promises card to include matching CheckCircle2 icon layout  | params : none | returns : React.JSX.Element
  return (
    <div className="p-8 space-y-8 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Your Data Privacy &amp; Security</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">A comprehensive overview of the robust measures we take to protect your information at every stage</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-bold tracking-wide text-slate-700">System Status: <span className="text-emerald-500">Secure</span></span>
        </div>
      </div>

      {/* Metric Cards - Simplified Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform duration-300">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Where is data kept?</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">Safely in Europe</p>
              <p className="text-sm text-slate-500 font-medium">Frankfurt, Germany</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform duration-300">
              <EyeOff className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Who can read data?</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">Restricted Access</p>
              <p className="text-sm text-emerald-600 font-bold">100% Private Workspaces</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 transition-transform duration-300">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Protection Level</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">Enterprise-Grade</p>
              <p className="text-sm text-slate-500 font-medium">Top security locked files</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Visualizer - 4 Simple Steps */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" />
            <h2 className="text-lg font-black tracking-tight uppercase text-slate-800">What happens to your info?</h2>
          </div>
          <span className="text-[10px] font-black text-blue-600 px-4 py-1.5 bg-blue-50 rounded-full uppercase tracking-widest border border-blue-200">The 4-Step Journey</span>
        </div>
        
        {/* visualizer inner container with progress line | params : none | returns : JSX */}
        <div className="p-12 relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 w-full">
          
          {/* Progress bar line (only visible on md+ screens) */}
          <div className="hidden md:block absolute top-[69px] left-[12%] right-[12%] h-[4px] border-t-4 border-dashed border-slate-200 z-0"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center flex-1 relative z-10 px-2">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${progress >= 0 ? 'bg-blue-100 scale-110' : 'bg-slate-50 scale-100'}`}>
              <FileText className={`w-8 h-8 transition-colors duration-500 ${progress >= 0 ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="font-black text-lg md:text-xl mb-3 tracking-tight">1. FleetSync Upload</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Files enter the FleetSync flow through a secure channel, initiating safe uploading and instant tracking.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center flex-1 relative z-10 px-2">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${progress >= pop2 ? 'bg-indigo-100 scale-110' : 'bg-slate-50 scale-100'}`}>
              <Brain className={`w-8 h-8 transition-colors duration-500 ${progress >= pop2 ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="font-black text-lg md:text-xl mb-3 tracking-tight">2. AI Processing</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              We combine AWS Comprehend for language detection and entity extraction with AWS Bedrock to process your data privately.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center flex-1 relative z-10 px-2">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${progress >= pop3 ? 'bg-emerald-100 scale-110' : 'bg-slate-50 scale-100'}`}>
              <Server className={`w-8 h-8 transition-colors duration-500 ${progress >= pop3 ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="font-black text-lg md:text-xl mb-3 tracking-tight">3. Key Mapping</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Extracted fields and translations are carefully mapped to the correct keys, structuring the data securely for your review.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col items-center text-center flex-1 relative z-10 px-2">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${progress >= pop4 ? 'bg-purple-100 scale-110' : 'bg-slate-50 scale-100'}`}>
              <Database className={`w-8 h-8 transition-colors duration-500 ${progress >= pop4 ? 'text-purple-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="font-black text-lg md:text-xl mb-3 tracking-tight">4. Safe DB Storage</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              The FleetSync flow concludes by securely saving all verified AI answers directly to your digital vault database.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Details Made Easy */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:bg-slate-50 transition-all duration-300">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
             <Lock className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">We Use Heavy Locks</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              We scramble your information while it moves across the internet so hackers can't intercept it. This is exactly what the biggest financial institutions use today to keep your money safe.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:bg-slate-50 transition-all duration-300">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
             <EyeOff className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Private Data Processing</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your data is processed within isolated environments using industry-standard security protocols. We maintain full data integrity while ensuring your sensitive information remains private and secure.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:bg-slate-50 transition-all duration-300">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
             <Shield className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">You Decide Who Acts</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Only authorized members from your company and team can read your data. If you didn't grant someone the right level of access, they can't see the results or upload files.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:bg-slate-50 transition-all duration-300">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
             <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Checked and Certified</h4>
            <p className="text-sm text-slate-600 mb-4">
              We follow strict global guidelines for privacy. Independent reviewers check our system annually. We adhere to leading standards globally (like GDPR, SOC 2, and others). 
            </p>
            <div className="flex items-center gap-4 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Audited for safety
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
