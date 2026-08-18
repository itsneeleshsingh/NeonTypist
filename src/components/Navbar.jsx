import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getStoredProfile, getStoredStats, getStoredSoundSettings, saveStoredSoundSettings } from '../utils/storage';
import { AvatarIcon } from './Avatars';
import { playKeyStrokeSound } from '../utils/sound';

export const Navbar = () => {
  const [profile, setProfile] = useState(getStoredProfile());
  const [stats, setStats] = useState(getStoredStats());
  const [soundSettings, setSoundSettings] = useState(getStoredSoundSettings());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
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

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/game', label: 'Play Game' },
    { path: '/profile', label: 'Profile' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Sleek Minimalist Logo & Brand */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 group transition-transform duration-200"
            onClick={() => playKeyStrokeSound()}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-teal-400 to-purple-600 flex items-center justify-center p-[1px] shadow-[0_0_12px_rgba(0,240,255,0.35)]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm tracking-tight font-mono">NT</span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-mono">
                NEON<span className="text-cyan-400 ml-1">TYPIST</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation (Clean, no emojis) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => playKeyStrokeSound()}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundSettings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className={`px-2.5 py-1.5 rounded-lg border transition-all duration-200 text-xs font-mono flex items-center gap-1.5 ${
                soundSettings.soundEnabled
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              {soundSettings.soundEnabled ? (
                <>
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="text-[11px] font-medium hidden sm:inline">SFX</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span className="text-[11px] font-medium hidden sm:inline">Muted</span>
                </>
              )}
            </button>

            {/* Profile Quick Pill */}
            <NavLink
              to="/profile"
              onClick={() => playKeyStrokeSound()}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all duration-200 group"
            >
              <AvatarIcon id={profile.avatarId} className="w-5 h-5 rounded" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-mono text-slate-300 leading-tight group-hover:text-white truncate max-w-[100px]">
                  {profile.handle || 'Player'}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 leading-none">
                  {stats.bestWpm} WPM
                </span>
              </div>
            </NavLink>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2.5 border-t border-slate-800/80 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  playKeyStrokeSound();
                  setMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `w-full px-3 py-2 rounded-lg text-xs font-mono font-medium flex items-center justify-between ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
