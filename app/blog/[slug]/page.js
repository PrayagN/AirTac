import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles } from "@/utils/blogData";

// Enhanced markdown-to-React parser helper
function renderMarkdown(content) {
  const lines = content.trim().split("\n");
  let inList = false;
  let listItems = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
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

    // Code Blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        renderedElements.push(
          <pre
            key={`code-${index}`}
            className="bg-[#060e20] p-5 rounded-2xl border border-white/10 overflow-x-auto my-6 text-xs text-[#c0c1ff] font-mono leading-relaxed shadow-xl"
          >
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList(index);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Horizontal Rule
    if (trimmed === "---") {
      flushList(index);
      renderedElements.push(<hr key={index} className="border-white/10 my-8" />);
      return;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList(index);
      // Skip the main H1 since we render it in the hero header
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-10 mb-4">
          {parseInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3 key={index} className="text-xl md:text-2xl font-bold text-white tracking-tight mt-8 mb-3">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }

    // Images: ![alt](url)
    if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
      flushList(index);
      const alt = trimmed.substring(2, trimmed.indexOf("]("));
      const src = trimmed.substring(trimmed.indexOf("](") + 2, trimmed.length - 1);
      renderedElements.push(
        <figure key={index} className="my-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="rounded-2xl border border-white/10 w-full shadow-2xl mx-auto max-h-[460px] object-contain bg-[#060e20]"
          />
          {alt && <figcaption className="text-xs text-[#bcc7de]/60 mt-3 italic">{alt}</figcaption>}
        </figure>
      );
      return;
    }

    // Blockquotes: > quote
    if (trimmed.startsWith("> ")) {
      flushList(index);
      renderedElements.push(
        <blockquote
          key={index}
          className="border-l-4 border-[#c0c1ff] pl-5 py-3 my-6 text-[#bcc7de] italic bg-white/[0.02] rounded-r-2xl text-base leading-relaxed"
        >
          {parseInline(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Bullet Points
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      );
      return;
    }

    // Numbered lists
    if (trimmed.match(/^\d+\.\s/)) {
      flushList(index);
      const content = trimmed.replace(/^\d+\.\s/, "");
      renderedElements.push(
        <div key={index} className="flex gap-3 my-3">
          <span className="font-black text-[#c0c1ff] shrink-0">{trimmed.match(/^\d+/)[0]}.</span>
          <p className="text-[#bcc7de]/90 leading-relaxed text-base">{parseInline(content)}</p>
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

  // Flush any remaining lists or code blocks
  flushList("final");
  if (inCodeBlock && codeBlockLines.length > 0) {
    renderedElements.push(
      <pre
        key="code-final"
        className="bg-[#060e20] p-5 rounded-2xl border border-white/10 overflow-x-auto my-6 text-xs text-[#c0c1ff] font-mono leading-relaxed"
      >
        <code>{codeBlockLines.join("\n")}</code>
      </pre>
    );
  }

  return renderedElements;
}

// Inline styling parser (handles bold **, code `, italic *, links [text](url))
function parseInline(text) {
  const parts = [];
  let remaining = text;

  while (remaining) {
    const boldIndex = remaining.indexOf("**");
    const codeIndex = remaining.indexOf("`");
    const linkIndex = remaining.indexOf("[");

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
    if (linkIndex !== -1 && linkIndex < firstIndex) {
      const closeBracket = remaining.indexOf("]", linkIndex);
      const openParen = remaining.indexOf("(", closeBracket);
      if (closeBracket !== -1 && openParen === closeBracket + 1) {
        firstMarkup = "link";
        firstIndex = linkIndex;
      }
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
    } else if (firstMarkup === "link") {
      const closeBracket = remaining.indexOf("]");
      const closeParen = remaining.indexOf(")", closeBracket);
      if (closeBracket !== -1 && closeParen !== -1) {
        const linkText = remaining.substring(1, closeBracket);
        const linkUrl = remaining.substring(closeBracket + 2, closeParen);
        parts.push(
          <a
            key={remaining}
            href={linkUrl}
            target={linkUrl.startsWith("http") ? "_blank" : undefined}
            rel={linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-[#c0c1ff] underline underline-offset-4 hover:text-[#ddb7ff] font-semibold transition-colors"
          >
            {linkText}
          </a>
        );
        remaining = remaining.substring(closeParen + 1);
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Person",
      "name": "Prayag N.",
      "url": "https://www.playonmeet.com/about",
    },
    "publisher": {
      "@type": "Organization",
      "name": "PlayOnMeet",
      "url": "https://www.playonmeet.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.playonmeet.com/og-image.png",
      },
    },
    "datePublished": new Date(article.date).toISOString(),
    "mainEntityOfPage": `https://www.playonmeet.com/blog/${article.slug}`,
  };

  return (
    <div className="bg-[#0a0a0b] text-[#bcc7de] min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-primary/30">
      {/* Article Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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
              Engineering &amp; Insights
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author / Date Info */}
            <div className="flex items-center gap-4 text-sm text-[#bcc7de]/60 border-y border-white/5 py-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                {article.author.split(" ").map((n) => n[0]).join("")}
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
