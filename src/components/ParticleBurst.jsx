import React, { useEffect, useState } from 'react';

export const ParticleBurst = ({ x, y, color = 'cyan', onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const count = 12;
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 50;
      const size = 3 + Math.random() * 4;
      const duration = 0.4 + Math.random() * 0.3;
      items.push({
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size,
        duration
      });
    }
    setParticles(items);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const colorMap = {
    cyan: 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]',
    purple: 'bg-fuchsia-400 shadow-[0_0_8px_#d946ef]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    rose: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
    amber: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
  };

  const bgStyle = colorMap[color] || colorMap.cyan;

  return (
    <div 
      className="pointer-events-none absolute z-30" 
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${bgStyle} animate-ping`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `translate(${p.dx}px, ${p.dy}px)`,
            transition: `all ${p.duration}s cubic-bezier(0, 0.9, 0.2, 1)`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
};
