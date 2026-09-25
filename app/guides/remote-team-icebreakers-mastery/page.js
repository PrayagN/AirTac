import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Mastering Video Call Icebreakers & Remote Energy Resets — PlayOnMeet Guide",
  description:
    "Discover 10 research-backed interactive routines and webcam gesture warmups to eliminate video call fatigue and foster psychological safety in remote teams.",
};

export default function RemoteIcebreakersGuidePage() {
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
            <span className="px-3 py-1 rounded-full bg-[#ddb7ff]/10 border border-[#ddb7ff]/20 text-[#ddb7ff] text-xs font-bold uppercase tracking-wider">
              Remote Culture & Engagement
            </span>
            <span className="text-xs text-[#bcc7de]/50 font-semibold">10 min read &bull; Updated August 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Mastering Video Call Icebreakers & Remote Energy Resets
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed">
            By Prayag N., Creator of PlayOnMeet
          </p>
        </header>

        <hr className="border-white/5" />

        <article className="prose prose-invert max-w-none space-y-8 text-[#bcc7de]/90 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Why Traditional Icebreakers Fail</h2>
            <p>
              &quot;What is your favorite weekend activity?&quot; &quot;Share one fun fact about yourself.&quot; Most remote team members have answered these generic prompt questions dozens of times. Rather than exciting participants, traditional icebreakers often induce mild social awkwardness and performative enthusiasm.
            </p>
            <p>
              Neuroscience shows that true team bonding requires <strong>shared physical agency and low-stakes play</strong>. When teammates engage in spatial, gesture-based games like <strong>Air Drawing</strong> or <strong>SOS Strategy</strong> on PlayOnMeet, they shift out of text-processing mode into active, spontaneous interaction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. The 3-Minute Pre-Standup Warmup Routine</h2>
            <p>
              Integrating a 3-minute gesture activity before technical meetings yields three significant benefits:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Equalizes Hierarchy:</strong> Junior engineers and senior directors compete on equal footing in a quick 2-minute SOS game.</li>
              <li><strong>Activates Kinetic Awareness:</strong> Moving hands in front of the camera stimulates motor pathways and reduces sitting stiffness.</li>
              <li><strong>Fosters Eye Contact:</strong> Looking at the camera grid during gesture play restores natural facial cues.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/40 space-y-4">
            <h3 className="text-xl font-bold text-white">Recommended Weekly Icebreaker Schedule</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                <span className="font-bold text-white">Monday Morning Standup</span>
                <span className="text-[#c0c1ff]">1 Round of Air Drawing (Team Pictionary)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                <span className="font-bold text-white">Wednesday Mid-Sprint Reset</span>
                <span className="text-[#c0c1ff]">5-Minute SOS Tournament</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                <span className="font-bold text-white">Friday Retro Warmup</span>
                <span className="text-[#c0c1ff]">Quick Social XOX Match</span>
              </div>
            </div>
          </section>
        </article>

        {/* CTA */}
        <div className="pt-8 text-center border-t border-white/5">
          <Link
            href="/play"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-extrabold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Try Icebreaker Room on PlayOnMeet
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
