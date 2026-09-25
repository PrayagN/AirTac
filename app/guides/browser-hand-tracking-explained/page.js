import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Browser Computer Vision Architecture: MediaPipe & WebAssembly — PlayOnMeet Guide",
  description:
    "Explore how PlayOnMeet achieves 30+ FPS client-side hand-tracking inside browser tabs using Google MediaPipe Tasks-Vision, WebAssembly SIMD, and WebRTC P2P sync.",
};

export default function BrowserHandTrackingGuidePage() {
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
            <span className="px-3 py-1 rounded-full bg-[#8ff5ff]/10 border border-[#8ff5ff]/20 text-[#8ff5ff] text-xs font-bold uppercase tracking-wider">
              Engineering & Web Standards
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">9 min read &bull; Updated August 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            How Browser Computer Vision Works: MediaPipe, WASM & WebRTC
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed">
            By Prayag N., Creator of PlayOnMeet
          </p>
        </header>

        <hr className="border-white/5" />

        <article className="prose prose-invert max-w-none space-y-8 text-[#bcc7de]/90 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Client-Side Machine Learning Architecture</h2>
            <p>
              Until recently, executing real-time computer vision neural networks required dedicated hardware controllers or server-side GPU processing. Streaming 720p video feeds to cloud servers, however, creates severe network latency and privacy hazards.
            </p>
            <p>
              PlayOnMeet bypasses cloud streaming entirely by running **Google MediaPipe Tasks-Vision** compiled to **WebAssembly (WASM)** directly inside client browser RAM.
            </p>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/40 space-y-4">
            <h3 className="text-xl font-bold text-white">The 2-Stage Landmark Inference Pipeline</h3>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-[#bcc7de]/80">
              <li><strong>Palm Detector Model:</strong> Scans the raw 30 FPS HTML5 Video element to identify hand bounding boxes. Optimized for rapid object localization.</li>
              <li><strong>21-Landmark Predictor:</strong> Crops the hand region and predicts 21 three-dimensional coordinates $(X, Y, Z)$ corresponding to wrist anchors, knuckles, and finger tips.</li>
              <li><strong>Exponential Smoothing Filter:</strong> Applies temporal moving average filters to prevent cursor jitter and produce smooth mid-air painting strokes.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. Peer-to-Peer State Synchronization with WebRTC</h2>
            <p>
              When playing SOS or Air Drawing with a remote peer, camera frames are evaluated locally. Only lightweight JSON coordinates $(X, Y)$ and game board action vectors are sent over WebRTC data channels.
            </p>
            <p>
              This ensures zero camera privacy exposure under GDPR and CCPA compliance, alongside sub-15ms sync latency between connected peers.
            </p>
          </section>
        </article>

        {/* CTA */}
        <div className="pt-8 text-center border-t border-white/5">
          <Link
            href="/play"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Experience Web Vision in Action
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
          </div>
        </div>
      </footer>
    </div>
  );
}
