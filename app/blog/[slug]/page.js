import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles } from "@/utils/blogData";

// Simple markdown-to-React parser helper
function renderMarkdown(content) {
  const lines = content.trim().split("\n");
  let inList = false;
  let listItems = [];
  const renderedElements = [];

  const flushList = (key) => {
    if (inList && listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 space-y-2 text-[#bcc7de]/90 my-6">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === "---") {
      flushList(index);
      renderedElements.push(<hr key={index} className="border-white/10 my-8" />);
      return;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList(index);
      // Skip the main H1 since we render it at the top of the template
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-2xl font-bold text-white tracking-tight mt-10 mb-4">
          {parseInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="text-xl font-bold text-white tracking-tight mt-8 mb-3">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }

    // Bullet Points
    if (trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      );
      return;
    }

    if (trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      );
      return;
    }

    // Numbered lists or other prefixes
    if (trimmed.match(/^\d+\.\s/)) {
      flushList(index);
      const content = trimmed.replace(/^\d+\.\s/, "");
      renderedElements.push(
        <div key={index} className="flex gap-3 my-4">
          <span className="font-black text-[#c0c1ff]">{trimmed.match(/^\d+/)[0]}.</span>
          <p className="text-[#bcc7de]/90 leading-relaxed">{parseInline(content)}</p>
        </div>
      );
      return;
    }

    // Empty Lines
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Standard Paragraph
    flushList(index);
    renderedElements.push(
      <p key={index} className="text-[#bcc7de]/90 leading-relaxed my-4 text-base">
        {parseInline(trimmed)}
      </p>
    );
  });

  // Flush any remaining lists
  flushList("final");

  return renderedElements;
}

// Simple inline styling parsing (handles bold **, italic *, code \`\`)
function parseInline(text) {
  const parts = [];
  let remaining = text;

  while (remaining) {
    const boldIndex = remaining.indexOf("**");
    const codeIndex = remaining.indexOf("`");

    // Check which markup comes first
    let firstMarkup = null;
    let firstIndex = Infinity;

    if (boldIndex !== -1 && boldIndex < firstIndex) {
      firstMarkup = "bold";
      firstIndex = boldIndex;
    }
    if (codeIndex !== -1 && codeIndex < firstIndex) {
      firstMarkup = "code";
      firstIndex = codeIndex;
    }

    if (firstMarkup === null) {
      parts.push(remaining);
      break;
    }

    // Push plain text before markup
    if (firstIndex > 0) {
      parts.push(remaining.substring(0, firstIndex));
    }

    remaining = remaining.substring(firstIndex);

    if (firstMarkup === "bold") {
      const endBold = remaining.indexOf("**", 2);
      if (endBold !== -1) {
        const boldText = remaining.substring(2, endBold);
        parts.push(<strong key={remaining} className="text-white font-bold">{boldText}</strong>);
        remaining = remaining.substring(endBold + 2);
      } else {
        parts.push(remaining);
        break;
      }
    } else if (firstMarkup === "code") {
      const endCode = remaining.indexOf("`", 1);
      if (endCode !== -1) {
        const codeText = remaining.substring(1, endCode);
        parts.push(
          <code key={remaining} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-[#c0c1ff]">
            {codeText}
          </code>
        );
        remaining = remaining.substring(endCode + 1);
      } else {
        parts.push(remaining);
        break;
      }
    }
  }

  return parts;
}

// Generate dynamic metadata for maximum search indexing and Open Graph sharing
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

// Generate static params for Next.js static export/caching compatibility
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/60 backdrop-blur-xl border-b border-white/5 py-5 px-8">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
            <span className="font-light text-white/70">PLAY</span>
            <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c0c1ff]/20">ON</span>
            <span className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-transparent font-black tracking-tighter">MEET</span>
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#ddb7ff] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Main Post Container */}
      <main className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
        <article>
          {/* Post Header */}
          <header className="mb-10 text-left">
            <Link 
              href="/blog" 
              className="inline-block px-3 py-1 mb-6 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] font-bold text-xs tracking-wider uppercase hover:bg-[#c0c1ff]/20 transition-all"
            >
              Blog Article
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author / Date Info */}
            <div className="flex items-center gap-4 text-sm text-[#bcc7de]/60 border-y border-white/5 py-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                {article.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{article.author}</div>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[#bcc7de]/30" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-[#0b1326]/30 backdrop-blur-md">
            <div className="prose prose-invert max-w-none">
              {renderMarkdown(article.content)}
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-xs text-[#bcc7de]/50 mt-12">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 gap-6">
          <div>© 2026 PlayOnMeet. All rights reserved.</div>
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
