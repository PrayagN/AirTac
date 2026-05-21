"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function AdSense() {
  const pathname = usePathname();

  // Completely block AdSense code on the gameplay canvas page (/play)
  if (pathname === "/play" || pathname.startsWith("/game")) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5544821471604950"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
