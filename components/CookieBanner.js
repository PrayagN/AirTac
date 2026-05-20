"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already consented
    const consent = localStorage.getItem("playonmeet-cookie-consent");
    if (!consent) {
      // Show banner after a brief delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    localStorage.setItem("playonmeet-cookie-consent", "accepted-all");
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("playonmeet-cookie-consent", "accepted-essential");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            right: "24px",
            zIndex: 9999,
            maxWidth: "520px",
            background: "rgba(11, 19, 38, 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(192, 193, 255, 0.15)",
            borderRadius: "1.5rem",
            padding: "20px 24px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
          className="mx-auto md:ml-6 md:mr-auto"
        >
          <div className="flex flex-col gap-4 font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <div className="flex items-start gap-3">
              <span 
                className="material-symbols-outlined text-[#c0c1ff] mt-0.5"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                cookie
              </span>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  We value your privacy
                </h4>
                <p className="text-xs text-[#bcc7de]/80 leading-relaxed mt-1">
                  We use cookies to optimize game performance, analyze platform traffic, and deliver personalized AdSense ads. Our hand-tracking webcam feeds are processed entirely locally and are never stored. Read our{" "}
                  <Link 
                    href="/privacy-policy" 
                    className="text-[#c0c1ff] hover:text-[#ddb7ff] underline transition-colors"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-1 justify-end">
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-[#bcc7de] hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] text-[#0a0a0b] text-xs font-bold hover:opacity-90 shadow-md shadow-[#c0c1ff]/10 transition-all duration-300"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
