import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-sm text-xs font-mono py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
        
        {/* Left Status & Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">CYBERNETIC INTERFACE</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-[11px] text-slate-400">FPS: 60 SYNCED</span>
        </div>

        {/* Center Hotkey Help */}
        <div className="flex items-center gap-2 text-[11px] bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
          <span className="text-slate-400">Controls:</span>
          <span className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">Space / Enter</span>
          <span className="text-slate-400">Purge</span>
          <span className="text-slate-700">•</span>
          <span className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">Esc</span>
          <span className="text-slate-400">Pause</span>
        </div>

        {/* Right Info */}
        <div className="text-[11px] text-slate-400 text-center sm:text-right">
          NEON TYPIST <span className="text-cyan-500">v2.4.0</span> • BROWSER NEURAL PROTOCOL
        </div>

      </div>
    </footer>
  );
};
