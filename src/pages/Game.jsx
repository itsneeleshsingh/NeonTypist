import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRandomWord } from '../utils/wordBank';
import { 
  playKeyStrokeSound, 
  playLaserZap, 
  playComboUp, 
  playErrorBuzz, 
  playShieldLost, 
  playGameOverSound, 
  playVictorySound 
} from '../utils/sound';
import { recordMatchResult, getStoredStats, computeRankTier } from '../utils/storage';
import { ParticleBurst } from '../components/ParticleBurst';

const MAX_SHIELDS = 5;
const FIREWALL_THRESHOLD_Y = 86; // 86% height is the firewall line

export const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Settings from navigation state or defaults
  const difficulty = location.state?.difficulty || 'hacker';
  const mode = location.state?.mode || 'survival';

  // Game States: 'countdown' | 'playing' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState('countdown');
  const [countdown, setCountdown] = useState(3);

  // Active falling words: Array of { id, text, x, y, speed, points, tier }
  const [activeWords, setActiveWords] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Game Metrics & HUD
  const [score, setScore] = useState(0);
  const [shields, setShields] = useState(MAX_SHIELDS);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [wordsNeutralized, setWordsNeutralized] = useState(0);
  
  // Time & WPM Tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(mode === 'time_attack' ? 60 : 0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [inputShaking, setInputShaking] = useState(false);
  const [firewallAlarm, setFirewallAlarm] = useState(false);

  // Visual Effects
  const [particleBursts, setParticleBursts] = useState([]);

  // Loop & Event Refs (decoupling high-frequency loop from React renders)
  const requestRef = useRef();
  const lastSpawnTimeRef = useRef(0);
  const wordsNeutralizedRef = useRef(0);
  const finishGameRef = useRef(null);
  const inputRef = useRef(null);

  // Speed and spawn configuration based on difficulty
  const getDifficultyConfig = useCallback(() => {
    switch (difficulty) {
      case 'cadet':
        return { baseSpeed: 0.16, spawnInterval: 2000, maxActive: 4, speedRamp: 0.01 };
      case 'overdrive':
        return { baseSpeed: 0.42, spawnInterval: 1100, maxActive: 7, speedRamp: 0.025 };
      case 'hacker':
      default:
        return { baseSpeed: 0.26, spawnInterval: 1500, maxActive: 5, speedRamp: 0.018 };
    }
  }, [difficulty]);

  const configRef = useRef(getDifficultyConfig());
  useEffect(() => {
    configRef.current = getDifficultyConfig();
  }, [getDifficultyConfig]);

  useEffect(() => {
    wordsNeutralizedRef.current = wordsNeutralized;
  }, [wordsNeutralized]);

  // Spawn a new word into active pool
  const spawnWord = useCallback(() => {
    const config = configRef.current;
    setActiveWords((current) => {
      if (current.length >= config.maxActive) return current;

      const newWordData = getRandomWord(difficulty, current);
      
      // Calculate random X position (15% to 80% to keep away from screen edges)
      const existingX = current.map(w => w.x);
      let chosenX = 15 + Math.random() * 65;
      for (let attempt = 0; attempt < 6; attempt++) {
        const tooClose = existingX.some(x => Math.abs(x - chosenX) < 13);
        if (!tooClose) break;
        chosenX = 15 + Math.random() * 65;
      }

      // Dynamic speed ramp as words neutralized increase
      const speedMultiplier = 1 + (wordsNeutralizedRef.current * config.speedRamp);
      const speed = config.baseSpeed * speedMultiplier * (0.9 + Math.random() * 0.2);

      const newWord = {
        ...newWordData,
        x: chosenX,
        y: 2, // Start at 2% top
        speed
      };

      return [...current, newWord];
    });
  }, [difficulty]);

  const spawnWordRef = useRef(spawnWord);
  useEffect(() => {
    spawnWordRef.current = spawnWord;
  }, [spawnWord]);

  // Focus input automatically
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Helper to compute live WPM and Accuracy
  const calculateLiveWpm = useCallback(() => {
    const elapsedMinutes = Math.max(elapsedSeconds, 1) / 60;
    const wpm = Math.round((correctKeystrokes / 5) / elapsedMinutes);
    return isNaN(wpm) || wpm < 0 ? 0 : wpm;
  }, [correctKeystrokes, elapsedSeconds]);

  const calculateLiveAccuracy = useCallback(() => {
    if (totalKeystrokes === 0) return 100;
    const acc = Math.round((correctKeystrokes / totalKeystrokes) * 100);
    return Math.min(100, Math.max(0, acc));
  }, [correctKeystrokes, totalKeystrokes]);

  // Trigger End Game (Victory or Game Over)
  const finishGame = useCallback((outcome) => {
    setGameState(outcome === 'Victory' ? 'victory' : 'gameover');
    if (outcome === 'Victory') {
      playVictorySound();
    } else {
      playGameOverSound();
    }

    const elapsedMin = Math.max(elapsedSeconds, 1) / 60;
    const finalWpm = Math.round((correctKeystrokes / 5) / elapsedMin);
    const finalAccuracy = totalKeystrokes === 0 ? 100 : Math.round((correctKeystrokes / totalKeystrokes) * 100);

    recordMatchResult({
      score,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      difficulty,
      mode,
      outcome,
      wordsTyped: wordsNeutralized,
      maxStreak: Math.max(streak, maxStreak)
    });
  }, [correctKeystrokes, elapsedSeconds, totalKeystrokes, score, difficulty, mode, wordsNeutralized, streak, maxStreak]);

  useEffect(() => {
    finishGameRef.current = finishGame;
  }, [finishGame]);

  // Initial 3-2-1 Countdown Loop
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        playKeyStrokeSound();
        setCountdown((prev) => prev - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
      lastSpawnTimeRef.current = performance.now();
      
      // Initialize with initial falling words so screen is immediately active!
      const initialWord1 = getRandomWord(difficulty, []);
      const initialWord2 = getRandomWord(difficulty, [initialWord1]);
      setActiveWords([
        {
          ...initialWord1,
          x: 25 + Math.random() * 20,
          y: 6,
          speed: configRef.current.baseSpeed
        },
        {
          ...initialWord2,
          x: 55 + Math.random() * 20,
          y: 16,
          speed: configRef.current.baseSpeed * 0.95
        }
      ]);
    }
  }, [gameState, countdown, difficulty]);

  // Main 1-second clock for timers and telemetry
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      if (mode === 'time_attack') {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (finishGameRef.current) finishGameRef.current('Victory');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, mode]);

  // Word Rush Mode check
  useEffect(() => {
    if (mode === 'word_rush' && wordsNeutralized >= 40 && gameState === 'playing') {
      if (finishGameRef.current) finishGameRef.current('Victory');
    }
  }, [mode, wordsNeutralized, gameState]);

  // Main 60fps Game Animation Frame Loop (Stable & decoupled from re-renders)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();
    if (lastSpawnTimeRef.current === 0) {
      lastSpawnTimeRef.current = performance.now();
    }

    const gameLoop = (currentTime) => {
      const now = currentTime || performance.now();
      const deltaTime = Math.min((now - lastTime) / 16.67, 3); // Normalize to ~60fps and clamp
      lastTime = now;

      const config = configRef.current;

      // Continuously check word spawning
      if (now - lastSpawnTimeRef.current > config.spawnInterval) {
        if (spawnWordRef.current) {
          spawnWordRef.current();
        }
        lastSpawnTimeRef.current = now;
      }

      // Update positions and check firewall breaches
      setActiveWords((prevWords) => {
        const survivingWords = [];
        let breached = false;

        for (const word of prevWords) {
          const newY = word.y + (word.speed * deltaTime);

          if (newY >= FIREWALL_THRESHOLD_Y) {
            // Firewall breached!
            breached = true;
            playShieldLost();
            // Particle burst at breach point
            setParticleBursts((prev) => [
              ...prev,
              { id: 'breach_' + Date.now(), x: word.x, y: FIREWALL_THRESHOLD_Y, color: 'rose' }
            ]);
          } else {
            survivingWords.push({ ...word, y: newY });
          }
        }

        if (breached) {
          setShields((currentShields) => {
            const nextShields = currentShields - 1;
            setFirewallAlarm(true);
            setTimeout(() => setFirewallAlarm(false), 600);

            // Break streak on shield loss
            setStreak(0);
            setComboMultiplier(1);

            if (nextShields <= 0 && finishGameRef.current) {
              finishGameRef.current('Defeat');
            }
            return Math.max(0, nextShields);
          });
        }

        return survivingWords;
      });

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  // Handle Input Changes & Prefix Highlight
  const handleInputChange = (e) => {
    const value = e.target.value;
    playKeyStrokeSound();
    setInputText(value);

    // Track total keystrokes
    if (value.length > inputText.length) {
      setTotalKeystrokes((prev) => prev + 1);
    }

    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;

    // Check if user has completely matched an active word
    const exactMatchIndex = activeWords.findIndex(
      (w) => w.text.toLowerCase() === trimmed
    );

    if (exactMatchIndex !== -1) {
      neutralizeWord(exactMatchIndex, trimmed);
    }
  };

  // Handle Enter / Space Submissions
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (gameState === 'playing') setGameState('paused');
      else if (gameState === 'paused') setGameState('playing');
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputText.trim().toLowerCase();
      if (!trimmed) return;

      const matchIndex = activeWords.findIndex(
        (w) => w.text.toLowerCase() === trimmed
      );

      if (matchIndex !== -1) {
        neutralizeWord(matchIndex, trimmed);
      } else {
        // Miss / Error submit
        playErrorBuzz();
        setInputShaking(true);
        setTimeout(() => setInputShaking(false), 300);
        setStreak(0);
        setComboMultiplier(1);
        setInputText('');
      }
    }
  };

  // Neutralize word successfully
  const neutralizeWord = (index, typedWord) => {
    const word = activeWords[index];
    if (!word) return;

    // Audio & Particle FX
    playLaserZap(comboMultiplier);
    setParticleBursts((prev) => [
      ...prev,
      { 
        id: 'burst_' + Date.now(), 
        x: word.x, 
        y: word.y, 
        color: word.tier === 'tier-3' ? 'purple' : word.tier === 'tier-2' ? 'cyan' : 'emerald' 
      }
    ]);

    // Update streak and combo multiplier
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setMaxStreak((prev) => Math.max(prev, nextStreak));

    let nextMultiplier = 1;
    if (nextStreak >= 15) nextMultiplier = 5;
    else if (nextStreak >= 10) nextMultiplier = 4;
    else if (nextStreak >= 6) nextMultiplier = 3;
    else if (nextStreak >= 3) nextMultiplier = 2;

    if (nextMultiplier > comboMultiplier) {
      playComboUp(nextMultiplier);
    }
    setComboMultiplier(nextMultiplier);

    // Calculate score
    const pointsGained = word.points * nextMultiplier;
    setScore((prev) => prev + pointsGained);
    setWordsNeutralized((prev) => prev + 1);

    // Keystroke statistics
    setCorrectKeystrokes((prev) => prev + typedWord.length + 1);

    // Remove word from active list and clear input
    setActiveWords((prev) => prev.filter((_, i) => i !== index));
    setInputText('');
  };

  // Restart / Reset
  const restartGame = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setActiveWords([]);
    setInputText('');
    setScore(0);
    setShields(MAX_SHIELDS);
    setStreak(0);
    setMaxStreak(0);
    setComboMultiplier(1);
    setWordsNeutralized(0);
    setElapsedSeconds(0);
    setTimeRemaining(mode === 'time_attack' ? 60 : 0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    lastSpawnTimeRef.current = 0;
    setCountdown(3);
    setGameState('countdown');
  };

  const currentWpm = calculateLiveWpm();
  const currentAccuracy = calculateLiveAccuracy();
  const stats = getStoredStats();
  const isNewHighScore = score > stats.highScore && score > 0;
  const currentRank = computeRankTier({ bestWpm: currentWpm, highScore: score, gamesPlayed: 10 });

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#07080d] overflow-hidden select-none">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-dense opacity-40 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-60 pointer-events-none" />

      {/* Screen-wide Firewall Alarm Flash */}
      {firewallAlarm && (
        <div className="absolute inset-0 bg-rose-600/20 z-40 pointer-events-none animate-pulse transition-opacity duration-300" />
      )}

      {/* Particle Bursts Layer */}
      {particleBursts.map((burst) => (
        <ParticleBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          color={burst.color}
          onComplete={() => setParticleBursts((prev) => prev.filter((b) => b.id !== burst.id))}
        />
      ))}

      {/* TOP HUD BAR */}
      <div className="relative z-20 bg-slate-950/90 border-b border-slate-800/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono backdrop-blur-md">
        
        {/* Left Telemetry (Score & Multiplier) */}
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">SCORE</span>
            <span className="text-lg font-black text-white font-mono tracking-wider">
              {score.toLocaleString()}
            </span>
          </div>

          <div className={`px-2.5 py-0.5 rounded-full border text-xs font-bold transition-all duration-300 ${
            comboMultiplier >= 4
              ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse'
              : comboMultiplier >= 2
              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            {comboMultiplier}x COMBO {streak > 0 && `(${streak})`}
          </div>

        </div>

        {/* Center Live WPM & Accuracy */}
        <div className="flex items-center gap-4 sm:gap-6 bg-slate-900/80 px-3.5 py-1 rounded-lg border border-slate-800">
          
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] uppercase">WPM:</span>
            <span className="text-cyan-400 font-bold text-sm font-mono">{currentWpm}</span>
          </div>

          <div className="w-[1px] h-3 bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] uppercase">ACC:</span>
            <span className="text-emerald-400 font-bold text-sm font-mono">{currentAccuracy}%</span>
          </div>

          <div className="w-[1px] h-3 bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] uppercase">PURGED:</span>
            <span className="text-purple-400 font-bold text-sm font-mono">{wordsNeutralized}</span>
          </div>

          {mode === 'time_attack' && (
            <>
              <div className="w-[1px] h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] uppercase">TIME:</span>
                <span className={`font-bold text-sm font-mono ${timeRemaining <= 10 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`}>
                  {timeRemaining}s
                </span>
              </div>
            </>
          )}

          {mode === 'word_rush' && (
            <>
              <div className="w-[1px] h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] uppercase">GOAL:</span>
                <span className="text-amber-400 font-bold text-sm font-mono">{wordsNeutralized}/40</span>
              </div>
            </>
          )}

        </div>

        {/* Right Defensive Shields & Pause */}
        <div className="flex items-center gap-4">
          
          {/* Shields Integrity */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 uppercase text-[10px] tracking-wider hidden sm:inline">SHIELDS:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_SHIELDS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-4.5 rounded-sm transition-all duration-300 ${
                    i < shields
                      ? shields <= 2
                        ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                        : 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                      : 'bg-slate-800 border border-slate-700/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Pause Button */}
          <button
            type="button"
            onClick={() => {
              playKeyStrokeSound();
              setGameState(gameState === 'playing' ? 'paused' : 'playing');
            }}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors"
          >
            {gameState === 'paused' ? 'RESUME' : 'PAUSE'}
          </button>

        </div>

      </div>

      {/* GAME ARENA VIEWPORT */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto overflow-hidden">
        
        {/* Falling Words Stream */}
        {activeWords.map((word) => {
          const trimmedInput = inputText.trim().toLowerCase();
          const wordLower = word.text.toLowerCase();
          const isTarget = trimmedInput.length > 0 && wordLower.startsWith(trimmedInput);
          const matchedPart = isTarget ? word.text.substring(0, trimmedInput.length) : '';
          const remainderPart = isTarget ? word.text.substring(trimmedInput.length) : word.text;

          // Tier color styling
          let tierBorder = 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200';
          let glowClass = 'shadow-[0_0_10px_rgba(0,240,255,0.2)]';

          if (word.tier === 'tier-3') {
            tierBorder = 'border-purple-500/50 bg-purple-950/40 text-purple-200';
            glowClass = 'shadow-[0_0_12px_rgba(168,85,247,0.3)]';
          } else if (word.tier === 'tier-2') {
            tierBorder = 'border-teal-500/40 bg-teal-950/40 text-teal-200';
            glowClass = 'shadow-[0_0_10px_rgba(20,184,166,0.2)]';
          }

          if (isTarget) {
            tierBorder = 'border-cyan-400 bg-slate-900 text-white ring-2 ring-cyan-400/80';
            glowClass = 'shadow-[0_0_20px_rgba(0,240,255,0.6)] scale-110';
          }

          return (
            <div
              key={word.id}
              className={`absolute transition-transform duration-75 px-3 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-bold tracking-wide backdrop-blur-sm pointer-events-none flex items-center gap-1.5 ${tierBorder} ${glowClass}`}
              style={{
                left: `${word.x}%`,
                top: `${word.y}%`,
                transform: `translateX(-50%)`
              }}
            >
              {isTarget && (
                <span className="text-[10px] text-cyan-400 animate-pulse font-mono tracking-tighter">
                  [LOCK]
                </span>
              )}

              {/* Text with prefix match highlighting */}
              <span>
                {matchedPart && (
                  <span className="text-cyan-400 bg-cyan-500/20 px-0.5 rounded font-black neon-glow-cyan">
                    {matchedPart}
                  </span>
                )}
                <span className={isTarget ? 'text-slate-100' : ''}>
                  {remainderPart}
                </span>
              </span>

              <span className="text-[9px] text-slate-400 font-mono">
                +{word.points}
              </span>
            </div>
          );
        })}

        {/* FIREWALL THRESHOLD LINE (BOTTOM DANGER ZONE) */}
        <div 
          className="absolute left-0 right-0 z-10 flex items-center justify-between px-4 border-t-2 border-dashed border-rose-500/70 animate-firewall"
          style={{ top: `${FIREWALL_THRESHOLD_Y}%` }}
        >
          <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/50 -mt-3.5">
            ⚠️ FIREWALL DEFENSE PERIMETER
          </div>
          <div className="text-[10px] font-mono tracking-widest text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/50 -mt-3.5 hidden sm:block">
            CRITICAL BREACH THRESHOLD
          </div>
        </div>

      </div>

      {/* BOTTOM INPUT COMMAND DECK */}
      <div className="relative z-20 bg-slate-950/95 border-t border-slate-800 p-4 sm:p-5 backdrop-blur-lg">
        <div className="max-w-2xl mx-auto space-y-2">
          
          <div className="relative flex items-center">
            
            {/* Terminal Prompt Indicator */}
            <div className="absolute left-4 flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-sm pointer-events-none">
              <span className="animate-pulse">❯</span>
              <span className="text-slate-500 text-xs hidden sm:inline">INPUT:</span>
            </div>

            {/* Controlled Text Input Box */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={gameState !== 'playing'}
              placeholder={gameState === 'playing' ? 'Type falling word syntax... (Space/Enter to submit)' : 'Terminal offline'}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className={`w-full pl-16 sm:pl-24 pr-20 py-3.5 sm:py-4 bg-slate-900/90 rounded-xl border text-cyan-300 font-mono text-base sm:text-lg tracking-wider focus:outline-none transition-all duration-200 ${
                inputShaking
                  ? 'border-rose-500 ring-2 ring-rose-500/50 bg-rose-950/30'
                  : 'border-cyan-500/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
              }`}
            />

            {/* Clear / Key Hint */}
            <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                SPACE / ENTER
              </span>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
            <span>DIFFICULTY: <span className="text-cyan-400 uppercase">{difficulty}</span></span>
            <span>MODE: <span className="text-purple-400 uppercase">{mode.replace('_', ' ')}</span></span>
            <span className="hidden sm:inline">PRESS <span className="text-slate-200">ESC</span> TO PAUSE</span>
          </div>

        </div>
      </div>

      {/* MODAL: COUNTDOWN OVERLAY */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4 animate-scaleUp">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              INITIALIZING NEURAL LINK...
            </div>
            <div className="text-7xl sm:text-9xl font-black font-mono text-transparent bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-sm">
              Prepare your fingers. Neutralize packets before they cross the red firewall!
            </p>
          </div>
        </div>
      )}

      {/* MODAL: PAUSE MENU */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center">
            
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                STREAM SUSPENDED
              </span>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase">
                Terminal Paused
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-left font-mono text-xs">
              <div>
                <span className="text-slate-500">Current Score:</span>
                <p className="text-base font-bold text-white">{score}</p>
              </div>
              <div>
                <span className="text-slate-500">Current WPM:</span>
                <p className="text-base font-bold text-cyan-400">{currentWpm}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  playKeyStrokeSound();
                  setGameState('playing');
                }}
                className="w-full py-3 rounded-xl font-mono font-bold text-sm uppercase bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
              >
                Resume Terminal
              </button>

              <button
                type="button"
                onClick={() => {
                  playKeyStrokeSound();
                  restartGame();
                }}
                className="w-full py-3 rounded-xl font-mono font-semibold text-sm uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
              >
                Restart Mission
              </button>

              <button
                type="button"
                onClick={() => {
                  playKeyStrokeSound();
                  navigate('/');
                }}
                className="w-full py-3 rounded-xl font-mono text-xs uppercase text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Abort & Return to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: POST-GAME SUMMARY (VICTORY / GAMEOVER) */}
      {(gameState === 'gameover' || gameState === 'victory') && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            
            {/* Header & Outcome */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono border uppercase tracking-wider mb-1">
                {gameState === 'victory' ? (
                  <span className="text-emerald-400 border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 rounded">
                    MISSION ACCOMPLISHED
                  </span>
                ) : (
                  <span className="text-rose-400 border-rose-500/40 bg-rose-950/50 px-2 py-0.5 rounded">
                    FIREWALL BREACHED
                  </span>
                )}
              </div>

              <h2 className={`text-3xl sm:text-4xl font-black font-mono uppercase tracking-tight ${
                gameState === 'victory' 
                  ? 'text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text'
                  : 'text-transparent bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text'
              }`}>
                {gameState === 'victory' ? 'VICTORY' : 'GAME OVER'}
              </h2>

              {isNewHighScore && (
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono animate-bounce">
                  ⭐ NEW PERSONAL HIGH SCORE!
                </div>
              )}
            </div>

            {/* Scoreboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase">FINAL SCORE</span>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1">{score.toLocaleString()}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase">SPEED (WPM)</span>
                <p className="text-xl sm:text-2xl font-bold text-purple-400 mt-1">{currentWpm}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase">ACCURACY</span>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{currentAccuracy}%</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase">WORDS PURGED</span>
                <p className="text-lg font-bold text-slate-200 mt-1">{wordsNeutralized}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase">MAX STREAK</span>
                <p className="text-lg font-bold text-amber-400 mt-1">{Math.max(streak, maxStreak)}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase">MISSION TIME</span>
                <p className="text-lg font-bold text-slate-200 mt-1">{elapsedSeconds}s</p>
              </div>

            </div>

            {/* Rank Assessment */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Pilot Assessment:</span>
              <span className={`px-2.5 py-1 rounded-md border font-bold ${currentRank.color}`}>
                {currentRank.title}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              
              <button
                type="button"
                onClick={() => {
                  playKeyStrokeSound();
                  restartGame();
                }}
                className="w-full py-3.5 rounded-xl font-mono font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Re-Deploy (Play Again)
              </button>

              <div className="grid grid-cols-2 gap-3">
                
                <button
                  type="button"
                  onClick={() => {
                    playKeyStrokeSound();
                    navigate('/profile');
                  }}
                  className="py-3 rounded-xl font-mono font-medium text-xs uppercase bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playKeyStrokeSound();
                    navigate('/');
                  }}
                  className="py-3 rounded-xl font-mono font-medium text-xs uppercase bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Main Dashboard
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
