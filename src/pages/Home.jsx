import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredStats, getStoredProfile, computeRankTier } from '../utils/storage';
import { AvatarIcon } from '../components/Avatars';
import { playKeyStrokeSound } from '../utils/sound';

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getStoredStats());
  const [profile, setProfile] = useState(getStoredProfile());
  const [selectedDifficulty, setSelectedDifficulty] = useState('hacker');
  const [selectedMode, setSelectedMode] = useState('survival');

  useEffect(() => {
    setStats(getStoredStats());
    setProfile(getStoredProfile());
  }, []);

  const rank = computeRankTier(stats);

  const startGame = () => {
    playKeyStrokeSound();
    navigate('/game', {
      state: {
        difficulty: selectedDifficulty,
        mode: selectedMode
      }
    });
  };

  const difficulties = [
    {
      id: 'cadet',
      name: 'Cadet',
      speed: '0.8x Speed',
      words: 'Short & Common',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:border-emerald-400'
    },
    {
      id: 'hacker',
      name: 'Hacker',
      speed: '1.2x Speed',
      words: 'Tech & Protocols',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20 hover:border-cyan-400'
    },
    {
      id: 'overdrive',
      name: 'Overdrive',
      speed: '1.8x Speed',
      words: 'Matrix & Long Lexicon',
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/20 hover:border-rose-400'
    }
  ];

  const modes = [
    {
      id: 'survival',
      name: 'Shield Survival',
      desc: '5 Shields. Endless waves with increasing speed until firewall is breached.',
      badge: 'ENDLESS'
    },
    {
      id: 'time_attack',
      name: '60s Sprint',
      desc: 'Score as many points and type as many words as possible before the 60s timer expires.',
      badge: 'TIME TRIAL'
    },
    {
      id: 'word_rush',
      name: '40 Word Rush',
      desc: 'Neutralize 40 incoming packets in record time for maximum WPM calculation.',
      badge: 'TARGET GOAL'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 cyber-grid">
      
      {/* Background Neon ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative max-w-5xl mx-auto w-full space-y-10">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            NEURAL SPEED TYPING TERMINAL
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              NEON TYPIST
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            Data packets are descending into the neural mainframe. Lock on, match the syntax, and purge falling words with precision keystrokes before they breach the firewall.
          </p>

        </div>

        {/* Lifetime Stats & Pilot Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Best WPM</span>
              <span className="text-cyan-400 group-hover:scale-110 transition-transform">⚡</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-mono font-black text-cyan-400">
              {stats.bestWpm}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Words / Minute</div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>High Score</span>
              <span className="text-purple-400 group-hover:scale-110 transition-transform">🏆</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-mono font-black text-purple-400">
              {stats.highScore.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">All-time record</div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Avg Accuracy</span>
              <span className="text-emerald-400 group-hover:scale-110 transition-transform">🎯</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              {stats.gamesPlayed > 0 ? `${stats.avgAccuracy}%` : '100%'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Keystroke precision</div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Pilot Rank</span>
              <span className="text-amber-400 group-hover:scale-110 transition-transform">🎖️</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-mono font-bold text-amber-300 truncate">
              {rank.title}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">{stats.gamesPlayed} Matches Total</div>
          </div>

        </div>

        {/* Mission Configuration Panel */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-mono font-bold uppercase text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span>
                Mission Configuration
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Select difficulty level and gameplay mode before initiating neural link.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              FIREWALL PROTOCOL READY
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Select Threat Velocity (Difficulty)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => {
                      playKeyStrokeSound();
                      setSelectedDifficulty(diff.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${diff.color} ring-1 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]`
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-base">{diff.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {diff.speed}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      {diff.words}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Select Defense Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modes.map((m) => {
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      playKeyStrokeSound();
                      setSelectedMode(m.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-purple-500/80 bg-purple-950/30 text-purple-300 ring-1 ring-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-200">{m.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-purple-400 border border-purple-500/30">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1.5 leading-relaxed">
                      {m.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            
            <button
              type="button"
              onClick={startGame}
              className="w-full sm:flex-1 py-4 px-6 rounded-xl font-mono font-bold text-base uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-slate-950 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Initialize Terminal (Play Now)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playKeyStrokeSound();
                navigate('/profile');
              }}
              className="w-full sm:w-auto py-4 px-6 rounded-xl font-mono text-sm font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-purple-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <AvatarIcon id={profile.avatarId} className="w-5 h-5" glow={false} />
              <span>Pilot Profile</span>
            </button>

          </div>

        </div>

        {/* Quick Instructions & Keymap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm">
              01
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm text-slate-200">Target Lock</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Type letters matching any falling packet. The matching letters will light up in vivid neon.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold text-sm">
              02
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-200 text-sm">Purge on Space / Enter</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Press Space or Enter to vaporize the word and build up your combo score multiplier up to 5x.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono font-bold text-sm">
              03
            </div>
            <div>
              <h3 className="font-mono font-bold text-slate-200 text-sm">Protect the Firewall</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Don't let packets hit the bottom red firewall threshold or your defensive shields will deplete!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
