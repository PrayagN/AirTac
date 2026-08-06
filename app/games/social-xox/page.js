import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Social XOX — Interactive Tic-Tac-Toe for Video Calls",
  description:
    "Play Social XOX online: classic Tic-Tac-Toe reimagined for video calls with bare-hand webcam gesture controls on PlayOnMeet.",
};

export default function SocialXOXPage() {
  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/60 backdrop-blur-xl border-b border-white/5 py-5 px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
            <span className="font-light text-white/70">PLAY</span>
            <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">ON</span>
            <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent font-black tracking-tighter">MEET</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/games" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#ddb7ff] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Games
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-32 pb-24 px-8 max-w-4xl mx-auto space-y-12">
        <header className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#8ff5ff]/10 border border-[#8ff5ff]/20 text-[#8ff5ff] text-xs font-bold uppercase tracking-wider">
              Casual & Quick Play
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">2 Players &bull; 2–5 Mins</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Social XOX
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed mb-8">
            Classic Tic-Tac-Toe elevated for modern video calls. Play with friends during Zoom or Google Meet meetings using bare-hand gesture controls and peer-to-peer data sync.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/play"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">videocam</span>
              Play Social XOX Now
            </Link>
            <Link
              href="/guides/remote-team-icebreakers-mastery"
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">groups</span>
              Icebreaker Playbook Guide
            </Link>
          </div>
        </header>

        {/* Section: Features */}
        <section className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c0c1ff]">grid_view</span>
            Game Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Instant Room Link</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                Create a room in one click and share a 5-character code. Your opponent joins in their browser with zero sign-up.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Eye-Contact Friendly</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                Positioned over video grids so you can play while talking, keeping full eye contact with your opponent.
              </p>
            </div>
          </div>
        </section>

        {/* Play CTA */}
        <section className="text-center py-6">
          <h2 className="text-2xl font-bold text-white mb-4">Ready for a Quick Match?</h2>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-base hover:opacity-90 transition-opacity"
          >
            Start Social XOX Room
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/games" className="hover:text-[#c0c1ff] transition-colors">Games</Link>
            <Link href="/guides" className="hover:text-[#c0c1ff] transition-colors">Guides</Link>
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
