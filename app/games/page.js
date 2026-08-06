import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Multiplayer Web Games Hub — PlayOnMeet",
  description:
    "Explore our suite of free, gesture-controlled multiplayer web games designed for Google Meet, Zoom, and Teams. Play SOS Strategy, Air Drawing, and Social XOX directly in your browser with zero downloads.",
};

export default function GamesHubPage() {
  const games = [
    {
      slug: "sos-strategy-game",
      title: "SOS Strategy Game",
      tagline: "The Classic Pencil-and-Paper Grid Battle, Reimagined for Bare-Hand Gesture Play",
      category: "Strategy & Tactics",
      players: "2 Players",
      time: "5–10 mins",
      icon: "grid_on",
      color: "from-[#c0c1ff]/20 to-[#ddb7ff]/20",
      borderColor: "border-[#c0c1ff]/30",
      badgeColor: "bg-[#c0c1ff]/10 text-[#c0c1ff] border-[#c0c1ff]/20",
      description:
        "SOS is a legendary 2-player grid game where players take turns placing 'S' or 'O' into a square grid. Complete 'S-O-S' sequences to score points and earn extra moves. Features custom grid sizes from 3x3 to 6x6, real-time hand gesture placement, and peer-to-peer sync.",
      features: [
        "Interactive bare-hand gesture controls",
        "Customizable grid sizes (3x3 to 6x6)",
        "Real-time P2P WebRTC data channels",
        "Deep mathematical game theory mechanics",
      ],
    },
    {
      slug: "air-drawing",
      title: "Air Drawing",
      tagline: "Paint Digital Strokes in Mid-Air Using WebAssembly Hand Landmark Tracking",
      category: "Creative & Icebreaker",
      players: "1–10 Players",
      time: "3–15 mins",
      icon: "draw",
      color: "from-[#ddb7ff]/20 to-[#fca5a5]/20",
      borderColor: "border-[#ddb7ff]/30",
      badgeColor: "bg-[#ddb7ff]/10 text-[#ddb7ff] border-[#ddb7ff]/20",
      description:
        "Transform your index finger into a digital paintbrush floating in mid-air. Powered by Google MediaPipe Tasks-Vision compiled to WebAssembly, Air Drawing allows remote team members to sketch ideas, play Pictionary, and express creativity without keyboards or touchpads.",
      features: [
        "30+ FPS client-side hand tracking",
        "Open hand gesture eraser & color controls",
        "Zero server camera streaming (100% private)",
        "Ideal for Zoom & Google Meet icebreakers",
      ],
    },
    {
      slug: "social-xox",
      title: "Social XOX (Tic-Tac-Toe)",
      tagline: "The Ultimate Low-Friction Video Call Icebreaker",
      category: "Casual & Quick Play",
      players: "2 Players",
      time: "2–5 mins",
      icon: "videocam",
      color: "from-[#8ff5ff]/20 to-[#c0c1ff]/20",
      borderColor: "border-[#8ff5ff]/30",
      badgeColor: "bg-[#8ff5ff]/10 text-[#8ff5ff] border-[#8ff5ff]/20",
      description:
        "Classic Tic-Tac-Toe elevated with PlayOnMeet's signature glassmorphism interface and real-time gesture positioning. Perfect for 1-on-1 video standups, quick team breaks, and low-friction competition while maintaining face-to-face eye contact.",
      features: [
        "Instant room creation with 5-char code",
        "Bare-hand gesture symbol placement",
        "Non-intrusive UI optimized for screen-share",
        "No login or installation required",
      ],
    },
  ];

  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/60 backdrop-blur-xl border-b border-white/5 py-5 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
            <span className="font-light text-white/70">PLAY</span>
            <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">ON</span>
            <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent font-black tracking-tighter">MEET</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/games" className="text-[#c0c1ff] hover:text-white transition-colors">Games</Link>
            <Link href="/guides" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">Guides</Link>
            <Link href="/blog" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">Blog</Link>
            <Link href="/about" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">About</Link>
          </div>
          <Link href="/play" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold text-xs hover:opacity-90 transition-opacity">
            Play Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-36 pb-16 px-8 max-w-6xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] font-medium text-xs tracking-widest uppercase">
          Multiplayer Suite
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
          Webcam Gesture Games <br />
          <span className="bg-gradient-to-r from-[#c0c1ff] via-[#ddb7ff] to-[#8ff5ff] bg-clip-text text-transparent">
            Built for Video Calls
          </span>
        </h1>
        <p className="text-lg text-[#bcc7de]/80 max-w-2xl mx-auto leading-relaxed">
          Transform your Google Meet, Zoom, or Teams calls into interactive arenas. Play directly in your browser using bare-hand tracking—no controllers, downloads, or sign-ups required.
        </p>
      </header>

      {/* Main Content */}
      <main className="pb-24 px-8 max-w-6xl mx-auto space-y-16">
        {/* Games Directory Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.slug}
              className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md flex flex-col justify-between hover:border-[#c0c1ff]/30 transition-all duration-300 group"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${game.badgeColor}`}>
                    {game.category}
                  </span>
                  <span className="material-symbols-outlined text-[#c0c1ff] text-2xl">{game.icon}</span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#c0c1ff] transition-colors">
                  <Link href={`/games/${game.slug}`}>{game.title}</Link>
                </h2>
                <p className="text-xs font-semibold text-[#c0c1ff]/80 mb-4">{game.tagline}</p>
                <p className="text-sm text-[#bcc7de]/80 leading-relaxed mb-6">{game.description}</p>

                {/* Features list */}
                <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                  {game.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#bcc7de]/70">
                      <span className="material-symbols-outlined text-[#c0c1ff] text-sm">check_circle</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <Link
                  href={`/games/${game.slug}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-bold text-white hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all flex items-center justify-center gap-1.5"
                >
                  Read Complete Guide & Rules
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link
                  href="/play"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-center text-xs font-bold text-[#0a0a0b] hover:opacity-90 transition-opacity"
                >
                  Launch Game Session
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Why Gesture Gaming Section */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c0c1ff] mb-2 block">Technology Advantage</span>
            <h2 className="text-3xl font-black text-white tracking-tight mb-6">
              Why Bare-Hand Gesture Gaming Works
            </h2>
            <p className="text-[#bcc7de]/90 leading-relaxed mb-6">
              Traditional online games require controllers, keyboard shortcuts, or mouse clicking. On video calls, this forces participants to break eye contact and look away from their colleagues.
            </p>
            <p className="text-[#bcc7de]/90 leading-relaxed mb-8">
              PlayOnMeet solves this with client-side computer vision. By analyzing webcam input in WebAssembly threads, our games detect finger movements in mid-air. The result is intuitive, embodied interaction that restores eye contact and spontaneous laughter to remote meetings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl mb-2 block">lock</span>
                <h3 className="font-bold text-white text-sm mb-1">100% Camera Privacy</h3>
                <p className="text-xs text-[#bcc7de]/60">Frames are processed locally in browser RAM. Zero video is transmitted.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl mb-2 block">flash_on</span>
                <h3 className="font-bold text-white text-sm mb-1">Zero Download Friction</h3>
                <p className="text-xs text-[#bcc7de]/60">Runs instantly in Chrome, Edge, and modern browsers via WebAssembly.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl mb-2 block">hub</span>
                <h3 className="font-bold text-white text-sm mb-1">Peer-to-Peer Sync</h3>
                <p className="text-xs text-[#bcc7de]/60">Moves sync directly via WebRTC data channels for sub-15ms latency.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms of Service</Link>
            <Link href="/editorial-policy" className="hover:text-[#c0c1ff] transition-colors">Editorial Policy</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
