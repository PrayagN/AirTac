import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About PlayOnMeet — Our Mission, Team & Technology",
  description:
    "Learn about PlayOnMeet: the team behind the platform, our mission to redefine remote team collaboration through gesture-controlled gaming, and the technology that makes it possible.",
};

export default function AboutPage() {
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
          <Link href="/" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#ddb7ff] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-36 pb-16 px-8 max-w-5xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] font-medium text-xs tracking-widest uppercase">
          Our Story
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
          About{" "}
          <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent">
            PlayOnMeet
          </span>
        </h1>
        <p className="text-xl text-[#bcc7de]/70 max-w-2xl leading-relaxed">
          We are building the future of human connection inside video calls — one gesture at a time.
          PlayOnMeet is a browser-native gaming platform that transforms ordinary remote meetings
          into interactive, shared experiences without any downloads or hardware.
        </p>
      </header>

      {/* Mission */}
      <main className="pb-24 px-8 max-w-5xl mx-auto space-y-16">

        {/* Mission Statement */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">rocket_launch</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Our Mission</h2>
          </div>
          <p className="text-lg text-[#bcc7de]/90 leading-relaxed mb-6">
            The modern remote workplace is powerful, flexible, and efficient — but it has a problem. The
            casual, spontaneous, human moments that make teams feel like <em>teams</em> have largely
            disappeared. Water cooler conversations, spontaneous desk visits, shared lunches — these
            informal interactions are the invisible infrastructure of trust, creativity, and belonging.
          </p>
          <p className="text-lg text-[#bcc7de]/90 leading-relaxed mb-6">
            PlayOnMeet was created to rebuild that infrastructure for the digital world. Our mission is
            simple: <strong className="text-white">make remote work more human through play.</strong>
          </p>
          <p className="text-lg text-[#bcc7de]/90 leading-relaxed">
            We believe that the best technology gets out of the way and lets people connect. Our
            gesture-controlled games need no controllers, no accounts, no installations. Just a browser,
            a webcam, and the desire to interact with another person in a genuinely fun way.
          </p>
        </section>

        {/* What We Built */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">construction</span>
            <h2 className="text-3xl font-black text-white tracking-tight">What We Built</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/15">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#c0c1ff] text-xl">gesture</span>
                <h3 className="text-xl font-bold text-white">Air Drawing</h3>
              </div>
              <p className="text-[#bcc7de]/80 text-sm leading-relaxed">
                Use your index finger as a digital paintbrush, drawing directly in mid-air. Powered by
                MediaPipe's real-time hand landmark model, Air Drawing enables fluid, expressive
                collaboration with zero latency — all processed locally on your device.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#ddb7ff]/5 border border-[#ddb7ff]/15">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#ddb7ff] text-xl">grid_on</span>
                <h3 className="text-xl font-bold text-white">Social XOX</h3>
              </div>
              <p className="text-[#bcc7de]/80 text-sm leading-relaxed">
                Classic Tic-Tac-Toe reimagined for video calls. Players compete in real-time via a
                peer-to-peer WebRTC data channel, with gesture-based moves that make even a simple
                grid feel like a next-generation experience.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-white/60 text-xl">lock</span>
                <h3 className="text-xl font-bold text-white">Privacy-First Architecture</h3>
              </div>
              <p className="text-[#bcc7de]/80 text-sm leading-relaxed">
                Every webcam frame is processed locally using WebAssembly. No video data is ever
                transmitted to our servers. This makes PlayOnMeet suitable for corporate environments
                with strict data governance policies.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-white/60 text-xl">speed</span>
                <h3 className="text-xl font-bold text-white">Zero-Friction Access</h3>
              </div>
              <p className="text-[#bcc7de]/80 text-sm leading-relaxed">
                No accounts. No downloads. No plugins. A room is created with a single click and shared
                with a five-character code. The barrier to play is intentionally as low as we can make it.
              </p>
            </div>
          </div>
        </section>

        {/* The Technology */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">memory</span>
            <h2 className="text-3xl font-black text-white tracking-tight">The Technology Stack</h2>
          </div>
          <p className="text-[#bcc7de]/90 leading-relaxed mb-8">
            PlayOnMeet is built on a carefully chosen stack of cutting-edge web technologies designed
            to maximize performance, privacy, and accessibility.
          </p>
          <div className="space-y-5">
            {[
              {
                name: "MediaPipe Tasks-Vision (WASM)",
                desc: "Google's state-of-the-art hand landmark detection model, compiled to WebAssembly and executed entirely in the browser thread. Detects 21 three-dimensional hand landmarks at 30+ frames per second on standard consumer hardware.",
                icon: "visibility",
              },
              {
                name: "PeerJS / WebRTC Data Channels",
                desc: "All game state (coordinates, move events, draw strokes) is synchronized directly between players using peer-to-peer WebRTC connections. Data never routes through our servers, ensuring low latency and maximum privacy.",
                icon: "share",
              },
              {
                name: "Next.js (App Router)",
                desc: "Our frontend is built with Next.js 15 using the App Router for optimal server-side rendering, static generation, and metadata management — ensuring fast load times and excellent search engine discoverability.",
                icon: "code",
              },
              {
                name: "Framer Motion",
                desc: "All interface animations and transitions are powered by Framer Motion, creating a fluid, premium experience that feels responsive and alive at every interaction point.",
                icon: "animation",
              },
            ].map((tech, i) => (
              <div key={i} className="flex gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="material-symbols-outlined text-[#c0c1ff] text-2xl mt-1 shrink-0">{tech.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{tech.name}</h3>
                  <p className="text-sm text-[#bcc7de]/70 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Creator */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">person</span>
            <h2 className="text-3xl font-black text-white tracking-tight">The Creator</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#c0c1ff]/20 to-[#ddb7ff]/20 border border-[#c0c1ff]/30 flex items-center justify-center shrink-0">
              <span className="text-3xl font-black bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent">P</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Prayag N.</h3>
              <p className="text-sm text-[#c0c1ff] font-semibold mb-4 uppercase tracking-widest">Founder & Developer</p>
              <p className="text-[#bcc7de]/80 leading-relaxed mb-4">
                PlayOnMeet was conceived and built by Prayag N., a developer fascinated by the
                intersection of computer vision, real-time web technologies, and human connection.
                The project began as a personal experiment: could you build a meaningful, gesture-based
                multiplayer experience that lived entirely inside a browser tab?
              </p>
              <p className="text-[#bcc7de]/80 leading-relaxed mb-4">
                The answer, after months of iterating on MediaPipe integrations, WebRTC peer
                synchronization, and gesture recognition systems, was a resounding yes. PlayOnMeet
                launched publicly in 2026 and has since been used by remote teams, classroom
                educators, and online friends looking for a more embodied way to connect.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/PrayagN/AirTac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-[#c0c1ff] hover:border-[#c0c1ff]/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  GitHub
                </a>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-[#bcc7de] hover:border-[#c0c1ff]/30 hover:text-[#c0c1ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="glass-panel p-10 md:p-14 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">favorite</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "privacy_tip",
                title: "Privacy by Default",
                desc: "We designed every feature with privacy as the constraint, not the afterthought. Your camera never leaves your device.",
              },
              {
                icon: "open_in_new",
                title: "Radical Accessibility",
                desc: "Great tools should require zero friction to access. No signups, no installs, no gatekeeping. Just open and play.",
              },
              {
                icon: "group",
                title: "Human-Centered Design",
                desc: "Technology should amplify human connection, not replace it. Every design decision at PlayOnMeet serves this principle.",
              },
            ].map((val, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/10 text-center">
                <span className="material-symbols-outlined text-[#c0c1ff] text-3xl mb-4 block">{val.icon}</span>
                <h3 className="font-bold text-white text-lg mb-2">{val.title}</h3>
                <p className="text-sm text-[#bcc7de]/70 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-8">
          <p className="text-[#bcc7de]/60 mb-4">Have a question, partnership inquiry, or feedback?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            Get in Touch
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms of Service</Link>
            <Link href="/blog" className="hover:text-[#c0c1ff] transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
