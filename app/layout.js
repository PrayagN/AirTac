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

const BASE_URL = "https://www.gesturegame.io"; // 🔁 update when domain is live

export const metadata = {
  // ── Primary SEO ──────────────────────────────────────────────
  title: {
    default:    "GestureGame — Gesture-Controlled Webcam Game | No Download",
    template:   "%s | GestureGame",
  },
  description:
    "Play a real-time SOS strategy game using hand gestures — no controller, no download. " +
    "Works on Google Meet, Zoom, or any video call. The best webcam multiplayer game for 2 players.",

  // ── Canonical + Robots ───────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/" },
  robots: {
    index:            true,
    follow:           true,
    googleBot: {
      index:          true,
      follow:         true,
      "max-snippet":  -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // ── Keywords (still read by some crawlers) ───────────────────
  keywords: [
    "gesture game",
    "gesture controlled game",
    "hand gesture game browser",
    "webcam multiplayer game",
    "games to play on Google Meet",
    "games to play on video call",
    "2 player browser game no download",
    "SOS strategy game online",
    "air drawing game",
    "hand tracking game",
    "multiplayer game with camera",
    "duo games online",
  ],

  // ── Open Graph (Facebook / LinkedIn / Discord) ────────────────
  openGraph: {
    type:        "website",
    url:         BASE_URL,
    siteName:    "GestureGame",
    title:       "GestureGame — Play with Hand Gestures on Any Video Call",
    description:
      "Control an SOS strategy game with your bare hands. No download, no app. " +
      "Works instantly on Google Meet, Zoom, or any browser. Challenge a friend now.",
    images: [
      {
        url:    "/og-image.png",   // ← create a 1200×630 preview image in /public
        width:  1200,
        height: 630,
        alt:    "GestureGame — Gesture-Controlled Multiplayer Game",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       "GestureGame — Draw in the Air, Play with a Friend",
    description:
      "Real-time hand-gesture SOS game. No download. Play on Google Meet or Zoom right now.",
    images:      ["/og-image.png"],
    creator:     "@gesturegame",  // 🔁 update to your handle
  },

  // ── Icons ─────────────────────────────────────────────────────
  icons: {
    icon:       "/feedback-icon.png",
    apple:      "/feedback-icon.png",
    shortcut:   "/feedback-icon.png",
  },

  // ── App metadata ──────────────────────────────────────────────
  applicationName: "GestureGame",
  category:        "game",
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
      </head>
      <body className="bg-surface text-on-surface">{children}</body>
    </html>
  );
}
