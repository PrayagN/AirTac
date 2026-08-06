import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Strategy & Knowledge Guides — PlayOnMeet",
  description:
    "Comprehensive guides and manuals covering SOS game theory, video call icebreaker strategies, browser computer vision architecture, and accessibility standards.",
};

export default function GuidesHubPage() {
  const guides = [
    {
      slug: "sos-game-rules-and-strategy",
      title: "The Ultimate SOS Game Rules & Winning Strategy Guide",
      category: "Game Theory & Tactics",
      readTime: "12 min read",
      icon: "menu_book",
      summary:
        "A 2,000-word masterclass covering the complete mathematical game theory of SOS. Learn grid parity control, dual-cell hazards, defensive corner setups, and multi-point chain cascades.",
    },
    {
      slug: "remote-team-icebreakers-mastery",
      title: "Mastering Video Call Icebreakers & Remote Energy Resets",
      category: "Remote Culture",
      readTime: "10 min read",
      icon: "groups",
      summary:
        "Say goodbye to awkward fun facts. Discover 10 research-backed interactive routines and webcam gesture warmups that build psychological safety and engagement during Zoom & Google Meet calls.",
    },
    {
      slug: "browser-hand-tracking-explained",
      title: "How Browser Computer Vision Works: MediaPipe, WASM & WebRTC",
      category: "Engineering & Privacy",
      readTime: "9 min read",
      icon: "memory",
      summary:
        "A deep dive into client-side machine learning architecture. Learn how WebAssembly and 21-point hand landmark detection enable 30+ FPS tracking directly inside RAM with zero video streaming.",
    },
  ];

  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/60 backdrop-blur-xl border-b border-white/5 py-5 px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
            <span className="font-light text-white/70">PLAY</span>
            <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">ON</span>
            <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent font-black tracking-tighter">MEET</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/games" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">Games</Link>
            <Link href="/guides" className="text-[#c0c1ff] hover:text-white transition-colors">Guides</Link>
            <Link href="/blog" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">Blog</Link>
            <Link href="/about" className="text-[#bcc7de] hover:text-[#c0c1ff] transition-colors">About</Link>
          </div>
          <Link href="/play" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold text-xs hover:opacity-90 transition-opacity">
            Play Now
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-36 pb-16 px-8 max-w-5xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] font-medium text-xs tracking-widest uppercase">
          Knowledge Base
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
          Strategy & Engineering <br />
          <span className="bg-gradient-to-r from-[#c0c1ff] via-[#ddb7ff] to-[#8ff5ff] bg-clip-text text-transparent">
            Guides & Manuals
          </span>
        </h1>
        <p className="text-lg text-[#bcc7de]/80 max-w-2xl mx-auto leading-relaxed">
          In-depth technical papers, tactical game manuals, and remote collaboration playbooks curated by engineers and researchers.
        </p>
      </header>

      {/* Main List */}
      <main className="pb-24 px-8 max-w-5xl mx-auto space-y-8">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md hover:border-[#c0c1ff]/30 transition-all duration-300 group flex flex-col md:flex-row gap-8 items-start justify-between"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-[11px] font-bold uppercase tracking-wider">
                  {guide.category}
                </span>
                <span className="text-xs text-[#bcc7de]/50 font-semibold">{guide.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#c0c1ff] transition-colors leading-snug">
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p className="text-sm text-[#bcc7de]/80 leading-relaxed">{guide.summary}</p>
            </div>
            <Link
              href={`/guides/${guide.slug}`}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all shrink-0 flex items-center gap-2 self-start md:self-center"
            >
              Read Guide
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </article>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/games" className="hover:text-[#c0c1ff] transition-colors">Games</Link>
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/editorial-policy" className="hover:text-[#c0c1ff] transition-colors">Editorial Policy</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
