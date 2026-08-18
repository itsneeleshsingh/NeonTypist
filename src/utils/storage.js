// Storage Utilities for Neon Typist
const PROFILE_KEY = 'neon_typist_profile';
const STATS_KEY = 'neon_typist_stats';
const SOUND_KEY = 'neon_typist_sound';

const DEFAULT_PROFILE = {
  handle: 'CyberRunner_01',
  bio: 'Neutralizing high-velocity data packets across the neural grid.',
  avatarId: 'cyber_helmet',
  themeAccent: 'cyan',
  createdDate: new Date().toISOString()
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  victories: 0,
  highScore: 0,
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 100,
  totalWordsTyped: 0,
  totalKeystrokes: 0,
  totalCorrectKeystrokes: 0,
  highestStreak: 0,
  recentMatches: []
};

const DEFAULT_SOUND = {
  soundEnabled: true,
  volume: 0.5
};

export const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveStoredProfile = (profile) => {
  try {
    const current = getStoredProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save profile:', err);
    return profile;
  }
};

export const getStoredStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
};

export const recordMatchResult = (match) => {
  try {
    const stats = getStoredStats();
    const gamesPlayed = stats.gamesPlayed + 1;
    const victories = match.outcome === 'Victory' ? stats.victories + 1 : stats.victories;
    const highScore = Math.max(stats.highScore, match.score || 0);
    const bestWpm = Math.max(stats.bestWpm, match.wpm || 0);
    const totalWordsTyped = stats.totalWordsTyped + (match.wordsTyped || 0);
    const highestStreak = Math.max(stats.highestStreak, match.maxStreak || 0);

    // Calculate rolling averages
    const prevGames = stats.gamesPlayed;
    const newAvgWpm = prevGames === 0 
      ? match.wpm 
      : Math.round(((stats.avgWpm * prevGames) + match.wpm) / gamesPlayed);
      
    const newAvgAccuracy = prevGames === 0 
      ? match.accuracy 
      : Math.round(((stats.avgAccuracy * prevGames) + match.accuracy) / gamesPlayed);

    const matchRecord = {
      id: 'match_' + Date.now(),
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      score: match.score,
      wpm: match.wpm,
      accuracy: match.accuracy,
      difficulty: match.difficulty,
      mode: match.mode,
      outcome: match.outcome,
      wordsTyped: match.wordsTyped || 0,
      maxStreak: match.maxStreak || 0
    };

    const recentMatches = [matchRecord, ...(stats.recentMatches || [])].slice(0, 15);

    const updatedStats = {
      gamesPlayed,
      victories,
      highScore,
      bestWpm,
      avgWpm: newAvgWpm,
      avgAccuracy: newAvgAccuracy,
      totalWordsTyped,
      highestStreak,
      recentMatches
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (err) {
    console.error('Failed to record match:', err);
    return DEFAULT_STATS;
  }
};

export const getStoredSoundSettings = () => {
  try {
    const raw = localStorage.getItem(SOUND_KEY);
    if (!raw) return DEFAULT_SOUND;
    return { ...DEFAULT_SOUND, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SOUND;
  }
};

export const saveStoredSoundSettings = (settings) => {
  try {
    const current = getStoredSoundSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SOUND_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save sound settings:', err);
    return settings;
  }
};

export const resetAllStoredData = () => {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STATS_KEY);
    return {
      profile: DEFAULT_PROFILE,
      stats: DEFAULT_STATS
    };
  } catch (err) {
    console.error('Failed to reset data:', err);
    return null;
  }
};

// Compute dynamic cyber rank tier
export const computeRankTier = (stats) => {
  const { bestWpm = 0, gamesPlayed = 0, highScore = 0 } = stats || {};

  if (bestWpm >= 100 || highScore >= 10000) {
    return {
      title: 'Neon Archon',
      badge: 'OVERCLOCK',
      color: 'text-rose-400 border-rose-500/60 bg-rose-500/10 shadow-rose-500/30',
      description: 'Transcendent velocity. Grid master.'
    };
  }
  if (bestWpm >= 80 || highScore >= 6000) {
    return {
      title: 'Matrix Phantom',
      badge: 'ELITE',
      color: 'text-purple-400 border-purple-500/60 bg-purple-500/10 shadow-purple-500/30',
      description: 'Lightning-fast synapse reflexes.'
    };
  }
  if (bestWpm >= 55 || highScore >= 3000) {
    return {
      title: 'Cyber Scribe',
      badge: 'VETERAN',
      color: 'text-cyan-400 border-cyan-500/60 bg-cyan-500/10 shadow-cyan-500/30',
      description: 'Formidable netrunner in the stream.'
    };
  }
  if (bestWpm >= 35 || gamesPlayed >= 3) {
    return {
      title: 'Grid Runner',
      badge: 'SPECIALIST',
      color: 'text-emerald-400 border-emerald-500/60 bg-emerald-500/10 shadow-emerald-500/30',
      description: 'Proficient terminal operative.'
    };
  }
  return {
    title: 'Cadet Initiate',
    badge: 'RECRUIT',
    color: 'text-slate-300 border-slate-600 bg-slate-800/40 shadow-slate-700/30',
    description: 'Fresh connection to the cyber-grid.'
  };
};
