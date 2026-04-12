"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackChatbot from './FeedbackChatbot';

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
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 1024;
    if (isTouchDevice || isNarrow) {
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
              onClick={() => setShowMobileToast(false)}
              aria-label="Dismiss"
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
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl dark:bg-[#0b1326]/60 shadow-[0_8px_32px_0_rgba(11,19,38,0.08)]">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto font-['Plus_Jakarta_Sans'] tracking-tight">
          <div className="text-2xl font-bold tracking-tighter text-[#c0c1ff]">Obsidian Gaming</div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-[#c0c1ff] font-semibold border-b border-[#c0c1ff]/30 transition-opacity duration-300" href="#">How it works</a>
            <a className="text-[#bcc7de] hover:text-[#c0c1ff] transition-opacity duration-300" href="#games">Games</a>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-6 py-2 rounded-full border border-outline-variant/30 text-[#bcc7de] hover:opacity-80 transition-opacity duration-300">Start Session</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openJoinModal} className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-semibold hover:opacity-80 transition-opacity duration-300">Join Room</motion.button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden px-8">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <ScrollReveal delay={100}>
                <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm tracking-wide uppercase">The Future of Interaction</span>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-8 obsidian-gradient-text">
                  Social Gaming,<br />Redefined.
                </h1>
                <p className="text-xl text-secondary max-w-xl mb-12 leading-relaxed">
                  Experience the next evolution of social play. Obsidian blends seamless video calls with high-fidelity interactive gaming for a lounge-style digital experience.
                </p>
                <div className="flex flex-wrap gap-6">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openJoinModal} className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg hover:opacity-90 shadow-xl shadow-primary/20 transition-opacity duration-300">
                    Enter Room Code
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-10 py-4 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface font-bold text-lg hover:bg-surface-variant transition-colors duration-300">
                    Learn More
                  </motion.button>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-5 relative">
              <ScrollReveal delay={300}>
                <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden glass-panel border border-outline-variant/10 shadow-2xl">
                  <img className="w-full h-full object-cover opacity-80" alt="abstract 3D rendered floating geometric obsidian shapes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo6QeQXNMpoiUm-GMk6BFZ_i-5MrfD66rESvKOvL_6xde8vyPxeTCXNBEe8oOlnE2JhRrYZejgA_fuMUGSQK4xgexSbxat-I5hp_LgmGHXfOoTv11kuCgzZwDh43AY2_aETs3et8f3sr9DG6qQfneMdC1MhGi8GyzfGvV93oFcUIpYc4C1kKtSdXJPTQxFB6XCqsG6m1z6xfqLGFOSSaocqmJRX591u1jTTqwsOKGK0Ik4Oz7nQVNS_Z9e37R8FYB3hEfevDfvRHiJ" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-tertiary/20 blur-[120px] rounded-full"></div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-8 bg-surface-container-lowest">
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
                      <span className="material-symbols-outlined text-3xl text-primary mb-5" style={{ fontVariationSettings: "'FILL' 0,'wght' 300" }}>videocam</span>
                      <h3 className="text-3xl font-bold mb-4">Social XOX</h3>
                      <p className="text-secondary leading-relaxed">
                        Classic Tic-Tac-Toe, elevated for the modern age. Play with friends while keeping the conversation flowing. Our interface places gameplay front and center without ever obscuring your connections.
                      </p>
                    </div>
                    {/* Right: Live XOX Preview */}
                    <div className="flex-1 w-full flex flex-col items-center gap-4">
                      {/* Players vs Row */}
                      <div className="flex items-center justify-center gap-3 w-full">
                        {/* Player 1 */}
                        <div className="relative">
                          <div className="w-[88px] h-[72px] rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg">
                            <img
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="Player 1"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#1e1f26] border border-primary/30 flex items-center justify-center text-primary font-black text-xs shadow-md">X</div>
                        </div>
                        {/* VS */}
                        <div className="px-2.5 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface-variant text-xs font-bold tracking-widest">vs</div>
                        {/* Player 2 */}
                        <div className="relative">
                          <div className="w-[88px] h-[72px] rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg">
                            <img
                              src="https://randomuser.me/api/portraits/women/44.jpg"
                              alt="Player 2"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#1e1f26] border border-tertiary/30 flex items-center justify-center text-tertiary font-black text-xs shadow-md">O</div>
                        </div>
                      </div>
                      {/* 3x3 Game Grid */}
                      <div className="grid grid-cols-3 gap-2 w-full max-w-[220px]">
                        {/* Row 1 */}
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center" />
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-black text-2xl">X</div>
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center" />
                        {/* Row 2 */}
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary font-black text-2xl">O</div>
                        <div className="aspect-square rounded-xl bg-[#2a2c34] border border-primary/20 shadow-[0_0_12px_rgba(143,245,255,0.15)] flex items-center justify-center text-primary font-black text-2xl">X</div>
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center" />
                        {/* Row 3 */}
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center" />
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary font-black text-2xl">O</div>
                        <div className="aspect-square rounded-xl bg-surface-container-high flex items-center justify-center" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={300} className="h-full">
                <motion.div whileHover={{ scale: 1.02 }} className="h-full group relative overflow-hidden rounded-[2rem] bg-surface-container p-12 transition-colors duration-500 hover:bg-surface-container-high border border-outline-variant/10">
                  <span className="material-symbols-outlined text-4xl text-tertiary mb-6">draw</span>
                  <h3 className="text-3xl font-bold mb-4">Air Drawing</h3>
                  <p className="text-secondary mb-8 leading-relaxed">
                    Magical AI-powered drawing in mid-air. Use your camera to paint digital strokes across the room.
                  </p>
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                    <img className="w-full h-full object-cover" alt="air drawing close up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqWyqtHHy8EmTjp8313cYVI1vbHAxH0DSs4cbdPYtfjxrbHokJRF56c1V0lJR6Igq7xEE8D5aSWao3f_pE0XHKz06lgjgqFPjNXHnTXNGBu2vlQwdt_eQ3QnQKaFoxkq11XjmxSRe8li_Ek5b8k1Mx-bmFwPv2dGNHHAxHGwsywNbLAH3MA77z03WJlrcd_EV6h_wv8GdjNFhwe4cjavJWSZOLt9ffrdFktqtxtKShnnojGxq7r84CIeLeEBAgsjc7qAAAHszuEr74" />
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Gaming Arena Section */}
        <section id="games" className="py-32 px-8">
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
                  <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="xox board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwGlcBTu8pkdcotoIV8974QAcMJBb3n1P7-iIwfEH4G5ZAabFkOwyml51FyUUd9-P-lrgQvXMUmWuFP3MKH-kqOJScWAvpQsLBpaqAcT1jkg20NA8hyUZXQBYrX9szRKdf4xeVKNIYGsSRzYmLSlegWqSEXvEAu9u5OAs4C465Oaw7mtqUsn3W0_Zjf_A3tT36dALFfHqkj15XPO3fSinKtvrRQTObzkW5UgPkVQF1XHSPQUmrJw0HCEljwK7iVhnHCy2oppfXE_F" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 w-full">
                    <h4 className="text-3xl font-bold mb-2">Social XOX</h4>
                    <p className="text-on-surface-variant mb-6">The ultimate icebreaker.</p>
                    <button onClick={openCreateModal} className="w-full py-4 rounded-full bg-primary text-on-primary font-bold transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">Play Now</button>
                  </div>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative group h-[450px] rounded-[2.5rem] overflow-hidden bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center p-10 grayscale hover:grayscale-0 transition-colors duration-500">
                  <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-8 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">casino</span>
                  </div>
                  <h4 className="text-3xl font-bold mb-4">Ludo Master</h4>
                  <div className="px-6 py-2 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary font-bold text-sm uppercase tracking-widest">Arriving Soon</div>
                  <p className="mt-6 text-on-surface-variant leading-relaxed">
                    A legendary classic reimagined with Obsidian's premium visual signature and social mechanics.
                  </p>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={450}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative group h-[450px] rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 p-10 flex flex-col justify-end">
                  <div className="absolute top-10 left-10 text-outline-variant font-black text-6xl opacity-10 uppercase tracking-tighter">Next Gen</div>
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

        {/* CTA Section */}
        <section className="py-32 px-8">
          <ScrollReveal delay={100}>
            <div className="max-w-5xl mx-auto glass-panel rounded-[3rem] p-16 text-center border border-primary/10 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary/10 blur-[80px] rounded-full"></div>
              <h2 className="text-5xl font-extrabold mb-8 obsidian-gradient-text leading-tight">Ready to transcend<br />ordinary gaming?</h2>
              <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">Start a session in seconds. No hurdles, no fluff. Just pure, elegant interaction.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openCreateModal} className="px-12 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-black text-xl shadow-2xl shadow-primary/30 transition-opacity duration-300">
                  Start Session
                </motion.button>
                <div className="text-outline-variant text-sm font-medium">No account required to join</div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1326] w-full py-12 px-8 tonal-shift-high">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8 font-['Plus_Jakarta_Sans'] text-sm">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div className="text-lg font-bold text-[#bcc7de]">Obsidian Gaming</div>
            <div className="text-[#bcc7de] leading-relaxed">© 2026 Obsidian Social Gaming. All rights reserved.</div>
            <div className="text-[#bcc7de]/60 text-xs tracking-[0.2em] font-semibold mt-2 flex items-center justify-center md:justify-start gap-2">
              BUILT WITH VISIONS BY
              <div className="relative inline-block group cursor-default">
                <span className="obsidian-gradient-text font-black tracking-normal text-sm group-hover:opacity-0 transition-opacity duration-500">PRAYAG</span>
                <span className="absolute inset-0 font-black tracking-normal text-sm text-primary opacity-0 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(192,193,255,0.8)] transition-all duration-500">PRAYAG</span>
              </div>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#">Community</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#">Twitter</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#">Discord</a>
            <a className="text-[#bcc7de] hover:text-[#ddb7ff] transition-colors duration-300" href="#">Support</a>
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
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-panel w-full max-w-md rounded-3xl p-8 border border-outline-variant/30 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold obsidian-gradient-text mb-6">
                {modalMode === 'join' ? 'Join a Match' : 'Create a Session'}
              </h3>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-secondary text-sm font-bold mb-2">NICKNAME</label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter your nickname"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:border-primary transition-colors mb-6"
                    spellCheck="false"
                    maxLength={15}
                  />
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-secondary text-sm font-bold uppercase tracking-widest">Choose Your Avatar</label>
                    <button onClick={randomizeAvatars} className="flex items-center gap-1 text-primary hover:text-primary-container transition-colors text-xs font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>refresh</span>
                      Shuffle
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarOptions.map((avatarName) => (
                      <div
                        key={avatarName}
                        onClick={() => setLocalAvatar(avatarName)}
                        className={`cursor-pointer rounded-2xl border-2 p-2 flex items-center justify-center transition-all ${localAvatar === avatarName
                            ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(192,193,255,0.4)] scale-105'
                            : 'border-outline-variant/30 bg-surface-container-highest hover:border-primary/50 hover:scale-105'
                          }`}
                      >
                        <img
                          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarName}&backgroundColor=transparent`}
                          alt="Avatar Option"
                          className="w-16 h-16 drop-shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {modalMode === 'join' && (
                  <div>
                    <label className="block text-secondary text-sm font-bold mb-2">ROOM CODE</label>
                    <input
                      type="text"
                      placeholder="Enter Room Code"
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                      className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-semibold focus:outline-none focus:border-primary transition-colors uppercase tracking-widest"
                      spellCheck="false"
                      maxLength={5}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowInputModal(false)} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all">Cancel</button>
                <button
                  onClick={submitModal}
                  disabled={!localName.trim() || (modalMode === 'join' && inputRoomCode.trim().length !== 5)}
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
