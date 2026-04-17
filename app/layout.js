import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
        url: `${BASE_URL}/og-image.png`,
        secureUrl: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "PlayOnMeet — Gesture-Controlled Games for Video Calls",
      },
    ],
  },

  // ── Twitter Card ──────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PlayOnMeet — Gesture-Controlled Games for Video Calls",
    description: "Transform your video calls into a game room. Play with your hands—no download required.",
    images: [`${BASE_URL}/og-image.png`],
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
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I play games on Google Meet or Zoom?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply visit PlayOnMeet.com during your call. Share your screen or invite your friends via room code. No installation or account required."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a controller for PlayOnMeet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No controller needed! PlayOnMeet uses Bare-Hand Tracking technology. Just gesture in front of your webcam to draw and make moves."
          }
        },
        {
          "@type": "Question",
          "name": "Is PlayOnMeet free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! PlayOnMeet is free to use for teams and individuals looking for icebreakers and social games on video calls."
          }
        }
      ]
    }
  ]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} dark scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Material Symbols asynchronously — prevents render-blocking */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
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
