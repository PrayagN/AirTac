"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import FeedbackChatbot from './FeedbackChatbot';

function BrandLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] ${className}`} aria-label="PlayOnMeet Logo">
      <span className="font-light tracking-tight text-white/70">PLAY</span>
      <span className="on-capsule" aria-hidden="true">ON</span>
      <span className="font-extrabold tracking-tighter playonmeet-gradient">MEET</span>
    </div>
  );
}

function ScrollReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage({
  localName,
  setLocalName,
  localAvatar,
  setLocalAvatar,
  inputRoomCode,
  setInputRoomCode,
  handleNativeStart,
}) {
  const [showInputModal, setShowInputModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'join'
  const autoOpenedRef = useRef(false);
  const [showMobileToast, setShowMobileToast] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState(['Felix', 'Aneka', 'Jasper', 'Oliver', 'Sophia', 'Zoe']);

  const randomizeAvatars = () => {
    const newAvatars = Array(6).fill(0).map(() => Math.random().toString(36).substring(7));
    setAvatarOptions(newAvatars);
    setLocalAvatar(newAvatars[0]);
  };

  useEffect(() => {
    if (inputRoomCode && !autoOpenedRef.current) {
      setModalMode('join');
      setShowInputModal(true);
      autoOpenedRef.current = true;
    }
  }, [inputRoomCode]);

  // Detect mobile / tablet and show a "use Desktop Mode" toast
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check if manually dismissed before
    const isDismissed = localStorage.getItem('hideMobileToast') === 'true';
    if (isDismissed) return;

    // 2. Detect device characteristics
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 1024;

    // 3. Detect if "Desktop Mode" is enabled (UA usually removes "Mobi", "Android", etc.)
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Only show if (touch/narrow) AND still using a Mobile User Agent
    if ((isTouchDevice || isNarrow) && isMobileUA) {
      setShowMobileToast(true);
    }
  }, []);

  const openJoinModal = () => {
    setModalMode('join');
    setShowInputModal(true);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setShowInputModal(true);
  };

  const submitModal = () => {
    if (!localName.trim()) return;
    setShowInputModal(false);
    // Let state flush then start
    setTimeout(() => {
      handleNativeStart();
    }, 50);
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen dark">

      {/* ── Mobile / Tablet Warning Toast ── */}
      <AnimatePresence>
        {showMobileToast && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              zIndex: 9999,
              width: 'calc(100% - 32px)',
              maxWidth: '560px',
              background: 'rgba(15, 10, 40, 0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '1.25rem',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 40px rgba(124,58,237,0.35)',
            }}
          >


            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#e2d9ff', letterSpacing: '0.01em' }}>
                Best enjoyed on Desktop
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(192,193,255,0.65)', lineHeight: 1.4 }}>
                For the full Air Canvas experience, please enable <strong style={{ color: '#c4b5fd' }}>Desktop Mode</strong> in your browser settings.
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => {
                setShowMobileToast(false);
                localStorage.setItem('hideMobileToast', 'true');
              }}
              aria-label="Dismiss mobility warning"
              style={{
                flexShrink: 0,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl dark:bg-[#0b1326]/60 shadow-[0_8px_32px_0_rgba(11,19,38,0.08)]" role="navigation">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] tracking-tight">
          <BrandLogo className="text-2xl" />
          <div className="hidden md:flex items-center gap-8">
            <a className="text-[#bcc7de] hover:text-[#c0c1ff] transition-opacity duration-300" href="#how-to-play" aria-label="Learn how PlayOnMeet works">How it works</a>
            <a className="text-[#bcc7de] hover:text-[#c0c1ff] transition-opacity duration-300" href="#genesis" aria-label="Read our story">Our Story</a>
            <a className="text-[#bcc7de] hover:text-[#c0c1ff] transition-opacity duration-300" href="#games" aria-label="Discover available multiplayer games">Games</a>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-6 py-2 rounded-full border border-outline-variant/30 text-[#bcc7de] hover:opacity-80 transition-opacity duration-300" aria-label="Start a new game session">Start Session</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openJoinModal} className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-semibold hover:opacity-80 transition-opacity duration-300" aria-label="Join an existing game room">Join Room</motion.button>
          </div>
        </div>
      </nav>

      <main className="pt-24" id="main-content" role="main">
        {/* Visually Hidden H1 for Maximum SEO Ranking */}
        <h1 className="sr-only">Play Games on Google Meet, Zoom & Teams — PlayOnMeet Multiplayer Gestures</h1>

        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden px-8" aria-label="Hero Section">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <ScrollReveal delay={100}>
                <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm tracking-wide uppercase">Multiplayer Social Gaming</span>
                <div className="relative py-8">
                  <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none relative" aria-hidden="true">
                    <div className="relative z-10 flex flex-col items-start gap-2">
                      <span className="text-white">Social</span>
                      <span className="playonmeet-gradient ml-12 lg:ml-20">Gaming,</span>
                      <span className="text-white/40 italic lg:ml-40">Redefined.</span>
                    </div>

                    {/* The Cyber Ribbon Wave */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 400 200">
                      <motion.path
                        d="M 20 40 Q 150 10 200 100 T 380 160"
                        fill="none"
                        stroke="url(#cyber-grad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                      />
                      <defs>
                        <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0" />
                          <stop offset="50%" stopColor="#c0c1ff" stopOpacity="1" />
                          <stop offset="100%" stopColor="#ddb7ff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-xl text-secondary max-w-xl mb-12 leading-relaxed">
                  The ultimate gesture-controlled gaming experience for video calls. PlayOnMeet brings seamless multiplayer games to your remote sessions—no download, just pure interaction.
                </p>
                <div className="flex flex-wrap gap-6">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openJoinModal} className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg hover:opacity-90 shadow-xl shadow-primary/20 transition-opacity duration-300" aria-label="Join a private game room with a code">
                    Join Game Room
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-10 py-4 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface font-bold text-lg hover:bg-surface-variant transition-colors duration-300" aria-label="Create a new multiplayer session">
                    Start Session
                  </motion.button>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-5 relative">
              <ScrollReveal delay={300}>
                <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden glass-panel border border-outline-variant/10 shadow-2xl">
                  <Image
                    fill
                    priority
                    className="object-cover opacity-80"
                    alt="PlayOnMeet — Gesture-controlled multiplayer games for Google Meet and Zoom video calls"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo6QeQXNMpoiUm-GMk6BFZ_i-5MrfD66rESvKOvL_6xde8vyPxeTCXNBEe8oOlnE2JhRrYZejgA_fuMUGSQK4xgexSbxat-I5hp_LgmGHXfOoTv11kuCgzZwDh43AY2_aETs3et8f3sr9DG6qQfneMdC1MhGi8GyzfGvV93oFcUIpYc4C1kKtSdXJPTQxFB6XCqsG6m1z6xfqLGFOSSaocqmJRX591u1jTTqwsOKGK0Ik4Oz7nQVNS_Z9e37R8FYB3hEfevDfvRHiJ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-tertiary/20 blur-[120px] rounded-full"></div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The Genesis (Vision) Section */}
        <section id="genesis" className="py-32 px-8 relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-tertiary/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative glass-panel rounded-[2.5rem] p-4 border border-white/10 overflow-hidden shadow-2xl">
                  <img
                    src="/og-image.png"
                    alt="The Vision of PlayOnMeet"
                    className="w-full rounded-[2rem] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  {/* Holographic Scanning Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[scan_3s_linear_infinite]"></div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary font-bold text-xs tracking-widest uppercase">The Genesis</span>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-8 leading-tight">
                Born from a <br />
                <span className="playonmeet-gradient">Shared Curiosity.</span>
              </h2>
              <div className="space-y-6 text-xl text-secondary leading-relaxed">
                <p>
                  "I created this app because I always wondered during video calls... what if we could make them truly <span className="text-white font-semibold italic">interactive</span>? What if we didn't just screen-share, but played together inside the same digital space?"
                </p>
                <p>
                  The niche was clear: bridging the physical gap with <span className="text-white font-semibold">future tech</span>. I realized that if we could interact through <span className="text-primary font-bold">Air Drawing</span>—using just our hands to paint the void—it would change the way we connect forever.
                </p>
                <p className="text-lg opacity-80">
                  PlayOnMeet is the result of that planning. A platform where technology doesn't get in the way—it becomes the playground.
                </p>
              </div>

              {/* <div className="mt-12 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30">
                  <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Prayag&backgroundColor=transparent" alt="Prayag" />
                </div>
                <div>
                  <div className="font-bold text-white tracking-tight">Prayag N.</div>
                  <div className="text-sm text-secondary uppercase tracking-widest font-semibold opacity-60">Founder & Visionary</div>
                </div>
              </div> */}
            </ScrollReveal>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-8 bg-surface-container-lowest" aria-label="App Features">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="mb-20 text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Unrivaled Interactions</h2>
                <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal delay={150} className="md:col-span-2 h-full">
                <motion.div whileHover={{ scale: 1.02 }} className="h-full group relative overflow-hidden rounded-[2rem] bg-surface-container p-10 transition-colors duration-500 hover:bg-surface-container-high border border-outline-variant/10">
                  <div className="flex flex-col md:flex-row gap-10 items-center h-full">
                    {/* Left: Text */}
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="material-symbols-outlined text-3xl text-primary mb-5" style={{ fontVariationSettings: "'FILL' 0,'wght' 300" }} aria-hidden="true">videocam</span>
                      <h3 className="text-3xl font-bold mb-4">Social XOX</h3>
                      <p className="text-secondary leading-relaxed">
                        Classic Tic-Tac-Toe, elevated for the modern age. Play with friends while keeping the conversation flowing. Our interface places gameplay front and center without ever obscuring your connections.
                      </p>
                    </div>
                    {/* Right: Live XOX Preview */}
                    <div className="flex-1 w-full flex flex-col items-center gap-5">
                      {/* Players vs Row */}
                      <div className="flex items-center justify-center gap-3 w-full">
                        {/* Player 1 */}
                        <div className="relative">
                          <div className="w-[150px] h-[150px] relative rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg">
                            <Image
                              fill
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="Player 1 Avatar"
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#1e1f26] border border-primary/40 flex items-center justify-center text-primary font-black text-xs shadow-md">X</div>
                        </div>
                        {/* VS */}
                        <div className="px-2.5 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant text-xs font-bold tracking-widest">vs</div>
                        {/* Player 2 */}
                        <div className="relative">
                          <div className="w-[150px] h-[150px] relative rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg">
                            <Image
                              fill
                              src="https://randomuser.me/api/portraits/women/44.jpg"
                              alt="Player 2 Avatar"
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#1e1f26] border border-tertiary/40 flex items-center justify-center text-tertiary font-black text-xs shadow-md">O</div>
                        </div>
                      </div>
                      {/* 3x3 Game Grid — divider-line style matching Stitch design */}
                      <div className="w-full max-w-[280px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]" style={{ background: 'rgba(24,25,32,0.45)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                        {[
                          [null, 'X', null],
                          ['X', 'X_HL', null],
                          ['O', null, null],
                        ].map((row, ri) => (
                          <div
                            key={ri}
                            className="flex"
                            style={{ borderBottom: ri < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                          >
                            {row.map((cell, ci) => (
                              <div
                                key={ci}
                                className="flex-1 flex items-center justify-center font-black text-2xl"
                                style={{
                                  aspectRatio: '1',
                                  borderRight: ci < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                  background: cell === 'X_HL' ? '#24252d' : 'transparent',
                                  color: (cell === 'X' || cell === 'X_HL') ? 'var(--color-primary, #8ff5ff)' : cell === 'O' ? 'var(--color-tertiary, #ff51fa)' : 'transparent',
                                  boxShadow: cell === 'X_HL' ? 'inset 0 0 18px rgba(143,245,255,0.10)' : 'none',
                                }}
                              >
                                {cell === 'X_HL' ? 'X' : cell}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={300} className="h-full">
                <motion.div whileHover={{ scale: 1.02 }} className="h-full group relative overflow-hidden rounded-[2rem] bg-surface-container p-12 transition-colors duration-500 hover:bg-surface-container-high border border-outline-variant/10">
                  <span className="material-symbols-outlined text-4xl text-tertiary mb-6" aria-hidden="true">draw</span>
                  <h3 className="text-3xl font-bold mb-4">Air Drawing</h3>
                  <p className="text-secondary mb-8 leading-relaxed">
                    Magical AI-powered drawing in mid-air. Use your camera to paint digital strokes across the room.
                  </p>
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                    <Image
                      fill
                      className="object-cover"
                      alt="Player drawing in mid-air using hand gestures on PlayOnMeet"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqWyqtHHy8EmTjp8313cYVI1vbHAxH0DSs4cbdPYtfjxrbHokJRF56c1V0lJR6Igq7xEE8D5aSWao3f_pE0XHKz06lgjgqFPjNXHnTXNGBu2vlQwdt_eQ3QnQKaFoxkq11XjmxSRe8li_Ek5b8k1Mx-bmFwPv2dGNHHAxHGwsywNbLAH3MA77z03WJlrcd_EV6h_wv8GdjNFhwe4cjavJWSZOLt9ffrdFktqtxtKShnnojGxq7r84CIeLeEBAgsjc7qAAAHszuEr74"
                    />
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The Playbook (How to Play) Section */}
        <section id="how-to-play" className="py-32 px-8 bg-surface-container-lowest/50 relative">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="text-center mb-24">
              <h2 className="text-5xl font-black tracking-tighter mb-6">The Playbook</h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">Seamless interaction in three simple steps. Powered by real-time AI spatial tracking.</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: "Ignite",
                  desc: "Start a session instantly. No accounts, no downloads. Just click 'Start Session' and enter the arena.",
                  icon: "bolt",
                  color: "primary"
                },
                {
                  step: "02",
                  title: "Sync",
                  desc: "Share your room code or portal link. Your friends join directly in their browser for instant multiplayer sync.",
                  icon: "share",
                  color: "tertiary"
                },
                {
                  step: "03",
                  title: "Interact",
                  desc: "Use your hands. Pinch to draw digital ink, Open Hand to erase. Reality is your canvas.",
                  icon: "back_hand",
                  color: "white"
                }
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 200} className="relative z-10">
                  <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 group hover:border-primary/20 transition-all duration-500 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/20 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <span className={`material-symbols-outlined text-3xl text-${item.color === 'white' ? 'white' : item.color}`}>{item.icon}</span>
                    </div>
                    <div className="text-xs font-black tracking-[0.3em] text-primary/40 mb-2">{item.step}</div>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Future Tech Highlight */}
            {/* <ScrollReveal delay={500} className="mt-24 p-8 glass-panel rounded-[2rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  The Tech Behind the Magic
                </h4>
                <p className="text-secondary text-sm leading-relaxed">
                  PlayOnMeet leverages <strong>MediaPipe AI</strong> for low-latency hand tracking and <strong>PeerJS</strong> for secure, real-time spatial synchronization—bringing "future tech" to your daily video calls.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary/70">AI Hand Tracking</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-tertiary/70">P2P Real-time</div>
              </div>
            </ScrollReveal> */}
          </div>
        </section>

        {/* Gaming Arena Section */}
        <section id="games" className="py-32 px-8" aria-label="Game Library">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-5xl font-extrabold tracking-tighter mb-6">Gaming Arena</h2>
                  <p className="text-xl text-secondary">Our curated suite of high-fidelity social games designed for intimacy and competition.</p>
                </div>
                <button className="group flex items-center gap-3 text-primary font-bold text-lg hover:opacity-80 transition-opacity">
                  View All Games <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                </button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <ScrollReveal delay={150}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative group h-[450px] rounded-[2.5rem] overflow-hidden bg-surface-container border border-outline-variant/10 shadow-lg transition-colors duration-500">
                  <Image
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Play Social XOX — Online multiplayer Tic-Tac-Toe for video calls"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwGlcBTu8pkdcotoIV8974QAcMJBb3n1P7-iIwfEH4G5ZAabFkOwyml51FyUUd9-P-lrgQvXMUmWuFP3MKH-kqOJScWAvpQsLBpaqAcT1jkg20NA8hyUZXQBYrX9szRKdf4xeVKNIYGsSRzYmLSlegWqSEXvEAu9u5OAs4C465Oaw7mtqUsn3W0_Zjf_A3tT36dALFfHqkj15XPO3fSinKtvrRQTObzkW5UgPkVQF1XHSPQUmrJw0HCEljwK7iVhnHCy2oppfXE_F"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 w-full">
                    <h4 className="text-3xl font-bold mb-2">Social XOX</h4>
                    <p className="text-on-surface-variant mb-6">The ultimate icebreaker.</p>
                    <button onClick={openCreateModal} className="w-full py-4 rounded-full bg-primary text-on-primary font-bold transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0" aria-label="Play Social XOX now">Play Now</button>
                  </div>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative group h-[450px] rounded-[2.5rem] overflow-hidden bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center p-10 grayscale hover:grayscale-0 transition-colors duration-500">
                  <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-4xl text-outline-variant" aria-hidden="true">casino</span>
                  </div>
                  <h4 className="text-3xl font-bold mb-4">Ludo Master</h4>
                  <div className="px-6 py-2 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary font-bold text-sm uppercase tracking-widest">Arriving Soon</div>
                  <p className="mt-6 text-on-surface-variant leading-relaxed">
                    A legendary classic reimagined with PlayOnMeet's premium visual signature and social mechanics.
                  </p>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={450}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative group h-[450px] rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 p-10 flex flex-col justify-end">
                  <div className="absolute top-10 left-10 text-outline-variant font-black text-6xl opacity-10 uppercase tracking-tighter" aria-hidden="true">Next Gen</div>
                  <div className="space-y-4">
                    <div className="h-1 w-12 bg-outline-variant/30 rounded-full"></div>
                    <h4 className="text-2xl font-bold text-secondary">Expanding the Suite</h4>
                    <p className="text-on-surface-variant">We are constantly crafting new ways to play and connect. Stay tuned for the next drop.</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section — Triggers Rich Snippets in Search Results */}
        <section className="py-32 px-8" aria-label="Frequently Asked Questions">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal delay={100}>
              <h2 className="text-4xl font-black tracking-tight mb-16 text-center">Frequently Asked Questions</h2>
            </ScrollReveal>
            <div className="space-y-6">
              {[
                { q: "How do I play games on Google Meet or Zoom?", a: "PlayOnMeet is built specifically for video call environments. Simply open the app, create a room, and share your screen. Your friends can join via a simple room code, and you can all play using hand gestures without ever leaving the call window." },
                { q: "Do I need to install any software or extensions?", a: "No. PlayOnMeet runs entirely in your browser using advanced AI hand-tracking. This means no downloads, no security risks, and instant accessibility for everyone on your team." },
                { q: "Is PlayOnMeet really free for teams?", a: "Yes. Our core gaming suite, including Social XOX and Air Drawing, is completely free to use. We believe social connection on video calls should be accessible to every remote and hybrid team." },
                { q: "Which browsers are supported?", a: "We recommend Google Chrome or Microsoft Edge for the most stable AI processing, but PlayOnMeet works on all modern desktop browsers that support webcam access." },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={150 + i * 50}>
                  <details className="group glass-panel rounded-3xl border border-outline-variant/10 overflow-hidden" aria-labelledby={`faq-q-${i}`}>
                    <summary id={`faq-q-${i}`} className="flex justify-between items-center p-8 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
                      <span className="text-lg font-bold pr-6">{item.q}</span>
                      <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180" aria-hidden="true">expand_more</span>
                    </summary>
                    <div className="px-8 pb-8 text-secondary leading-relaxed animate-in fade-in slide-in-from-top-2">
                      {item.a}
                    </div>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8">
          <ScrollReveal delay={100}>
            <div className="max-w-5xl mx-auto glass-panel rounded-[3rem] p-16 text-center border border-primary/10 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary/10 blur-[80px] rounded-full"></div>
              <h2 className="text-5xl font-extrabold mb-8 playonmeet-gradient leading-tight">Ready to transcend<br />ordinary gaming?</h2>
              <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">Start a session in seconds. No hurdles, no fluff. Just pure, elegant interaction.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-12 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-black text-xl shadow-2xl shadow-primary/30 transition-opacity duration-300" aria-label="Start your gaming session now">
                  Start Session
                </motion.button>
                <div className="text-outline-variant text-sm font-medium">No account required to join</div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1326] w-full py-12 px-8 tonal-shift-high" role="contentinfo">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8 font-['Plus_Jakarta_Sans'] text-sm">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <BrandLogo className="text-xl" />
            <div className="text-[#bcc7de] leading-relaxed">© 2026 PlayOnMeet Social Gaming. All rights reserved.</div>
            <div className="text-[#bcc7de]/60 text-xs tracking-[0.2em] font-semibold mt-2 flex items-center justify-center md:justify-start gap-2">
              BUILT WITH VISIONS BY
              <div className="relative inline-block group cursor-default">
                <span className="playonmeet-gradient font-black tracking-normal text-sm group-hover:opacity-0 transition-opacity duration-500">PRAYAG</span>
                <span className="absolute inset-0 font-black tracking-normal text-sm text-primary opacity-0 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(192,193,255,0.8)] transition-all duration-500">PRAYAG</span>
              </div>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#" aria-label="Join our community">Community</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#" aria-label="Join us on Twitter">Twitter</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#" aria-label="Join our Discord">Discord</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#" aria-label="Contact support">Support</a>
          </div>
        </div>
      </footer>

      {/* Input Modal Overlay */}
      <AnimatePresence>
        {showInputModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8"
            role="dialog"
            aria-modal="true"
            aria-label={modalMode === 'join' ? 'Join a Match' : 'Create a Session'}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-panel w-full max-w-md rounded-3xl p-8 border border-outline-variant/30 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold playonmeet-gradient mb-6">
                {modalMode === 'join' ? 'Join a Match' : 'Create a Session'}
              </h3>

              <div className="space-y-4 mb-8">
                <div>
                  <label htmlFor="nickname" className="block text-secondary text-sm font-bold mb-2">NICKNAME</label>
                  <input
                    id="nickname"
                    type="text"
                    autoFocus
                    placeholder="Enter your nickname"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:border-primary transition-colors mb-6"
                    spellCheck="false"
                    maxLength={15}
                    aria-required="true"
                  />
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-secondary text-sm font-bold uppercase tracking-widest">Choose Your Avatar</label>
                    <button onClick={randomizeAvatars} className="flex items-center gap-1 text-primary hover:text-primary-container transition-colors text-xs font-bold uppercase tracking-widest" aria-label="Get new avatar options">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }} aria-hidden="true">refresh</span>
                      Shuffle
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Select avatar">
                    {avatarOptions.map((avatarName) => (
                      <div
                        key={avatarName}
                        role="radio"
                        aria-checked={localAvatar === avatarName}
                        onClick={() => setLocalAvatar(avatarName)}
                        className={`cursor-pointer rounded-2xl border-2 p-2 flex items-center justify-center transition-all ${localAvatar === avatarName
                          ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(192,193,255,0.4)] scale-105'
                          : 'border-outline-variant/30 bg-surface-container-highest hover:border-primary/50 hover:scale-105'
                          }`}
                      >
                        <div className="relative w-16 h-16 drop-shadow-md">
                          <Image
                            fill
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarName}&backgroundColor=transparent`}
                            alt={`Avatar Option ${avatarName}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {modalMode === 'join' && (
                  <div>
                    <label htmlFor="room-code" className="block text-secondary text-sm font-bold mb-2">ROOM CODE</label>
                    <input
                      id="room-code"
                      type="text"
                      placeholder="Enter Room Code"
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                      className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:border-primary transition-colors uppercase tracking-widest"
                      spellCheck="false"
                      maxLength={5}
                      aria-required="true"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowInputModal(false)} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all" aria-label="Cancel and close modal">Cancel</button>
                <button
                  onClick={submitModal}
                  disabled={!localName.trim() || (modalMode === 'join' && inputRoomCode.trim().length !== 5)}
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label={modalMode === 'join' ? 'Join the match now' : 'Start your session now'}
                >
                  {modalMode === 'join' ? 'Join Now' : 'Start Session'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Feedback Chatbot Widget ── */}
      <FeedbackChatbot />
    </div>
  );
}
