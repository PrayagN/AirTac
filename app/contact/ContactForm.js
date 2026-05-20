"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "Support", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", email: "", type: "Support", message: "" });
    }, 1000);
  };

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
      <main className="pt-32 pb-24 px-8 max-w-xl mx-auto">
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Get in Touch
          </h1>
          <p className="text-[#bcc7de]/60 text-sm mb-8 leading-relaxed">
            Have questions about integrations, camera calibration, or suggestions for custom game features? Send us a message and we'll reply as soon as possible.
          </p>

          {submitted ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/10 animate-fade-in">
              <span className="material-symbols-outlined text-4xl text-[#c0c1ff] mb-3">
                check_circle
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-sm text-[#bcc7de]/75 max-w-xs mx-auto mb-6">
                Thank you for your feedback. Our team will review your message and reply via email within 24–48 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 rounded-full border border-white/10 text-xs font-semibold text-[#bcc7de] hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-[#bcc7de]/70 text-xs font-bold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-semibold focus:outline-none focus:border-[#c0c1ff] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-[#bcc7de]/70 text-xs font-bold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-semibold focus:outline-none focus:border-[#c0c1ff] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-type" className="block text-[#bcc7de]/70 text-xs font-bold uppercase tracking-wider mb-2">
                  Inquiry Type
                </label>
                <select
                  id="contact-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-semibold focus:outline-none focus:border-[#c0c1ff] transition-colors appearance-none cursor-pointer"
                >
                  <option className="bg-[#0b1326]" value="Support">Technical Support</option>
                  <option className="bg-[#0b1326]" value="Feedback">Feature Feedback</option>
                  <option className="bg-[#0b1326]" value="Business">Partnership / Business</option>
                  <option className="bg-[#0b1326]" value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[#bcc7de]/70 text-xs font-bold uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-semibold focus:outline-none focus:border-[#c0c1ff] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] font-bold hover:opacity-95 shadow-md shadow-[#c0c1ff]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0a0a0b]/20 border-t-[#0a0a0b] rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-[#bcc7de]/50 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
