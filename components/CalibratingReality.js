import React from 'react';

export default function CalibratingReality() {
  return (
    <div className="bg-background text-on-background font-body h-screen w-screen overflow-hidden flex flex-col items-center justify-center fixed inset-0 z-50">
      {/* Atmospheric Particles (PlayOnMeet Dust) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[10%]" style={{ animation: 'calibrating-particle-drift 8s linear infinite' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[30%]" style={{ animation: 'calibrating-particle-drift 12s linear infinite 2s' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[50%]" style={{ animation: 'calibrating-particle-drift 10s linear infinite 5s' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[70%]" style={{ animation: 'calibrating-particle-drift 15s linear infinite 1s' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[90%]" style={{ animation: 'calibrating-particle-drift 9s linear infinite 7s' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[25%]" style={{ animation: 'calibrating-particle-drift 11s linear infinite 4s' }}></div>
        <div className="calibrating-obsidian-dust absolute bottom-[-10px] left-[85%]" style={{ animation: 'calibrating-particle-drift 14s linear infinite 3s' }}></div>
      </div>

      {/* Center Composition */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Rotating Calibration Rings */}
        <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-primary/20 rounded-full" style={{ animation: 'calibrating-rotate-slow 20s linear infinite' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(192,193,255,1)]"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 w-[22rem] h-[22rem] border border-primary-container/10 border-dashed rounded-full" style={{ animation: 'calibrating-rotate-fast 15s linear infinite' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[26rem] h-[26rem] border-2 border-white/5 rounded-full" style={{ animation: 'calibrating-rotate-slow 40s linear reverse infinite' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-tertiary rounded-full"></div>
        </div>

        {/* Inner Ambient Glow */}
        <div className="absolute w-64 h-64 calibrating-shard-glow rounded-full" style={{ animation: 'calibrating-pulse-glow 4s ease-in-out infinite' }}></div>

        {/* The Central Shard */}
        <div className="relative z-10 flex items-center justify-center" style={{ animation: 'calibrating-float 6s ease-in-out infinite' }}>
          <div className="w-48 h-64 bg-surface-container-highest relative overflow-hidden shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 20%, 80% 80%, 50% 100%, 20% 80%, 0% 20%)' }}>
            <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-surface-container-lowest via-surface-container-high to-primary/20"></div>
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" style={{ animation: 'calibrating-pulse-glow 3s ease-in-out infinite' }}></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></div>
          </div>
          {/* Decorative Ghost Borders for Shard */}
          <div className="absolute w-[13rem] h-[17rem] border border-primary/10" style={{ clipPath: 'polygon(50% 0%, 100% 20%, 80% 80%, 50% 100%, 20% 80%, 0% 20%)' }}></div>
        </div>
      </div>

      {/* Text Metadata */}
      <div className="mt-24 text-center z-20">
        <h2 className="text-primary font-headline text-sm tracking-[0.4em] uppercase font-light opacity-80 mb-2">
          Syncing Universe
        </h2>
        <p className="text-secondary font-label text-[10px] tracking-widest uppercase opacity-40">
          Syncing PlayOnMeet Nexus Sequence
        </p>
      </div>

      {/* Minimalist Progress Bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-64">
        <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px]" style={{ left: '20%' }}></div>
          <div className="h-full bg-primary shadow-[0_0_15px_rgba(192,193,255,0.6)]" style={{ width: '90%' }}></div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[9px] font-label text-primary/40 tracking-tighter">DATA_STREAM: ACTIVE</span>
          <span className="text-[9px] font-label text-primary tracking-widest">90%</span>
        </div>
      </div>

      {/* Subtle Brand Anchor */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="font-headline text-xs tracking-[0.6em] font-black text-primary/20 uppercase">PlayOnMeet</span>
      </div>

      {/* Corner Decorative Elements */}
      <div className="fixed top-8 left-8 border-l border-t border-primary/10 w-8 h-8 opacity-40"></div>
      <div className="fixed top-8 right-8 border-r border-t border-primary/10 w-8 h-8 opacity-40"></div>
      <div className="fixed bottom-8 left-8 border-l border-b border-primary/10 w-8 h-8 opacity-40"></div>
      <div className="fixed bottom-8 right-8 border-r border-b border-primary/10 w-8 h-8 opacity-40"></div>
    </div>
  );
}
