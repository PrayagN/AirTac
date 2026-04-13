"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackIcon from "./FeedbackIcon";

export default function FeedbackChatbot() {
  const [showBubble, setShowBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const bubbleTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Show bubble teaser after 5 seconds, then hide it after 4 seconds
  useEffect(() => {
    bubbleTimerRef.current = setTimeout(() => {
      if (!isOpen) {
        setShowBubble(true);
        hideTimerRef.current = setTimeout(() => {
          setShowBubble(false);
        }, 4000);
      }
    }, 5000);

    return () => {
      clearTimeout(bubbleTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setShowBubble(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStatus("idle");
    setEmail("");
    setFeedback("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !feedback.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <>
      {/* ────────── Floating Chatbot Button ────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "12px",
        }}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {showBubble && !isOpen && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 260 }}
              onClick={handleOpen}
              style={{
                background: "linear-gradient(135deg,#1e2a4a 0%,#2d1f5e 100%)",
                border: "1px solid rgba(192,193,255,0.25)",
                borderRadius: "18px 18px 4px 18px",
                padding: "12px 16px",
                maxWidth: "220px",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(192,193,255,0.1)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#c0c1ff",
                  lineHeight: 1.5,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Don&apos;t forget to share your feedback!{" "}
                <span style={{ color: "#ddb7ff" }}>👇</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot button */}
        <motion.button
          onClick={handleOpen}
          onMouseEnter={() => !isOpen && setShowBubble(true)}
          onMouseLeave={() => !isOpen && setShowBubble(false)}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.12, y: 0 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open Feedback"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            boxShadow: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            position: "relative",
          }}
        >
          <FeedbackIcon size={72} />
        </motion.button>
      </div>

      {/* ────────── Feedback Modal ────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: "28px",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.94 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "400px",
                background:
                  "linear-gradient(160deg, rgba(15,22,45,0.97) 0%, rgba(26,14,58,0.97) 100%)",
                border: "1px solid rgba(192,193,255,0.18)",
                borderRadius: "28px",
                padding: "28px",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(192,193,255,0.08)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 800,
                      background:
                        "linear-gradient(90deg,#c0c1ff,#ddb7ff,#06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Share Your Feedback
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "#8892b0",
                    }}
                  >
                    We read every single response
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    color: "#8892b0",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.14)")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.07)")
                  }
                >
                  ✕
                </button>
              </div>

              {/* ── Success state ── */}
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "32px 0" }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                  <h4
                    style={{
                      margin: "0 0 8px",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#c0c1ff",
                    }}
                  >
                    Thank you!
                  </h4>
                  <p style={{ margin: 0, color: "#8892b0", fontSize: "14px" }}>
                    Your feedback has been recorded. We truly appreciate it!
                  </p>
                  <button
                    onClick={handleClose}
                    style={{
                      marginTop: "24px",
                      padding: "10px 28px",
                      borderRadius: "999px",
                      border: "none",
                      background:
                        "linear-gradient(90deg,#7c3aed,#4f46e5)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8892b0",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(192,193,255,0.18)",
                        background: "rgba(255,255,255,0.05)",
                        color: "#e2e8f0",
                        fontSize: "14px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(192,193,255,0.5)")
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(192,193,255,0.18)")
                      }
                    />
                  </div>

                  {/* Feedback */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8892b0",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Your Feedback
                    </label>
                    <textarea
                      required
                      placeholder="Tell us what you love, hate, or wish for..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(192,193,255,0.18)",
                        background: "rgba(255,255,255,0.05)",
                        color: "#e2e8f0",
                        fontSize: "14px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(192,193,255,0.5)")
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(192,193,255,0.18)")
                      }
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          margin: 0,
                          color: "#f87171",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        ⚠️ {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "14px",
                      borderRadius: "999px",
                      border: "none",
                      background:
                        status === "loading"
                          ? "rgba(124,58,237,0.5)"
                          : "linear-gradient(90deg,#7c3aed 0%,#4f46e5 60%,#06b6d4 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "15px",
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                      transition: "background 0.3s",
                    }}
                  >
                    {status === "loading" ? "Sending…" : "Send Feedback"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
