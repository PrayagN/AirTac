import React from "react";
import Link from "next/link";

export const metadata = {
  title: "SOS Strategy Game — Official Rulebook, Tactics & Online Play",
  description:
    "Master the classic SOS grid strategy game online. Learn complete rules, mathematical game theory, opening traps, and play with bare-hand gestures on Google Meet or Zoom.",
};

export default function SOSGamePage() {
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
        {/* Header */}
        <header className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider">
              Strategy & Game Theory
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">2 Players &bull; 5–10 Mins</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            SOS Strategy Game
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed mb-8">
            The definitive pencil-and-paper grid puzzle, evolved for bare-hand gesture interaction inside your browser. Master the tactics of forced move cascades, dual-cell hazards, and parity advantage.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/play"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              Play SOS Online Now
            </Link>
            <Link
              href="/guides/sos-game-rules-and-strategy"
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">menu_book</span>
              Read 2,000-Word Masterguide
            </Link>
          </div>
        </header>

        {/* Section: Rulebook */}
        <section className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c0c1ff]">gavel</span>
            Official Rulebook
          </h2>
          <p className="text-[#bcc7de]/90 leading-relaxed">
            The rules of SOS are universally elegant, yet allow for exponential tactical complexity as the grid fills:
          </p>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] font-black text-sm flex items-center justify-center shrink-0">1</span>
              <div>
                <h3 className="font-bold text-white mb-1">Turn Action</h3>
                <p className="text-sm text-[#bcc7de]/80">On each turn, a player selects any empty cell in the grid and places either an &quot;S&quot; or an &quot;O&quot;.</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] font-black text-sm flex items-center justify-center shrink-0">2</span>
              <div>
                <h3 className="font-bold text-white mb-1">Scoring an S-O-S</h3>
                <p className="text-sm text-[#bcc7de]/80">If a player&apos;s placement completes one or more &quot;S-O-S&quot; sequences (horizontally, vertically, or diagonally), they earn 1 point per sequence formed.</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] font-black text-sm flex items-center justify-center shrink-0">3</span>
              <div>
                <h3 className="font-bold text-white mb-1">Bonus Turn Rule</h3>
                <p className="text-sm text-[#bcc7de]/80">When a player scores a point, they <strong>must take an extra turn</strong> immediately. Skilled players can chain 3, 4, or 5+ completions in a single turn cascade.</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] font-black text-sm flex items-center justify-center shrink-0">4</span>
              <div>
                <h3 className="font-bold text-white mb-1">Game Conclusion</h3>
                <p className="text-sm text-[#bcc7de]/80">The game ends when every single cell on the board has been filled. The player with the highest total score wins.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Strategic Concepts */}
        <section className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c0c1ff]">psychology</span>
            Key Strategic Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">The Defensive Wall</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                During early gameplay, avoid placing an &quot;S&quot; adjacent to another letter unless you can immediately complete an S-O-S. Scatter letters toward corners to minimize attack vectors.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Dual-Cell Hazards</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                A dual hazard occurs when two open cells could both form an S-O-S sequence. Force your opponent into filling the first hazard, leaving you to claim the second.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">&quot;O&quot; Buffer Zones</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                Placing an isolated &quot;O&quot; is safer than an isolated &quot;S&quot; because completing an S-O-S with an &quot;O&quot; requires two surrounding &quot;S&quot; letters to be placed first.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">Chain Reaction Setup</h3>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">
                Set up move sequences where your bonus turn allows you to immediately trigger another S-O-S completion across intersecting diagonal lines.
              </p>
            </div>
          </div>
        </section>

        {/* Play CTA */}
        <section className="text-center py-6">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your SOS Strategy?</h2>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-base hover:opacity-90 transition-opacity"
          >
            Start SOS Room Session
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
