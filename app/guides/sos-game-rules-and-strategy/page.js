import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Complete SOS Game Rules, Tactics & Game Theory Guide — PlayOnMeet",
  description:
    "Master the ultimate guide to SOS game rules, mathematical board control, forced move cascades, dual-cell hazards, and opening strategies for 3x3 to 6x6 grids.",
};

export default function SOSRulesGuidePage() {
  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/60 backdrop-blur-xl border-b border-white/5 py-5 px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
            <span className="font-light text-white/70">PLAY</span>
            <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">ON</span>
            <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent font-black tracking-tighter">MEET</span>
          </Link>
          <Link href="/guides" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#ddb7ff] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Guides
          </Link>
        </div>
      </nav>

      {/* Guide Content */}
      <main className="pt-32 pb-24 px-8 max-w-4xl mx-auto space-y-10">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider">
              Strategy & Game Theory
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">12 min read &bull; Updated August 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            The Ultimate SOS Game Rules & Winning Strategy Guide
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed">
            By Dr. Priya Nair, Game Theory Specialist & Senior Algorithmic Contributor at PlayOnMeet
          </p>
        </header>

        <hr className="border-white/5" />

        <article className="prose prose-invert max-w-none space-y-8 text-[#bcc7de]/90 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Introduction to SOS</h2>
            <p>
              SOS is one of the most celebrated two-player pencil-and-paper games in history. While its premise is instantly approachable for players of all ages, its underlying decision tree contains deep mathematical nuances. Unlike traditional solved grid games like 3x3 Tic-Tac-Toe, SOS features dynamic parity switches and exponential chain completions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. Fundamental Rulebook</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Grid Setup:</strong> The game is played on a square grid ($N \times N$), typically ranging from $3 \times 3$ for fast casual matches up to $6 \times 6$ or $8 \times 8$ for competitive strategy.</li>
              <li><strong>Turn Mechanics:</strong> Players alternate turns. On each turn, a player must choose one empty cell and write either an &quot;S&quot; or an &quot;O&quot;.</li>
              <li><strong>Scoring:</strong> Whenever a placed letter completes the three-letter sequence &quot;S-O-S&quot; in a straight line (horizontally, vertically, or diagonally), the active player earns 1 point.</li>
              <li><strong>Bonus Turns:</strong> Scoring an S-O-S grants an immediate additional turn. If that additional turn completes another S-O-S, the player receives another turn, enabling multi-point cascades.</li>
              <li><strong>Victory Condition:</strong> The game continues until all grid spaces are filled. The player with the highest accumulated score wins.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">3. Advanced Tactical Mechanics</h2>
            <h3 className="text-xl font-bold text-white">A. The Trap Avoidance Principle</h3>
            <p>
              The defining tactical rule of SOS is never to place a letter that gives your opponent a free S-O-S setup on their following move. Placing an &quot;S&quot; near another &quot;S&quot; separated by an empty space creates an obvious &quot;O&quot; completion opportunity for your opponent.
            </p>

            <h3 className="text-xl font-bold text-white">B. Corner Anchoring</h3>
            <p>
              When starting on larger grids ($4 \times 4$ or $5 \times 5$), placing initial &quot;S&quot; characters in extreme corners minimizes the number of neighboring cells. A corner cell has only 3 adjacent neighbors, whereas a central cell has 8 adjacent neighbors, drastically reducing early risk.
            </p>

            <h3 className="text-xl font-bold text-white">C. Dual Hazards & Forced Moves</h3>
            <p>
              Advanced players win games by constructing positions where their opponent is forced into filling a space that creates two simultaneous S-O-S setups. The opponent can only claim one of the setups, leaving the remaining setup (plus the resulting bonus chain) to the second player.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/40 my-8">
            <h3 className="text-xl font-bold text-white mb-2">Grid Size Quick Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#c0c1ff]">
                    <th className="py-2">Grid Size</th>
                    <th className="py-2">Total Spaces</th>
                    <th className="py-2">Ideal Play Time</th>
                    <th className="py-2">Strategic Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 font-bold text-white">3 x 3</td>
                    <td className="py-2">9</td>
                    <td className="py-2">2 Mins</td>
                    <td className="py-2">Fast parity calculation & tactical traps</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">4 x 4</td>
                    <td className="py-2">16</td>
                    <td className="py-2">5 Mins</td>
                    <td className="py-2">Corner anchoring & move counting</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">5 x 5</td>
                    <td className="py-2">25</td>
                    <td className="py-2">8 Mins</td>
                    <td className="py-2">Deep endgame chain calculation</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">6 x 6</td>
                    <td className="py-2">36</td>
                    <td className="py-2">12 Mins</td>
                    <td className="py-2">Master territory control & multi-line cascades</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">4. Playing SOS Online on PlayOnMeet</h2>
            <p>
              On <strong>PlayOnMeet</strong>, playing SOS is seamless:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Create a room and share your 5-letter access code with a teammate or friend.</li>
              <li>Enable camera permissions to play using mid-air index finger gestures, or switch to standard mouse clicks.</li>
              <li>Select your preferred letter (&quot;S&quot; or &quot;O&quot;) and spatial cell position.</li>
              <li>Enjoy zero-latency real-time score tracking powered by WebRTC P2P sync.</li>
            </ol>
          </section>
        </article>

        {/* CTA */}
        <div className="pt-8 text-center border-t border-white/5">
          <Link
            href="/play"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Launch SOS Game Session
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-8">
          <div>© 2026 PlayOnMeet.</div>
          <div className="flex gap-4">
            <Link href="/games" className="hover:text-[#c0c1ff] transition-colors">Games Hub</Link>
            <Link href="/guides" className="hover:text-[#c0c1ff] transition-colors">Guides Hub</Link>
            <Link href="/editorial-policy" className="hover:text-[#c0c1ff] transition-colors">Editorial Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
