import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — PlayOnMeet",
  description:
    "Read the full Terms of Service for PlayOnMeet. By using our platform, you agree to these terms governing use, conduct, intellectual property, and liability.",
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
          <p className="text-sm text-[#bcc7de]/60 mb-10">
            Last Updated: May 20, 2026 &bull; Effective: May 20, 2026
          </p>
          <p className="text-base text-[#bcc7de]/80 leading-relaxed mb-10">
            Welcome to PlayOnMeet (&quot;we,&quot; &quot;our,&quot; or &quot;the Platform&quot;). These Terms of Service
            (&quot;Terms&quot;) govern your access to and use of the PlayOnMeet website located at{" "}
            <strong className="text-white">playonmeet.com</strong>, including all games, features, and
            interactive tools offered therein. By accessing or using the Platform in any way, you
            confirm that you have read, understood, and agree to be legally bound by these Terms and
            our{" "}
            <Link href="/privacy-policy" className="text-[#c0c1ff] underline hover:text-[#ddb7ff]">
              Privacy Policy
            </Link>
            . If you do not agree to these Terms, you must discontinue use of the Platform immediately.
          </p>

          <div className="space-y-10 text-base leading-relaxed text-[#bcc7de]/90">

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">description</span>
                1. Eligibility and Account-Free Access
              </h2>
              <p>
                PlayOnMeet is designed to be used without creating a user account. To access games and
                interactive features, you must be at least <strong>13 years of age</strong>. By using
                the Platform, you represent and warrant that you meet this age requirement. Users under
                the age of 18 are advised to review these Terms with a parent or guardian.
              </p>
              <p>
                Because we do not require account registration, we cannot enforce age restrictions
                technically. It is the responsibility of parents and guardians to supervise minor
                children&apos;s use of internet services, including PlayOnMeet.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">sports_esports</span>
                2. Use of the Service and Browser Permissions
              </h2>
              <p>
                PlayOnMeet provides browser-based multiplayer games, including gesture-controlled
                interactive experiences. To access hand-tracking features, your browser must be granted
                access to your device&apos;s camera. This camera permission is governed entirely by your
                browser&apos;s permission system. You may revoke camera access at any time through your
                browser settings, which will disable gesture-controlled features.
              </p>
              <p>By using the Platform, you agree:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To use PlayOnMeet solely for lawful, personal, educational, or professional social entertainment purposes.</li>
                <li>Not to use the Platform in any manner that could damage, disable, overburden, or impair our servers or networks.</li>
                <li>Not to attempt to inject malicious code, manipulate peer-to-peer session coordinates, reverse engineer the gesture tracking system, or exploit vulnerabilities in the Platform.</li>
                <li>Not to use the Platform to transmit any content that is illegal, defamatory, obscene, threatening, discriminatory, or otherwise objectionable.</li>
                <li>Not to use automated bots, scrapers, or crawlers to access the Platform&apos;s interactive game features.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">person</span>
                3. User Nicknames and Conduct Standards
              </h2>
              <p>
                When initiating or joining a game session, users may provide a custom nickname and
                avatar. You are solely responsible for the nickname and any other information you
                submit. Nicknames must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contain or reference offensive, derogatory, sexually explicit, or discriminatory language</li>
                <li>Impersonate any person, entity, or brand without authorization</li>
                <li>Contain personally identifiable information of another person without their consent</li>
              </ul>
              <p>
                PlayOnMeet does not actively monitor peer-to-peer game rooms or chat content in
                real-time. However, we reserve the right to investigate reports of abuse and, where
                technically feasible, restrict or ban access from IP addresses or devices associated
                with confirmed violations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">verified_user</span>
                4. Intellectual Property Rights
              </h2>
              <p>
                All content, design elements, code, graphics, visual assets, game mechanics, user
                interface elements, and written materials on the PlayOnMeet Platform — unless explicitly
                attributed to third parties — are the exclusive intellectual property of PlayOnMeet
                and its creator(s), protected under applicable copyright, trademark, and trade secret laws.
              </p>
              <p>
                You are granted a limited, non-exclusive, non-transferable, revocable license to access
                and use the Platform for personal, non-commercial purposes. This license does not permit you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, reproduce, distribute, or commercially exploit any part of the Platform</li>
                <li>Create derivative works based on the Platform&apos;s design or code</li>
                <li>Reverse engineer, decompile, or disassemble any portion of the Platform&apos;s software</li>
                <li>Remove any copyright, trademark, or proprietary notices from any part of the Platform</li>
              </ul>
              <p>
                Open-source libraries used within the Platform (including MediaPipe, PeerJS, and
                Next.js) are subject to their respective open-source licenses.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">ads_click</span>
                5. Advertising and Third-Party Services
              </h2>
              <p>
                PlayOnMeet displays advertisements served by Google AdSense. These advertisements are
                delivered by Google and its advertising partners, who may use cookies and similar
                tracking technologies to serve ads based on your browsing history and interests. We do
                not control the content of these advertisements.
              </p>
              <p>
                By using PlayOnMeet, you acknowledge that third-party advertising networks may set
                cookies on your browser in accordance with their own privacy policies. You may
                opt out of interest-based advertising at any time by visiting the{" "}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c0c1ff] underline hover:text-[#ddb7ff]"
                >
                  Digital Advertising Alliance
                </a>{" "}
                or Google&apos;s{" "}
                <a
                  href="https://settings.google.com/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c0c1ff] underline hover:text-[#ddb7ff]"
                >
                  Ads Settings
                </a>
                .
              </p>
              <p>
                The Platform may also contain links to third-party websites or services. We are not
                responsible for the content, privacy practices, or terms of any third-party website.
                Access to third-party sites is at your own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">gavel</span>
                6. Disclaimer of Warranties
              </h2>
              <p>
                THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>We do not warrant that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Platform will be uninterrupted, error-free, or free from viruses or other harmful components</li>
                <li>AI hand-tracking will perform accurately under all lighting conditions or browser environments</li>
                <li>Peer-to-peer connections will be established or maintained in all network environments</li>
                <li>The Platform will meet your specific expectations or requirements</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">shield</span>
                7. Limitation of Liability
              </h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PLAYONMEET AND ITS CREATOR(S),
                AFFILIATES, CONTRACTORS, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOSS OF PROFITS, DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES — ARISING FROM YOUR ACCESS TO OR USE OF (OR
                INABILITY TO ACCESS OR USE) THE PLATFORM.
              </p>
              <p>
                IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR
                CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM
                EXTENT PERMITTED BY APPLICABLE LAW.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">block</span>
                8. Termination and Access Restriction
              </h2>
              <p>
                We reserve the right, in our sole discretion, to restrict, suspend, or terminate your
                access to the Platform at any time and for any reason, including but not limited to
                violation of these Terms, technical necessity, or the discontinuation of the Platform.
              </p>
              <p>
                Because the Platform operates without user accounts, restrictions are applied at the
                network level (e.g., IP-based restrictions). Such actions will be taken only where
                there is credible evidence of abuse, misuse, or violation of these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">balance</span>
                9. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws,
                without regard to its conflict of law provisions. Any disputes arising from or relating
                to these Terms or your use of the Platform shall first be attempted to be resolved
                through good-faith negotiation. If such negotiation fails, disputes shall be subject
                to binding arbitration or the jurisdiction of competent courts in the applicable territory.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">update</span>
                10. Changes to These Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. When we make changes, we will
                update the &quot;Last Updated&quot; date at the top of this page. Your continued use of the
                Platform after any modifications constitutes your acceptance of the revised Terms. We
                encourage you to review this page periodically.
              </p>
              <p>
                If you have questions about these Terms or our practices, please contact us through our{" "}
                <Link href="/contact" className="text-[#c0c1ff] underline hover:text-[#ddb7ff]">
                  Contact Page
                </Link>
                .
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
            <Link href="/about" className="hover:text-[#c0c1ff] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
