import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://www.playonmeet.com";

export const metadata = {
  // ── Primary SEO ──────────────────────────────────────────────
  title: {
    default: "PlayOnMeet — Best Games to Play on Google Meet & Zoom | No Download",
    template: "%s | PlayOnMeet",
  },
  description:
    "Play interactive gesture-controlled SOS games directly on Google Meet, Zoom, or Teams. " +
    "No controller or download needed. The #1 webcam multiplayer game for remote teams and friends.",

  // ── Canonical + Robots ───────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  alternates: { 
    canonical: "/" 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // ── Keywords (Optimized for Video Call Gaming) ───────────────
  keywords: [
    "playonmeet",
    "play on meet",
    "games to play on google meet",
    "google meet games",
    "zoom multiplayer games",
    "games for video calls",
    "webcam games for 2 players",
    "SOS strategy game online",
    "hand tracking browser game",
    "gesture controlled game",
    "online games for remote teams",
    "interactive zoom activities",
    "hand gesture game",
  ],

  // ── Open Graph (Search & Social) ──────────────────────────────
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "PlayOnMeet",
    title: "PlayOnMeet — Gesture-Controlled Games for Video Calls",
    description:
      "Transform your video calls into a game room. Play with your hands—no download required. " +
      "Compatible with Google Meet, Zoom, and Microsoft Teams.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlayOnMeet — The Ultimate Video Call Game Platform",
      },
    ],
  },

  // ── Twitter Card ──────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PlayOnMeet — Real-time WebCam Games",
    description: "Multiplayer SOS game with hand gestures. Works on Google Meet/Zoom. No download.",
    images: ["/og-image.png"],
    creator: "@playonmeet",
  },

  // ── Functional Metadata ───────────────────────────────────────
  applicationName: "PlayOnMeet",
  category: "Game",
  icons: {
    icon: "/feedback-icon.png",
    apple: "/feedback-icon.png",
    shortcut: "/feedback-icon.png",
  },
};

// JSON-LD Structured Data for Maximum SEO Indexing
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "PlayOnMeet",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Any Browser",
      "url": BASE_URL,
      "description": "Multiplayer gesture-controlled games for video conferencing platforms.",
      "featureList": "Hand tracking, No download, Real-time multiplayer, Google Meet integration",
      "screenshot": `${BASE_URL}/og-image.png`
    },
    {
      "@type": "VideoGame",
      "name": "SOS Strategy Game",
      "gamePlatform": "Web Browser",
      "numberOfPlayers": "2",
      "genre": "Strategy",
      "author": {
        "@type": "Organization",
        "name": "PlayOnMeet"
      }
    }
  ]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
