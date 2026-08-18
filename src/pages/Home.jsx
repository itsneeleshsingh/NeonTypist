import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredStats, computeRankTier } from '../utils/storage';
import { playKeyStrokeSound } from '../utils/sound';

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(getStoredStats());
  const [selectedDifficulty, setSelectedDifficulty] = useState('hacker');
  const [selectedMode, setSelectedMode] = useState('survival');

  useEffect(() => {
    setStats(getStoredStats());
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
      words: 'Short & Common words',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:border-emerald-400'
    },
    {
      id: 'hacker',
      name: 'Hacker',
      speed: '1.2x Speed',
      words: 'Tech & developer syntax',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20 hover:border-cyan-400'
    },
    {
      id: 'overdrive',
      name: 'Overdrive',
      speed: '1.8x Speed',
      words: 'Advanced longer words',
      color: 'border-rose-500/40 text-rose-400 bg-rose-950/20 hover:border-rose-400'
    }
  ];

  const modes = [
    {
      id: 'survival',
      name: 'Shield Survival',
      desc: '5 Shields. Words fall faster as you progress until shields run out.',
      badge: 'Endless'
    },
    {
      id: 'time_attack',
      name: '60s Sprint',
      desc: 'Type as many words as possible before the 60-second timer runs out.',
      badge: 'Time Trial'
    },
    {
      id: 'word_rush',
      name: '40 Word Rush',
      desc: 'Type 40 target words as fast and accurately as possible.',
      badge: 'Goal'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative max-w-4xl mx-auto w-full space-y-8">

        {/* Clean Hero Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              NEON TYPIST
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            A fast-paced browser speed typing game. Type falling words with precision before they cross the defense line.
          </p>
        </div>

        {/* Clean Stats Overview Cards (No random emojis) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Best WPM
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-mono font-bold text-cyan-400">
              {stats.bestWpm}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Words / minute</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono uppercase text-slate-400">
              High Score
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-mono font-bold text-purple-400">
              {stats.highScore.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Best run</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Avg Accuracy
            </div>
            <div className="mt-1.5 text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
              {stats.gamesPlayed > 0 ? `${stats.avgAccuracy}%` : '100%'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Keystroke precision</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono uppercase text-slate-400">
              Rank
            </div>
            <div className="mt-1.5 text-lg sm:text-xl font-mono font-bold text-amber-400 truncate">
              {rank.title}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{stats.gamesPlayed} games played</div>
          </div>

        </div>

        {/* Game Setup Panel */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-6">
          
          <div>
            <h2 className="text-base font-mono font-bold uppercase text-white">
              Game Setup
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Select difficulty and mode to start playing.
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Difficulty
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
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${diff.color} ring-1 ring-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.15)]`
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-100">{diff.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
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
              Game Mode
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
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-purple-500/70 bg-purple-950/30 text-purple-200 ring-1 ring-purple-400/70 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-200">{m.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-purple-400 border border-purple-500/30">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            
            <button
              type="button"
              onClick={startGame}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-mono font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Play Now</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playKeyStrokeSound();
                navigate('/profile');
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <span>View Profile</span>
            </button>

          </div>

        </div>

        {/* Clean Controls Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-cyan-400 font-bold">1. Target Match</span>
            <p className="text-slate-400 mt-0.5 text-[11px]">Type letters matching any falling word on screen.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-purple-400 font-bold">2. Submit Word</span>
            <p className="text-slate-400 mt-0.5 text-[11px]">Press Space or Enter to clear the word and build combos.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-rose-400 font-bold">3. Protect Defense</span>
            <p className="text-slate-400 mt-0.5 text-[11px]">Prevent words from crossing the red line at the bottom.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
