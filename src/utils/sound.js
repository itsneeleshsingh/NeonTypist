// Web Audio API Retro Synth Sound Engine (Zero external dependencies)
import { getStoredSoundSettings } from './storage';

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Check if sound is active
const isAudioActive = () => {
  const settings = getStoredSoundSettings();
  return settings.soundEnabled;
};

const getGlobalGain = (ctx, baseVolume = 0.2) => {
  const settings = getStoredSoundSettings();
  const gainNode = ctx.createGain();
  const volumeMultiplier = settings.volume !== undefined ? settings.volume : 0.5;
  gainNode.gain.setValueAtTime(baseVolume * volumeMultiplier, ctx.currentTime);
  gainNode.connect(ctx.destination);
  return gainNode;
};

// Keystroke futuristic click
export const playKeyStrokeSound = () => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    const masterGain = getGlobalGain(ctx, 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Graceful fallback if audio is blocked
  }
};

// Word Laser Neutralization sound
export const playLaserZap = (combo = 1) => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const baseFreq = Math.min(1200, 700 + (combo * 60));
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

    const masterGain = getGlobalGain(ctx, 0.22);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.17);
  } catch {
    // Graceful fallback
  }
};

// Combo Multiplier Arpeggio
export const playComboUp = (level = 2) => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;
    const masterGain = getGlobalGain(ctx, 0.18);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + (idx * 0.05);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * (1 + (level * 0.05)), noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  } catch {
    // Graceful fallback
  }
};

// Glitch Error Buzzer
export const playErrorBuzz = () => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.12);

    const masterGain = getGlobalGain(ctx, 0.16);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch {
    // Graceful fallback
  }
};

// Firewall Breach / Shield Loss
export const playShieldLost = () => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterGain = getGlobalGain(ctx, 0.25);

    [220, 160].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + (idx * 0.1);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  } catch {
    // Graceful fallback
  }
};

// Game Over Sound
export const playGameOverSound = () => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [440, 370, 311, 220];
    const now = ctx.currentTime;
    const masterGain = getGlobalGain(ctx, 0.25);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + (idx * 0.18);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.36);
    });
  } catch {
    // Graceful fallback
  }
};

// Victory Sound
export const playVictorySound = () => {
  if (!isAudioActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = ctx.currentTime;
    const masterGain = getGlobalGain(ctx, 0.25);

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + (idx * 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.46);
    });
  } catch {
    // Graceful fallback
  }
};
