import React from "react";
import Link from "next/link";
import { blogArticles } from "@/utils/blogData";

export const metadata = {
  title: "Remote Team Building Blog",
  description: "Read articles and insights about virtual team building, interactive webcam gaming, and next-generation remote culture.",
};

export default function BlogHub() {
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
      <header className="pt-36 pb-12 px-8 max-w-5xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-xs tracking-widest uppercase">
          Team Building & Tech
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          The PlayOnMeet <span className="playonmeet-gradient">Hub</span>
        </h1>
        <p className="text-[#bcc7de]/70 text-lg max-w-xl mx-auto">
          Insights, guides, and articles about remote collaboration, camera-gesture tracking, and building high-morale remote teams.
        </p>
      </header>

      {/* Main Grid */}
      <main className="pb-24 px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {blogArticles.map((article) => (
            <article 
              key={article.slug}
              className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-[#c0c1ff]/25 transition-all duration-300 flex flex-col justify-between bg-[#0b1326]/30 backdrop-blur-md group hover:-translate-y-1"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[#bcc7de]/50 font-semibold mb-4">
                  <span>{article.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span>{article.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-[#c0c1ff] transition-colors leading-snug">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-[#bcc7de]/70 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              {/* Author and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-medium text-[#bcc7de]/50">
                  By {article.author}
                </span>
                <Link 
                  href={`/blog/${article.slug}`}
                  className="text-xs font-bold text-[#c0c1ff] group-hover:text-[#ddb7ff] flex items-center gap-1 transition-colors"
                >
                  Read Article
                  <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-[#bcc7de]/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="font-bold text-white tracking-tight">PlayOnMeet Blog</span>
            <span>Connecting distributed teams through play.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[#c0c1ff] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#c0c1ff] transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-[#c0c1ff] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
