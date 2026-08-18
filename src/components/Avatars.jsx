import React from 'react';

export const AvatarIcon = ({ id = 'cyber_helmet', className = 'w-12 h-12' }) => {
  switch (id) {
    case 'laser_visor':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#120c22" stroke="#d946ef" strokeWidth="2" />
          <path d="M12 24H52V36C52 44 44 52 32 52C20 52 12 44 12 36V24Z" fill="#1e1035" stroke="#a855f7" strokeWidth="2" />
          <rect x="16" y="28" width="32" height="10" rx="3" fill="#f43f5e" />
          <line x1="20" y1="33" x2="44" y2="33" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="22" cy="18" r="2" fill="#00f0ff" />
          <circle cx="42" cy="18" r="2" fill="#00f0ff" />
        </svg>
      );

    case 'neural_chip':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#091c18" stroke="#10b981" strokeWidth="2" />
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
          <path d="M32 12V20M32 44V52M12 32H20M44 32H52M24 12V20M24 44V52M40 12V20M40 44V52M12 24H20M44 24H52M12 40H20M44 40H52" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="32" r="4" fill="#00f0ff" />
        </svg>
      );

    case 'matrix_skull':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#1f0f18" stroke="#f43f5e" strokeWidth="2" />
          <path d="M18 28C18 19 24 14 32 14C40 14 46 19 46 28C46 34 43 38 41 40V48H23V40C21 38 18 34 18 28Z" fill="#2d101f" stroke="#fb7185" strokeWidth="2" />
          <circle cx="26" cy="28" r="4" fill="#00f0ff" />
          <circle cx="38" cy="28" r="4" fill="#00f0ff" />
          <path d="M30 36L32 38L34 36" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 44H38M28 48H36" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'cyber_oni':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#1c1209" stroke="#f59e0b" strokeWidth="2" />
          <path d="M18 14L24 24M46 14L40 24" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 26C16 38 22 50 32 50C42 50 48 38 48 26C48 22 42 20 32 20C22 20 16 22 16 26Z" fill="#3b1d09" stroke="#fbbf24" strokeWidth="2" />
          <rect x="22" y="28" width="8" height="4" rx="1" fill="#f43f5e" />
          <rect x="34" y="28" width="8" height="4" rx="1" fill="#f43f5e" />
          <path d="M24 40L28 36H36L40 40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'quantum_core':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#081528" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="32" cy="32" rx="20" ry="7" stroke="#38bdf8" strokeWidth="2" transform="rotate(30 32 32)" />
          <ellipse cx="32" cy="32" rx="20" ry="7" stroke="#818cf8" strokeWidth="2" transform="rotate(-30 32 32)" />
          <ellipse cx="32" cy="32" rx="20" ry="7" stroke="#00f0ff" strokeWidth="2" transform="rotate(90 32 32)" />
          <circle cx="32" cy="32" r="5" fill="#00f0ff" />
        </svg>
      );

    case 'synth_bot':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#0b1b1d" stroke="#2dd4bf" strokeWidth="2" />
          <path d="M16 22C16 18 20 16 32 16C44 16 48 18 48 22V44C48 48 44 50 32 50C20 50 16 48 16 44V22Z" fill="#133336" stroke="#2dd4bf" strokeWidth="2" />
          <rect x="22" y="24" width="20" height="8" rx="2" fill="#0d9488" stroke="#5eead4" strokeWidth="1.5" />
          <circle cx="27" cy="28" r="2" fill="#00f0ff" />
          <circle cx="37" cy="28" r="2" fill="#00f0ff" />
          <line x1="24" y1="40" x2="40" y2="40" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="10" x2="32" y2="16" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="8" r="2" fill="#f43f5e" />
        </svg>
      );

    case 'cyber_eye':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#170c28" stroke="#a78bfa" strokeWidth="2" />
          <path d="M12 32C18 20 46 20 52 32C46 44 18 44 12 32Z" fill="#241442" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="32" cy="32" r="10" stroke="#00f0ff" strokeWidth="2" />
          <circle cx="32" cy="32" r="5" fill="#c084fc" />
          <circle cx="32" cy="32" r="2" fill="#fff" />
          <line x1="32" y1="14" x2="32" y2="20" stroke="#a78bfa" strokeWidth="1.5" />
          <line x1="32" y1="44" x2="32" y2="50" stroke="#a78bfa" strokeWidth="1.5" />
        </svg>
      );

    case 'cyber_helmet':
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#0a121e" stroke="#00f0ff" strokeWidth="2" />
          <path d="M16 26C16 17 23 12 32 12C41 12 48 17 48 26V42C48 48 42 52 32 52C22 52 16 48 16 42V26Z" fill="#0f2137" stroke="#00f0ff" strokeWidth="2" />
          <path d="M18 28H46V36C46 40 40 43 32 43C24 43 18 40 18 36V28Z" fill="#00f0ff" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="22" y1="32" x2="42" y2="32" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="20" r="2" fill="#a855f7" />
          <line x1="20" y1="46" x2="26" y2="46" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="46" x2="44" y2="46" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
