import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Editorial Policy & Content Standards — PlayOnMeet",
  description:
    "Our commitment to high-value content, human editorial review, expert authorship, mathematical accuracy, privacy integrity, and Google AdSense publisher compliance.",
};

export default function EditorialPolicyPage() {
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
          <div className="flex gap-6 text-sm font-semibold">
            <Link href="/games" className="hover:text-[#c0c1ff] transition-colors">Games</Link>
            <Link href="/guides" className="hover:text-[#c0c1ff] transition-colors">Guides</Link>
            <Link href="/blog" className="hover:text-[#c0c1ff] transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-8 max-w-4xl mx-auto space-y-12">
        <header className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <span className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider block w-fit mb-4">
            E-E-A-T & Transparency
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Editorial Policy & Content Quality Standards
          </h1>
          <p className="text-lg text-[#bcc7de]/80 leading-relaxed">
            PlayOnMeet is dedicated to producing authoritative, human-reviewed, and high-utility content across game theory, computer vision engineering, and remote team dynamics.
          </p>
        </header>

        <article className="space-y-8 leading-relaxed">
          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/30 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff]">verified_user</span>
              1. Our E-E-A-T Commitment
            </h2>
            <p className="text-sm text-[#bcc7de]/80">
              In accordance with Google&apos;s Search Quality Rater Guidelines and Helpful Content System, every article, guide, and manual published on PlayOnMeet is created by experienced subject-matter experts in mathematics, computer science, and organizational psychology.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-[#bcc7de]/80">
              <li><strong>Originality:</strong> We do not publish automated, scraped, or low-value derivative content.</li>
              <li><strong>Fact-Checking:</strong> Algorithmic formulas, game theory state spaces, and browser benchmarks are rigorously verified prior to publication.</li>
              <li><strong>Author Transparency:</strong> Every article displays full author attribution, qualifications, and revision history.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/30 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff]">ads_click</span>
              2. Advertising & Publisher Disclosure
            </h2>
            <p className="text-sm text-[#bcc7de]/80">
              PlayOnMeet displays third-party advertisements served by Google AdSense to support our free web tools and research publishing.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-[#bcc7de]/80">
              <li><strong>Editorial Independence:</strong> Advertisers have zero influence over our editorial content, game mechanics, or research conclusions.</li>
              <li><strong>Unobtrusive Ad Placement:</strong> Advertisements are integrated responsibly so as not to obscure interactive game boards, gesture controls, or educational content.</li>
              <li><strong>Cookie Transparency:</strong> Google AdSense uses cookies to serve ads based on user visits. Users may manage ad personalization settings via Google Ad Settings.</li>
            </ul>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/5 bg-[#0b1326]/30 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff]">security</span>
              3. Privacy Integrity & Camera Safety
            </h2>
            <p className="text-sm text-[#bcc7de]/80">
              We uphold strict privacy standards. Webcams used for gesture tracking operate entirely inside local browser memory via WebAssembly. Zero video recordings, biometrics, or facial data are ever saved or transmitted to external servers.
            </p>
          </section>
        </article>

        {/* Contact CTA */}
        <div className="text-center pt-6">
          <p className="text-sm text-[#bcc7de]/60 mb-4">Have questions about our editorial standards or wish to submit feedback?</p>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 hover:border-[#c0c1ff]/30 transition-all inline-flex items-center gap-2"
          >
            Contact Editorial Team
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-8">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
