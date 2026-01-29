
import React from 'react';

/**
 * AI Generated Component: LMSContainer
 * Description: Embedded GrowAI LMS environment for solution training.
 * Referenced from PRD Section 2.4
 */
const LMSContainer: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative group">
      <div className="p-10 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Embedded Learning Environment</h3>
          <p className="text-gray-400 text-sm">Access solution training videos and documents without leaving the platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-white text-xs font-bold uppercase tracking-widest opacity-60">Live Integration</span>
        </div>
      </div>
      
      <div className="aspect-video bg-black/40 relative flex items-center justify-center overflow-hidden">
        {/* Mocking the LMS Interface */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.5 2.691l11 7.309-11 7.309v-14.618z" />
            </svg>
          </div>
          <span className="mt-6 text-white font-bold tracking-widest uppercase text-xs opacity-80">Launch GrowAI LMS Viewer</span>
        </div>
        
        {/* Blurred background preview */}
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
          alt="Factory Automation" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Overlay grid */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="p-8 bg-white/5 grid grid-cols-3 gap-4">
        {['Module 1: AI Vision Basics', 'Module 2: Predictive Maint.', 'Module 3: ESG Compliance'].map((mod, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
              <div className="w-1/3 h-full bg-primary"></div>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">0{i+1} Course</p>
            <p className="text-xs text-white font-medium">{mod}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LMSContainer;
