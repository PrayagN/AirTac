import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how PlayOnMeet handles your data. We prioritize security and privacy with local camera processing.",
};

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-[#bcc7de]/60 mb-8">Last Updated: May 20, 2026</p>

          <div className="space-y-8 text-base leading-relaxed text-[#bcc7de]/90">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">shield</span>
                1. Local Camera Feed Processing Policy
              </h2>
              <p>
                PlayOnMeet features state-of-the-art gesture controls including <strong>Air Drawing</strong> and <strong>Hand Tracking</strong>. To enable these features, the application requests access to your device's camera.
              </p>
              <div className="p-5 rounded-2xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/15 my-4">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">lock</span>
                  Our Security Promise:
                </p>
                <p className="text-sm">
                  <strong>All camera feeds, image data, and hand-tracking inputs are processed entirely locally within your web browser</strong> using MediaPipe client-side tracking technology. 
                  Absolutely no video frames, images, biometric identifiers, or visual data are ever uploaded, transmitted, or stored on external servers or databases.
                </p>
              </div>
              <p>
                When you grant camera permission, the browser instantly translates hand movements into coordinate patterns, immediately discarding the raw image buffer. The camera feed is only displayed on your local screen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">cookie</span>
                2. Information We Collect
              </h2>
              <p>
                Since we do not require account registration to play, the personal information we collect is minimal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Nicknames and Avatars:</strong> You may provide a custom nickname and select an avatar when joining or hosting a session. This data is only broadcasted to active game participants in your session room and is not stored.
                </li>
                <li>
                  <strong>Cookies and Local Storage:</strong> We use local storage to persist your preferences (such as dismissing warnings or storing cookie consent). We also use third-party cookies (such as Google AdSense) to serve advertisements.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">ads_click</span>
                3. Google AdSense & Third-Party Cookies
              </h2>
              <p>
                We display Google AdSense advertisements on our platform. Google, as a third-party vendor, uses cookies to serve ads based on user visits. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to PlayOnMeet and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting{" "}
                <a 
                  href="https://settings.google.com/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#c0c1ff] hover:text-[#ddb7ff] underline"
                >
                  Google Ads Settings
                </a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">share</span>
                4. Peer-to-Peer Game Synchronization
              </h2>
              <p>
                Real-time multiplayer games are synchronized using peer-to-peer (P2P) technology. This means game coordinates, draw strokes, and moves are shared directly between the players in the room, keeping data transmission direct and secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">mail</span>
                5. Contacting Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please feel free to reach out via our{" "}
                <Link href="/contact" className="text-[#c0c1ff] hover:text-[#ddb7ff] underline">
                  Contact Page
                </Link>.
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
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
