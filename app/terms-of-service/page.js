import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Review the Terms of Service for PlayOnMeet.",
};

export default function TermsOfService() {
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
          <Link href="/" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#ddb7ff] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-24 px-8 max-w-4xl mx-auto">
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-[#bcc7de]/60 mb-8">Last Updated: May 20, 2026</p>

          <div className="space-y-8 text-base leading-relaxed text-[#bcc7de]/90">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">description</span>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the PlayOnMeet website, games, and gesture tracking features, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">sports_esports</span>
                2. Use of Service & Browser Permissions
              </h2>
              <p>
                PlayOnMeet provides multiplayer games designed to run directly inside modern web browsers. To utilize the hand tracking mechanics, you must grant camera access to your browser.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Permissions can be revoked at any time via your browser settings.
                </li>
                <li>
                  You agree to use PlayOnMeet only for lawful, social, and remote team building entertainment.
                </li>
                <li>
                  Any behavior that seeks to disrupt peer-to-peer rooms, inject malicious code, or spoof coordinates is strictly prohibited.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">person</span>
                3. User Nicknames and Conduct
              </h2>
              <p>
                You are responsible for the nicknames you enter when initiating or joining a game room. Nicknames must not contain offensive, derogatory, or inappropriate content. We do not actively monitor peer-to-peer session chats or names, but we reserve the right to ban or restrict IPs that abuse the public sandbox.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">verified_user</span>
                4. Intellectual Property
              </h2>
              <p>
                All brand logos, design styles, game mechanics, and code structures of PlayOnMeet are the exclusive intellectual property of the team and its contributors. You may not copy, reverse-engineer, or reproduce the platform engine without prior consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">gavel</span>
                5. Limitation of Liability
              </h2>
              <p>
                PlayOnMeet is provided "as is" and "as available". We do not guarantee uninterrupted or error-free service, nor do we warrant the accuracy of AI hand tracking under suboptimal lighting conditions or on legacy browser engines.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
