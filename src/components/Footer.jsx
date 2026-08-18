import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 text-xs font-mono py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-slate-400">
        
        {/* Left Status */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-400 text-[11px]">Ready</span>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2 text-[11px] bg-slate-900/60 px-3 py-1 rounded-md border border-slate-800">
          <span className="text-slate-400">Controls:</span>
          <span className="bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded border border-slate-700">Space / Enter</span>
          <span className="text-slate-400">Submit</span>
          <span className="text-slate-700">•</span>
          <span className="bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded border border-slate-700">Esc</span>
          <span className="text-slate-400">Pause</span>
        </div>

        {/* Right Info */}
        <div className="text-[11px] text-slate-400 text-center sm:text-right">
          Neon Typist
        </div>

      </div>
    </footer>
  );
};
