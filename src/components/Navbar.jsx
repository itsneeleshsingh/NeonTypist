import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getStoredProfile, getStoredStats, getStoredSoundSettings, saveStoredSoundSettings, computeRankTier } from '../utils/storage';
import { AvatarIcon } from './Avatars';
import { playKeyStrokeSound } from '../utils/sound';

export const Navbar = () => {
  const [profile, setProfile] = useState(getStoredProfile());
  const [stats, setStats] = useState(getStoredStats());
  const [soundSettings, setSoundSettings] = useState(getStoredSoundSettings());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Refresh header data on route change
    setProfile(getStoredProfile());
    setStats(getStoredStats());
    setSoundSettings(getStoredSoundSettings());
  }, [location.pathname]);

  const toggleSound = () => {
    const updated = saveStoredSoundSettings({ soundEnabled: !soundSettings.soundEnabled });
    setSoundSettings(updated);
    if (updated.soundEnabled) {
      playKeyStrokeSound();
    }
  };

  const rank = computeRankTier(stats);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⚡' },
    { path: '/game', label: 'Terminal', icon: '⌨️' },
    { path: '/profile', label: 'Pilot Profile', icon: '👤' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
            onClick={() => playKeyStrokeSound()}
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400 font-black text-lg tracking-tighter">N</span>
                <span className="text-purple-400 font-black text-lg tracking-tighter">T</span>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent group-hover:neon-glow-cyan">
                Neon Typist
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                GRID V2.4 ONLINE
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => playKeyStrokeSound()}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 border border-transparent'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Header Stats & Controls */}
          <div className="flex items-center gap-3">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundSettings.soundEnabled ? 'Audio SFX Enabled (Click to Mute)' : 'Audio SFX Muted (Click to Enable)'}
              className={`p-2 rounded-lg border transition-all duration-200 text-xs font-mono flex items-center gap-1.5 ${
                soundSettings.soundEnabled
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:border-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundSettings.soundEnabled ? (
                <>
                  <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-semibold">SFX ON</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-semibold">MUTED</span>
                </>
              )}
            </button>

            {/* Pilot Rank Capsule */}
            <NavLink
              to="/profile"
              onClick={() => playKeyStrokeSound()}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-500/50 rounded-lg transition-all duration-200 group"
            >
              <AvatarIcon id={profile.avatarId} className="w-6 h-6 rounded" />
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 leading-tight group-hover:text-purple-300 truncate max-w-[90px]">
                    {profile.handle || 'Pilot'}
                  </span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono">
                    {rank.badge}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 leading-none">
                  {stats.bestWpm} <span className="text-[9px] text-slate-400 font-normal">WPM</span>
                </span>
              </div>
            </NavLink>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1.5 animate-fadeIn">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  playKeyStrokeSound();
                  setMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
