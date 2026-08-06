import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Air Drawing — Bare-Hand Gesture Painting for Google Meet & Zoom",
  description:
    "Discover Air Drawing on PlayOnMeet: paint digital strokes in mid-air using webcam gesture tracking. Perfect for Pictionary, icebreakers, and creative collaboration.",
};

export default function AirDrawingPage() {
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
            <span className="px-3 py-1 rounded-full bg-[#ddb7ff]/10 border border-[#ddb7ff]/20 text-[#ddb7ff] text-xs font-bold uppercase tracking-wider">
              Creative & AI Computer Vision
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">1–10 Players &bull; 3–15 Mins</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Air Drawing Canvas
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed mb-8">
            Turn your index finger into a digital paintbrush floating in front of your camera. Air Drawing uses WebAssembly neural networks to track 21 hand landmarks in real time with sub-15ms latency.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/play"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">brush</span>
              Launch Air Canvas Session
            </Link>
            <Link
              href="/guides/browser-hand-tracking-explained"
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">memory</span>
              Technical Architecture Guide
            </Link>
          </div>
        </header>

        {/* Section: How to Draw */}
        <section className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c0c1ff]">back_hand</span>
            Gesture Control Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#c0c1ff] text-4xl mb-3 block">touch_app</span>
              <h3 className="font-bold text-white text-lg mb-2">Draw Stroke</h3>
              <p className="text-xs text-[#bcc7de]/70 leading-relaxed">
                Extend your index finger and pinch slightly to begin drawing digital ink lines across the canvas.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#c0c1ff] text-4xl mb-3 block">front_hand</span>
              <h3 className="font-bold text-white text-lg mb-2">Eraser Mode</h3>
              <p className="text-xs text-[#bcc7de]/70 leading-relaxed">
                Show an open palm with all 5 fingers extended to switch to the eraser tool and clear canvas areas.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="material-symbols-outlined text-[#c0c1ff] text-4xl mb-3 block">palette</span>
              <h3 className="font-bold text-white text-lg mb-2">Color Palette</h3>
              <p className="text-xs text-[#bcc7de]/70 leading-relaxed">
                Point at the top color swatches to switch between neon purple, electric blue, gold, and white stroke colors.
              </p>
            </div>
          </div>
        </section>

        {/* Play CTA */}
        <section className="text-center py-6">
          <h2 className="text-2xl font-bold text-white mb-4">Start Air Drawing Now</h2>
          <Link
            href="/play"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-base hover:opacity-90 transition-opacity"
          >
            Open Air Canvas
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
