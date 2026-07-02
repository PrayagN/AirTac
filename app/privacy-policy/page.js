import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PlayOnMeet",
  description:
    "Learn how PlayOnMeet collects, uses, and protects your data. We process all camera feeds locally on your device. Read our full privacy policy including GDPR and cookie disclosures.",
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
          <p className="text-sm text-[#bcc7de]/60 mb-10">
            Last Updated: May 20, 2026 &bull; Effective: May 20, 2026
          </p>
          <p className="text-base text-[#bcc7de]/80 leading-relaxed mb-10">
            This Privacy Policy describes how PlayOnMeet (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses,
            stores, and shares information in connection with your use of the PlayOnMeet website and
            gaming platform at{" "}
            <strong className="text-white">playonmeet.com</strong> (the &quot;Platform&quot;). By using the
            Platform, you agree to the practices described in this Policy. If you do not agree, please
            discontinue use of the Platform.
          </p>

          <div className="space-y-10 text-base leading-relaxed text-[#bcc7de]/90">

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">shield</span>
                1. Local Camera Feed Processing — Our Core Privacy Commitment
              </h2>
              <p>
                PlayOnMeet features state-of-the-art gesture controls including{" "}
                <strong>Air Drawing</strong> and <strong>Hand Tracking</strong>. To enable these
                features, the application requests access to your device&apos;s camera.
              </p>
              <div className="p-5 rounded-2xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/15 my-4">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">lock</span>
                  Our Security Promise:
                </p>
                <p className="text-sm">
                  <strong>All camera feeds, image data, and hand-tracking inputs are processed entirely
                  locally within your web browser</strong> using MediaPipe client-side tracking
                  technology. Absolutely no video frames, images, biometric identifiers, or visual data
                  are ever uploaded, transmitted, or stored on external servers or databases. The camera
                  feed is only displayed on your local screen.
                </p>
              </div>
              <p>
                When you grant camera permission, the browser instantly translates hand movements into
                coordinate patterns using on-device WebAssembly computation, immediately discarding the
                raw image buffer after each frame is processed. Your appearance is never captured,
                stored, or transmitted.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">database</span>
                2. Information We Collect
              </h2>
              <p>
                Because we do not require user account registration, the data we collect is minimal.
                We may process the following categories of information:
              </p>
              <h3 className="text-lg font-bold text-white mt-4">a) Information You Provide Voluntarily</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Nicknames and Avatars:</strong> You may provide a custom nickname and select
                  an avatar when joining or hosting a game session. This data is only broadcast to
                  other players in your active session and is not stored on our servers after the
                  session ends.
                </li>
                <li>
                  <strong>Contact Form Submissions:</strong> If you use our Contact page to submit a
                  message, we collect your name, email address, and the content of your message in
                  order to respond to your inquiry.
                </li>
              </ul>
              <h3 className="text-lg font-bold text-white mt-4">b) Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Usage Data:</strong> Standard web server logs may include your IP address,
                  browser type, operating system, referring URLs, and pages visited. This data is
                  used for security monitoring and aggregate analytics only.
                </li>
                <li>
                  <strong>Cookies and Local Storage:</strong> We use browser local storage to persist
                  your preferences (such as dismissing warnings or storing cookie consent decisions).
                  We also use cookies from third-party services (see Section 4).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">manage_search</span>
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enable and operate the Platform&apos;s core game features</li>
                <li>Respond to contact form inquiries and support requests</li>
                <li>Improve Platform performance, security, and user experience</li>
                <li>Analyze aggregate, anonymized usage patterns to understand how the Platform is used</li>
                <li>Detect and prevent fraud, abuse, or unauthorized access</li>
                <li>Comply with applicable legal obligations</li>
              </ul>
              <p>
                We do not sell, rent, or share your personal information with third parties for their
                own marketing purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">ads_click</span>
                4. Google AdSense and Third-Party Advertising Cookies
              </h2>
              <p>
                We display Google AdSense advertisements on our Platform. Google, as a third-party
                vendor, uses cookies to serve ads based on prior visits to our website and/or other
                sites on the Internet.
              </p>
              <p>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users
                based on their visits to PlayOnMeet and other sites. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google may use the <strong>DoubleClick DART cookie</strong> to serve ads based on your visit to our site and other sites on the Internet.</li>
                <li>You may opt out of the use of the DART cookie by visiting the{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c0c1ff] underline hover:text-[#ddb7ff]"
                  >
                    Google Advertising Privacy Policy
                  </a>.
                </li>
                <li>You may also opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://settings.google.com/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c0c1ff] underline hover:text-[#ddb7ff]"
                  >
                    Google Ads Settings
                  </a>{" "}or the{" "}
                  <a
                    href="https://optout.aboutads.info/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c0c1ff] underline hover:text-[#ddb7ff]"
                  >
                    Network Advertising Initiative opt-out page
                  </a>.
                </li>
              </ul>
              <p>
                We do not have access to, or control over, the cookies used by Google or other
                third-party advertisers. Their use of data is governed by their respective privacy policies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">cookie</span>
                5. Cookies and Tracking Technologies
              </h2>
              <p>
                The Platform uses the following categories of cookies:
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-bold text-white mb-1">Strictly Necessary Cookies</p>
                  <p className="text-sm text-[#bcc7de]/70">
                    Essential for the Platform to function. These cannot be disabled.
                    Examples: session state, cookie consent preference.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-bold text-white mb-1">Analytics Cookies</p>
                  <p className="text-sm text-[#bcc7de]/70">
                    Help us understand how visitors use the Platform so we can improve it.
                    These are processed in aggregate and anonymized form only.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-bold text-white mb-1">Advertising Cookies (Third-Party)</p>
                  <p className="text-sm text-[#bcc7de]/70">
                    Set by Google AdSense to deliver relevant advertisements. May track your browsing
                    across multiple websites. You can manage these via Google Ads Settings.
                  </p>
                </div>
              </div>
              <p>
                You can manage or delete cookies through your browser settings at any time. Note that
                disabling certain cookies may affect the functionality of the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">share</span>
                6. Peer-to-Peer Game Synchronization
              </h2>
              <p>
                Real-time multiplayer games are synchronized using peer-to-peer (P2P) WebRTC technology.
                Game coordinates, draw strokes, and game state events are shared directly between the
                players in the room, without routing through our servers.
              </p>
              <p>
                Signaling data (used to establish the P2P connection) may briefly pass through a
                PeerJS signaling server solely for the purpose of connection establishment. No game
                content is stored by the signaling infrastructure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">public</span>
                7. Your Rights — GDPR and CCPA
              </h2>
              <p>
                Depending on your location, you may have the following rights regarding your
                personal information:
              </p>
              <h3 className="text-lg font-bold text-white mt-4">For European Union / EEA Users (GDPR)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;).</li>
                <li><strong>Right to Object:</strong> Object to the processing of your data for direct marketing or on grounds relating to your particular situation.</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
              </ul>
              <h3 className="text-lg font-bold text-white mt-4">For California Users (CCPA)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we collect about you.</li>
                <li><strong>Right to Delete:</strong> Request deletion of personal information we have collected from you.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
                <li><strong>Do Not Sell:</strong> We do not sell personal information. You have the right to opt out of any future sale.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us via our{" "}
                <Link href="/contact" className="text-[#c0c1ff] underline hover:text-[#ddb7ff]">
                  Contact Page
                </Link>
                . We will respond to all requests within 30 days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">child_care</span>
                8. Children&apos;s Privacy
              </h2>
              <p>
                The Platform is not directed to children under the age of 13. We do not knowingly
                collect personal information from children under 13. If we discover that we have
                inadvertently collected personal information from a child under 13, we will take
                prompt steps to delete that information. If you believe we may have collected
                information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">update</span>
                9. Changes to This Privacy Policy
              </h2>
              <p>
                We reserve the right to update this Privacy Policy at any time. We will notify you
                of significant changes by updating the &quot;Last Updated&quot; date at the top of this page.
                Your continued use of the Platform following any changes constitutes your acceptance
                of the revised Policy. We encourage you to review this page periodically.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">mail</span>
                10. Contacting Us
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or
                our data practices, please contact us via our{" "}
                <Link href="/contact" className="text-[#c0c1ff] underline hover:text-[#ddb7ff]">
                  Contact Page
                </Link>
                . We are committed to resolving privacy-related concerns in a timely and transparent manner.
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
            <Link href="/about" className="hover:text-[#c0c1ff] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
